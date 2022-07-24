<template>
  <a-form-item
    :label="schema.title"
    :rules="schema.rules"
    :field="schema.key"
    :validate-trigger="['blur']"
  >
    <a-textarea
      v-model="stateValue"
      @blur="changeHandle"
    ></a-textarea>
  </a-form-item>
</template>
<script>
import mixin from '../utils/mixinComponent'
import { useModel } from './setup/model'

export default {
  name: 'FormTextarea',
  mixins: [mixin],
  props: {
    schema: {}
  },
  inject: ['modelValue', 'updateModel'],
  setup (props) {

    const { stateValue, changeHandle } = useModel(props.schema)

    return {
      stateValue,
      changeHandle
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
