/* eslint-disable no-return-assign */

export const REF_FIELD_PREFIX = 'formField_'

function extract (expression, type) {
  const regex = {
    id: /#([\w-]+)/g,
    class: /\.([\w-]+)/gm,
    element: /^(\w+)/g,
    attribute: /\[\w+=?\w*\]/g
  }
  return expression.match(regex[type])
}

function removeSuffix (nodeKey) {
  return nodeKey.replace(/:\d+$/, '')
}

function createWrapperElement (h, element, children) {
  return h(
    element.tagName,
    element.attributes,
    children
  )
}

function parseElement (expression) {
  // Todo: parse attributes
  const classMatched = extract(expression, 'class')
  const element = extract(expression, 'element')[0]
  const classes = {}
  if (classMatched) {
    classMatched.forEach(cls => classes[cls.replace('.', '')] = true)
  }

  return {
    tagName: element,
    attributes: {
      class: classes
    }
  }
}

export const createField = (h, vm, field, key) => {
  const value = vm.data ? vm.data[field.name] : null

  const fieldAttributes = {
    ref: `${REF_FIELD_PREFIX}${field.name}`,
    props: {
      value,
      readonly: vm.readonly,
      ...field
    },
    on: {
      input: vm.onInput,
      'input-modified': vm.onInputModified,
      'input-dirty-changed': vm.onInputDirtyChanged
    }
  }
  if (key) {
    fieldAttributes.key = key
  }
  return h(
    `form-${field.type}`,
    fieldAttributes
  )
}

function hasChild (obj) {
  if (obj === false || typeof obj === 'string') {
    return false
  }
  return Object.keys(obj).length > 0
}

export const renderLayout = (h, vm) => {
  function createNode (nodeVal, nodeKey) {
    const children = []
    const element = parseElement(nodeKey)
    if (hasChild(nodeVal)) {
      Object.keys(nodeVal).forEach((k) => {
        const child = createNode(nodeVal[k], removeSuffix(k))
        children.push(child)
      })
    }
    if (nodeKey === 'field') {
      if (Array.isArray(vm.schema)) {
        return createField(h, vm, vm.schema.find(f => f.name === nodeVal))
      }
      return createField(h, vm, {
        name: nodeVal,
        ...vm.schema[nodeVal]
      })
    }
    if (nodeKey === 'slot') {
      return vm.$slots[nodeVal]
    }

    if (children.length === 0 && typeof nodeVal === 'string') {
      return h(
        element.tagName,
        {
          ...element.attributes,
          domProps: {
            innerHTML: nodeVal
          }
        }
      )
    }

    return createWrapperElement(h, element, children)
  }
  return createNode(vm.layout, 'div')
}

/**
 * For some options deep inside schema if the data get api  the reactive system won't work
 * This method help to map these option with the reactivity props
 * { name: 'fieldName', key: 'optionName', value: 'vue reactive props'}
 * @param options
 */
export const mapFormOptions = (options) => {
  const result = {}
  options.forEach((option) => {
    function setShemaValue (value) {
      const idx = this.schema.findIndex(s => s.name === option.name)
      this.$set(this.schema[idx], option.key, value)
    }
    result[option.value] = setShemaValue
  })
  return result
}

export default {
  createField,
  renderLayout,
  mapFormOptions
}
