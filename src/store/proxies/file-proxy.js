import BaseProxy from './base-proxy'

const v10MB = 10000000

function roundToMB (num) {
  return Math.floor(num / 1000000) * 1000000
}
/**
 * Class FileProxy
 */
class FileProxy extends BaseProxy {
  /**
   * Constructor.
   *
   * @param {Object} parameters The query parameters.
   */
  constructor (parameters = {}) {
    super('/esign-api/api/file', parameters)
  }

  getFile (id, onDownloadProgress) {
    return this.submit('get', `${this.endpoint}/get?id=${id}`, null, {
      responseType: 'blob',
      onDownloadProgress: (progressEvent) => {
        const progress = Math.round((progressEvent.loaded / progressEvent.total) * 100)
        if (onDownloadProgress && typeof onDownloadProgress === 'function') {
          onDownloadProgress(progress)
        }
      }
    })
  }

  getFileChunk (id, chunkSize, offset) {
    return this.submit('get', `${this.endpoint}/get-chunk?id=${id}&chunk_size=${chunkSize}&offset=${offset}`, null, { responseType: 'blob' })
  }

  getFileAndMergeFromMultipleChunks ({ fileId, fileSize }) {
    let chunkSize = fileSize > v10MB ? roundToMB(Math.floor(fileSize / 5)) : 500000
    let offset = 0
    return new Promise((resolve, reject) => {
      const chunkPromises = []
      while (offset < fileSize) {
        if (chunkSize >= fileSize - offset) {
          chunkSize = fileSize - offset
        }
        chunkPromises.push(
          this.submit('get', `${this.endpoint}/get-chunk?id=${fileId}&chunk_size=${chunkSize}&offset=${offset}`,
            null,
            {
              responseType: 'blob',
              onDownloadProgress: (progressEvent) => {
                const progress = Math.round((progressEvent.loaded / progressEvent.total) * 100)
                console.info(progress)
              }

            })
        )
        offset += chunkSize
      }
      Promise.all(chunkPromises).then((blobs) => {
        const arrayBuffersAsync = blobs.map(blob => blob.arrayBuffer())
        Promise.all(arrayBuffersAsync).then(arrayBuffers => {
          resolve(new Blob(arrayBuffers))
        }, (error) => {
          reject(error)
        })
      }, (error) => {
        reject(error)
      })
    })
  }

  getFileByAnonymousUser (payload) {
    return this.submit('get', `${this.endpoint}/get-by-anonymous-user?id=${payload.id}&uuid_url=${payload.uuid_url}`, null, { responseType: 'blob' })
  }

  // Return list of file infos
  getFiles (listId) {
    if (!listId) {
      return Promise.resolve([])
    }
    return this.submit('get', `${this.endpoint}/get-files-info?files_id=${encodeURIComponent(listId.join(','))}`, null)
  }

  getFilesByAnonymousUser (listId) {
    if (!listId) {
      return Promise.resolve([])
    }
    return this.submit('get', `${this.endpoint}/get-files-info-by-anonymous-user?files_id=${encodeURIComponent(listId.join(','))}`, null)
  }
}

export default FileProxy
