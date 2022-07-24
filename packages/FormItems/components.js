import { ref, markRaw } from 'vue'
// 基础组件
import input from './FormInput'
import textarea from './FormTextarea'
import number from './FormNumber'
import dateTime from './FormDateTime'
import dateTimeRange from './FormDateTimeRange'
import radio from './FormRadio'
import checkboxs from './FormCheckboxs'
import checkbox from './FormCheckbox'
import FormSwitch from './FormSwitch'
import select from './FormSelect'
import multiselect from './FormMultiSelect'
import cascader from './FormCascader'
import treeselect from './FormTreeSelect'
import qlink from './FormQlink'
import code from './FormCode'
import linkfield from './FormLinkField'

// 容器组件
import tabs from './FormTabs'
import paragraph from './FormParagraph'

export const components = {
  input,
  textarea,
  number,
  dateTime,
  dateTimeRange,
  radio,
  checkboxs,
  checkbox,
  switch: FormSwitch,
  select,
  multiselect,
  cascader,
  treeselect,
  tabs,
  paragraph,
  qlink,
  code,
  linkfield
}

export function convertToSchemaList (schemaProperties) {
  const schemaList = ref([])
  if (schemaProperties) {
    for (const i of Object.keys(schemaProperties)) {
      schemaList.value.push({
        schema: Object.assign(schemaProperties[i], { key: i }),
        component: markRaw(components[schemaProperties[i].widget])
      })
    }
  }
  return schemaList
}
