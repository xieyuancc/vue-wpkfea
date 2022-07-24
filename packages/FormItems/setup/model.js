import { ref, inject, watch } from 'vue'

// model处理
export function useModel (schema) {
  const modelValue = inject('modelValue')
  const updateModel = inject('updateModel')
  const stateValue = ref(modelValue.value?.[schema.key])

  watch(
    () => modelValue.value[schema.key],
    (v) => {
      if (stateValue.value === v) {
        return
      }
      stateValue.value = v
    }
  )
  const defaultValue = {
    string: '',
    number: null,
    range: [],
    array: [],
    boolean: false
  }[schema.type]

  const changeHandle = () => {
    if (modelValue.value[schema.key] !== stateValue.value) {
      updateModel(schema.key, stateValue.value ?? defaultValue)
    }
  }

  return {
    stateValue,
    changeHandle
  }
}
