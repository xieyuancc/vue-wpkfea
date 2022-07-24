<template>
  <a-form-item
    :label="schema.title"
    :rules="schema.rules"
    :field="schema.key"
    :validate-trigger="['change']"
  >
    <a-select
      multiple
      v-model="stateValue"
      :options="options"
      @change="changeHandle"
    />
  </a-form-item>
</template>
<script>
import mixin from '../utils/mixinComponent'
import { useModel } from './setup/model'
import { useOptions } from './setup/options'

export default {
  name: 'FormMultiSelect',
  mixins: [mixin],
  props: ['schema'],
  inject: ['modelValue', 'updateModel'],
  setup (props) {

    const { options } = useOptions(props.schema)

    const { stateValue, changeHandle } = useModel(props.schema)

    return {
      options,
      stateValue,
      changeHandle
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
