import { PDFDocument } from 'pdf-lib'
import FileProxy from '@/store/proxies/file-proxy'

const COLORS = ['orange', 'blue', 'green', 'purple', 'gray', 'gray-2', 'orange-2', 'red']

export const hashCode = (str) => {
  let hash = 0
  if (str.length === 0) return hash
  for (let i = 0; i < str.length; i++) {
    const chr = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + chr
    hash |= 0 // Convert to 32bit integer
  }
  return hash
}

export const getColorClass = (name) => {
  const idx = Math.abs(hashCode(name) % 10)
  if (idx > COLORS.length - 1) {
    return `c-${COLORS[idx % COLORS.length]}`
  }
  return `c-${COLORS[idx]}`
}

export const getColor = (name) => {
  const className = getColorClass(name)
  const result = {
    'c-blue': '#005BE2',
    'c-orange': '#E26D00',
    'c-green': '#21854A',
    'c-purple': '#B06DB1',
    'c-gray': '#373a4f',
    'c-gray-2': '#979CCC',
    'c-orange-2': '#C25757',
    'c-red': '#D41717'
  }
  return result[className]
}

export const getFile = ({ fileId, externalSignUuid, fileSize, fromMultipleChunks, onDownloadProgress }) => {
  const proxy = new FileProxy()
  if (!externalSignUuid) {
    if (fromMultipleChunks) {
      return proxy.getFileAndMergeFromMultipleChunks({ fileId, fileSize })
    }
    return proxy.getFile(fileId, onDownloadProgress)
  }
  return proxy.getFileByAnonymousUser({ id: fileId, uuid_url: externalSignUuid })
}

export const getFilesInfo = (fileIds, externalSignUuid) => new Promise((resolve, reject) => {
  const proxy = new FileProxy()
  const mapFileInfo = (file) => ({
    id: file.id,
    name: file.file_meta_data.file_name,
    path: file.file_meta_data.file_path,
    contentType: file.file_meta_data.content_type,
    size: file.file_meta_data.file_size,
    status: file.mark
  })

  if (!externalSignUuid) {
    proxy.getFiles(fileIds).then(res => {
      resolve(res.map(mapFileInfo))
    }).catch((e) => {
      reject(e)
    })
  } else {
    proxy.getFilesByAnonymousUser(fileIds).then(res => {
      resolve(res.map(mapFileInfo))
      console.log(fileIds)
    }).catch((e) => {
      reject(e)
    })
  }
})

export const loadPdf = (fileInfo, externalSignUuid, onDownloadProgress) => new Promise((resolve, reject) => {
  getFile({
    fileId: fileInfo.id,
    externalSignUuid,
    onDownloadProgress
  }).then((pdfBytes) => {
    pdfBytes.arrayBuffer().then((buffer) => {
      const pdfDataSrc = URL.createObjectURL(new Blob([buffer], {
        type: 'application/pdf'
      }))
      resolve({
        buffer,
        dataSrc: pdfDataSrc
      })
    })
  }, (error) => {
    reject(error)
  })
})

function signDocumentAsync (file, signatures, externalSignUuid, onDownloadProgress) {
  return new Promise((resolve, reject) => {
    loadPdf(file, externalSignUuid, onDownloadProgress).then(({ buffer }) => {
      if (!signatures) {
        const pdfFile = new File([buffer], file.name)
        resolve(pdfFile)
        return
      }
      PDFDocument.load(buffer).then((pdfDoc) => {
        const pages = pdfDoc.getPages()

        Promise.all(signatures.map(s => new Promise((_resolve) => {
          const embeddedImage = s.image.type === 'image/png' ? pdfDoc.embedPng(s.image.arrayBuffer) : pdfDoc.embedJpg(s.image.arrayBuffer)
          embeddedImage.then((embeddedImageResponse) => {
            _resolve({
              ...s,
              embeddedImage: embeddedImageResponse
            })
          })
        }))).then((signatureResponses) => {
          signatureResponses.forEach((s) => {
            const page = pages[s.page - 1]
            page.drawImage(s.embeddedImage, {
              x: s.left,
              y: page.getHeight() - (s.top + s.height),
              width: s.width,
              height: s.height
            })
          })
          pdfDoc.save().then((pdfBytes) => {
            const newPdfFile = new File([pdfBytes], file.name, {
              type: 'application/pdf'
            })

            resolve({ file: newPdfFile, fileId: file.id, bytes: pdfBytes, status: file.status })
          })
        })
      })
    }, error => {
      reject(error)
    })
  })
}

