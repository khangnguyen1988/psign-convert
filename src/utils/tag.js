import Vue from 'vue'

const displayTagName = (value) => {
  if (value === 'TOTAL_PAYABLE') {
    return Vue.i18n.t('tag.totalPayable')
  }
  if (value === 'TOTAL_RECEIVABLE') {
    return Vue.i18n.t('tag.totalReceivable')
  }
  return value
}

Vue.filter('tagName', displayTagName)

export const getTagOptions = () => {
  const groupedTags = JSON.parse(localStorage.getItem('groupedTags'))
  const keys = ['client', 'vendor']
  const result = [
    ...groupedTags.main,
    ...keys.reduce((accumulator, type) => accumulator.concat(groupedTags[type].reduce((acc, current) => acc.concat(current.tags), [])), [])
  ]

  localStorage.setItem('allTags', JSON.stringify(result))

  return result.map(t => ({
    text: displayTagName(t.name),
    value: t.id
  }))
}

export const getTags = ids => JSON.parse(localStorage.getItem('allTags')).filter(t => ids.indexOf(t.id) > -1)

export default {
  getTagOptions,
  getTags
}
