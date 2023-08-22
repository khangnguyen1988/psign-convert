export const mergeObject = (localStorageKey, values) => {
  const item = JSON.parse(localStorage.getItem(localStorageKey)) || {}

  Object.keys(values).forEach((k) => {
    if (!item[k]) {
      item[k] = values[k]
    }
  })
  localStorage.setItem(localStorageKey, JSON.stringify(item))
  return item
}

export const removeKeys = (localStorageKey, keys) => {
  const item = JSON.parse(localStorage.getItem(localStorageKey)) || {}

  keys.forEach((k) => {
    if (item[k]) {
      delete item[k]
    }
  })
  localStorage.setItem(localStorageKey, JSON.stringify(item))
  return item
}

export const addArrayItems = (localStorageKey, values) => {
  let items = JSON.parse(localStorage.getItem(localStorageKey)) || []
  items = items.concat([
    ...values
  ])
  localStorage.setItem(localStorageKey, JSON.stringify(items))
}

export default {
  mergeObject,
  removeKeys,
  addArrayItems
}
