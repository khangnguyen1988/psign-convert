import Vue from 'vue'
import Locale from '@/locale/index'

const CONSTANT = Locale.en.constant

const pleaseSelectOption = { value: null, text: 'Please select...' }

export const createListOptions = (constantName, nullOptionAsDefault = true) => {
  const defaultOption = nullOptionAsDefault ? [pleaseSelectOption] : []
  if (!CONSTANT[constantName]) {
    return [defaultOption]
  }

  const options = Object.keys(CONSTANT[constantName]).map(key => ({
    value: key,
    text: Vue.i18n.t(`constant.${constantName}.${key}`)
  }))
  return [
    ...defaultOption,
    ...options
  ]
}

export default {
  createListOptions
}