export const createSignatureMarkup = (options) => {
  const signType = options.signType || null
  const name = options.name || 'Chữ ký của bạn'

  return new Promise((resolve) => {
    const width = signType !== 'SIGNATURE_IMAGE' ? 500 : 300
    const height = signType !== 'SIGNATURE_IMAGE' ? 100 : 300
    const x = signType !== 'SIGNATURE_IMAGE' ? 250 : 150
    const y = signType !== 'SIGNATURE_IMAGE' ? 60 : 150

    const canvas = document.createElement('canvas')
    canvas.setAttribute('width', `${width}px`)
    canvas.setAttribute('height', `${height}px`)
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, 300, 300)
    ctx.textAlign = 'center'
    ctx.font = '2.5rem Google Sans'
    ctx.fillStyle = getColor(name)
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = '#fff'
    ctx.fillText(name, x, y)
    canvas.toBlob((blob) => {
      blob.arrayBuffer().then((res) => {
        resolve({ type: blob.type, arrayBuffer: res, userName: name })
      })
    }, 'image/png')
  })
}

const getFormattedFileWithSignatures = (documentFiles, documentSignedPersons) => new Promise((resolve) => {
  Promise.all(documentSignedPersons.map(signedPerson => (createSignatureMarkup({
    signType: signedPerson.signed_type,
    name: signedPerson.email || signedPerson.user_id.name
  })))).then((placeHolderImages) => {
    const result = documentFiles.map((file) => {
      let signatures = []
      documentSignedPersons.forEach((signedPerson) => {
        const personName = signedPerson.email || signedPerson.user_id.name
        let image = placeHolderImages.filter(img => img.userName === personName)
        image = image && image.length > 0 ? image[0] : null
        const userId = signedPerson.email ? 0 : signedPerson.user_id.user.id
        const personSignatures = signedPerson.document_signatures.filter(s => s.file_id === file.id && s.user_id === userId).map((s) => {
          const convertPxToInt = numberPx => parseInt(numberPx.replace('px', ''), 0)
          return {
            image,
            page: s.page,
            top: convertPxToInt(s.top),
            bottom: convertPxToInt(s.bottom),
            left: convertPxToInt(s.left),
            width: convertPxToInt(s.width),
            height: convertPxToInt(s.height)
          }
        })
        signatures = signatures.concat(personSignatures)
      })
      return {
        file,
        signatures
      }
    })
    resolve(result)
  })
})

export const renderSignaturePlaceHolders = (documentModel, onDownloadProgress) => new Promise((resolve, reject) => {
  getFilesInfo(documentModel.files_id, documentModel.externalSignUuid).then((res) => {
    const documentFiles = res
    if (!documentFiles || documentFiles.length === 0) {
      resolve([])
      return
    }

    const signedPersonWithSignatures = documentModel.signed_persons
      ? documentModel.signed_persons.filter(
        p => p.signed_type !== 'SIGNATURE_APP_CONFIRMATION' &&
      p.signed_type !== 'VIEW' && !p.signed_at
      )
      : []

    getFormattedFileWithSignatures(
      documentFiles,
      signedPersonWithSignatures).then((rp) => {
      const actions = rp.filter(r => r.signatures)
        .map(({ file, signatures }) => signDocumentAsync(file,
          signatures,
          documentModel.externalSignUuid, onDownloadProgress))

      Promise.all(actions).then((response) => {
        resolve(response)
      }, error => {
        reject(error)
      })
    })
  }, error => {
    reject(error)
  })
})

export default {
  hashCode,
  getColor,
  getColorClass,
  createSignatureMarkup,
  renderSignaturePlaceHolders,
  getFile,
  loadPdf
}
