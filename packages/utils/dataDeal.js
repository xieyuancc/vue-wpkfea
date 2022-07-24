/* eslint-disable no-new-func */
export function checkComponentMatch (val, rule, type) {
  if (type === 'FormRadio') {
    return rule.value.includes(val)
  } else if (type === 'FormCheckbox') {
    if (rule.matchType === 'some') {
      return hasSameItemInArrays(val, rule.value)
    } else if (rule.matchType === 'equal') {
      // 一致
    }
  }
}

export function checkComponent (val, rule, type, options) {
  if (['FormRadio', 'FormCheckbox'].includes(type) && options && rule.field) {
    const rows = options.filter(v => v.value === val)
    val = rows.length === 1 ? rows[0][rule.field] : ''
  } else if (type === 'FormCascader' && options && rule.field) {
    let item = options
    val.forEach((v, i) => {
      item = item.filter(v1 => v1.value === v)[0]
      item = i !== val.length - 1 ? item.children : item
    })
    val = item[rule.field]
  }
  if (type === 'FormRadio') {
    if (rule.action === 'select') {
      return rule.value.includes(val)
    } else if (rule.action === 'unselect') {
      return !rule.value.includes(val)
    }
  } else if (type === 'FormCheckbox') {
    if (rule.action === 'select') {
      return hasSameItemInArrays(val, rule.value)
    } else if (rule.action === 'unselect') {
      // 取消选中
      return hasUnselectItemInArrays(val, rule.value)
    }
  } else if (type === 'FormSwitch') {
    if (rule.action === 'select') {
      return rule.value.includes(val)
    } else if (rule.action === 'unselect') {
      return !rule.value.includes(val)
    }
  } else if (type === 'FormCascader') {
    if (rule.action === 'select') {
      return rule.value.includes(val)
    } else if (rule.action === 'unselect') {
      return !rule.value.includes(val)
    }
  }
}

// 有一个匹配
function hasSameItemInArrays (arr1, arr2) {
  for (let i = 0; i < arr1.length; i++) {
    if (arr2.some(v1 => v1 === arr1[i])) {
      return true
    }
  }
  return false
}

// 有一条数据不在数组
function hasUnselectItemInArrays (arr1, arr2) {
  for (let i = 0; i < arr2.length; i++) {
    if (!arr1.some(v1 => v1 === arr2[i])) {
      return true
    }
  }
  return false
}

const getType = o => Object.prototype.toString.call(o).slice(8, -1)

// 国际化处理
export function i18nDeal (obj) {
  // let result
  if (getType(obj) === 'Object') {
    // result = {}
    for (const key of Object.keys(obj)) {
      if (['Object', 'Array'].includes(getType(obj[key]))) {
        i18nDeal.call(this, obj[key])
      } else {
        if (getType(obj[key]) === 'String' && obj[key].indexOf('$t(') === 0) {
          obj[key] = this.$t(obj[key].replace(/^\$t\('/, '').replace(/'\)$/, ''))
        }
      }
    }
  } else if (getType(obj) === 'Array') {
    for (let i = 0; i < obj.length; i++) {
      if (getType(obj[i]) === 'String' && obj[i].indexOf('$t(') === 0) {
        obj[i] = this.$t(obj[i].replace(/^\$t\('/, '').replace(/'\)$/, ''))
      } else if (['Array', 'Object'].includes(getType(obj[i]))) {
        i18nDeal.call(this, obj[i])
      }
    }
  }
}

export function conditionalCompilation (script, platform) {
  platform = platform === 'PC' ? 'H5' : 'PC'
  const lines = script.split('\n')
  const endScript = []
  let removeLine = false
  lines.forEach(line => {
    if (line.replace(/\s/g, '') === '//#ifdef' + platform) {
      removeLine = true
    }
    if (removeLine === false) {
      endScript.push(line)
    }
    if (line.replace(/\s/g, '') === '//#endif') {
      removeLine = false
    }
  })
  return new Function(endScript.join('\n'))()
}

export function getTableRowDispaly (value, config) {
  const display = {}
  for (const i of Object.keys(value)) {
    const type = config.filter(c => c.key === i).type
    if (['FormInput', 'FormInputNumber'].includes(type)) {
      display[i] = value[i]
    } else {
      display[i] = value[i]
    }
  }
  return display
}

export function getDefaultValue (schema, value, schemaFields) {
  for (const i of Object.keys(schema.properties)) {
    // console.log(schema.properties[i]?.type)
    // if (schema.properties[i]?.type === 'string') {
    //   value[i] = schema.properties[i]?.default ?? ''
    // }
    schema.properties[i].key = i
    switch (schema.properties[i]?.type) {
      case 'string':
        value[i] = schema.properties[i]?.default ?? ''
        schemaFields[i] = schema.properties[i]
        break
      case 'number':
        value[i] = schema.properties[i]?.default ?? null
        schemaFields[i] = schema.properties[i]
        break
      case 'range':
        value[i] = schema.properties[i]?.default ?? []
        schemaFields[i] = schema.properties[i]
        break
      case 'array':
        value[i] = schema.properties[i]?.default ?? []
        schemaFields[i] = schema.properties[i]
        break
      case 'boolean':
        value[i] = schema.properties[i]?.default ?? false
        schemaFields[i] = schema.properties[i]
        break
      case 'void':
        schema.properties[i]?.properties && getDefaultValue(schema.properties[i], value, schemaFields)
        break
      default:
        break
    }
  }
}
