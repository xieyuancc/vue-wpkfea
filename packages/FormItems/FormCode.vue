<template>
  <a-form-item
    :label="schema.title"
    :rules="schema.rules"
    :field="schema.key"
    :validate-trigger="['click']"
  >
    <a-button
      @click="handleClick"
    >
      {{schema.text}}
    </a-button>
  </a-form-item>
</template>
<script>
import mixin from '../utils/mixinComponent'
import axios from 'axios'
import _ from 'lodash'

export default {
  name: 'FormSwitch',
  mixins: [mixin],
  props: ['schema'],
  inject: ['modelValue', 'updateModel'],
  methods: {
    handleClick () {
      const { compile, resultPath } = this.schema.config
      if (compile) {
        const _compile = compile.replace(/\${(\w+)}/g, (match, $1) => {
          return this.modelValue[$1]
        })
        const AsyncFunction = Object.getPrototypeOf(async function(){}).constructor;
        const fun = new AsyncFunction('_', 'axios', 'output', _compile+';return output');
        const getResult = fun(_, axios);
        getResult.then(res => {
          Object.keys(resultPath).map(i => {
            if(resultPath[i] === '$') {
              return this.updateModel(i, res)
            } else {
              const path = resultPath[i].replace(/\$./g, '')
              return this.updateModel(i, _.result(res, path))
            }
          })
        })
      }
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
