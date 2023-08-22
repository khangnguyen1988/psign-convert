function browseDirectory (dir, result, path, cb) {
  if (path === false) {
    path = ''
  } else {
    const item = {
      value: dir.id,
      text: path ? `${path}  /  ${dir.name}` : dir.name
    }
    result.push(item)
    if (cb) {
      cb(dir)
    }
    path = item.text
  }
  dir.children.forEach((d) => {
    browseDirectory(d, result, path, cb)
  })
  return result
}

export const setDirectoryStructure = (directoryStructure) => {
  if (!directoryStructure || Object.keys(directoryStructure).length === 0) {
    localStorage.setItem('directoryStructure', '[]')
  } else {
    localStorage.setItem('directoryStructure', JSON.stringify(directoryStructure))
  }
}

export const setDirectoryFlatStructure = (flatStructure) => {
  if (!flatStructure || Object.keys(flatStructure).length === 0) {
    localStorage.setItem('directoryFlatStructure', '[]')
  } else {
    localStorage.setItem('directoryFlatStructure', JSON.stringify(flatStructure))
  }
}

export const getDirectoryStructure = () => JSON.parse(localStorage.getItem('directoryStructure')) || []
export const getDirectoryFlatStructure = () => JSON.parse(localStorage.getItem('directoryFlatStructure')) || []

export const getDirectoryOptions = (currentStructure, cb) => {
  const directoryStructure = currentStructure || getDirectoryStructure()
  const rootDir = {
    id: 0,
    name: 'root',
    children: directoryStructure
  }
  return browseDirectory(rootDir, [], false, cb)
}

export default {
  getDirectoryOptions,
  getDirectoryStructure,
  getDirectoryFlatStructure,
  setDirectoryStructure,
  setDirectoryFlatStructure
}
