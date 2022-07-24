import * as Vue from 'vue'
const FORMILACLASS = {}

// 将多个文本合并成一个文本
FORMILACLASS.CONCATENATE = (...strings) => strings.join('')

// 取得文本长度
FORMILACLASS.LEN = (string) => string.length

export function generateFomula (schemaFields, stateValue) {
  console.time('计时')
  for (const i of Object.values(schemaFields)) {
    setupFomula(i, schemaFields, stateValue)
  }
  console.timeEnd('计时')
}

function setupFomula (field, schemaFields, stateValue) {
  if (!field.formula) {
    return
  }
  // 监听数据源
  const watchSources = []

  // 替换数据源
  for (const i of Object.values(schemaFields)) {
    if (field.formula.includes(`$_widget_${i.key}#`)) {
      if (i.key === field.key) {
        continue
      }
      watchSources.push(i.key)
      field.formula = field.formula.replace(new RegExp(`\\$_widget_${i.key}#`, 'g'), `v${watchSources.length}`)
    }
  }

  // 替换公式
  for (const j of Object.keys(FORMILACLASS)) {
    field.formula = field.formula.replace(new RegExp(j, 'g'), 'FORMILACLASS.' + j)
  }

  // 数据类型
  let filedType = ''
  switch (field.type) {
    case 'string':
      filedType = 'String'
      break
    default:
      break
  }
  // let filedType = field.type === 'string' ?

  const script = `{
    setup () {
      Vue.watch(
        [${watchSources.map(v => '()=>stateValue.value.' + v).join(',')}],
        ([${watchSources.map((v, i) => 'v' + (i + 1)).join(',')}]) => {
          stateValue.value.${field.key} = ${filedType}(${field.formula})
        }
      )
    }
  }`
  /** 结果
  {
    setup () {
      Vue.watch(
        [()=>stateValue.value.input_id,()=>stateValue.value.input_id2],
        ([v1,v2]) => {
          stateValue.value.input_id3 = String(FORMILACLASS.CONCATENATE(v1,v2))
        }
      )
    }
  }
   */

  // eslint-disable-next-line no-new-func
  const fn = new Function(
    'Vue',
    'stateValue',
    'FORMILACLASS',
    'return function(Vue,stateValue,FORMILACLASS){return ' + script + '}'
  )()(Vue, stateValue, FORMILACLASS)

  fn.setup()
}
