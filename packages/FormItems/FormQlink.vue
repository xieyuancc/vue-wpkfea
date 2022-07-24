<template>
  <a-form-item
    :label="schema.title"
    :rules="schema.rules"
    :field="schema.key"
    :validate-trigger="['click']"
  >
    <a-button
      @click="handleClick"
    >{{schema.text}}</a-button>
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
      const { url, method, queryParam, resultPath } = this.schema.config
      if (url) {
        const params = _.mapValues(queryParam, o => String(o).replace(/\${(\w+)}/g, (match, $1) => {
            return this.modelValue[$1]
          })
        );
        axios({
          url,
          method,
          params,
          data: params
        }).then(res => {
          Object.keys(resultPath).map(i => {
            const data = res.data
            if(resultPath[i] === '$') {
              return this.updateModel(i, data)
            } else {
              const path = resultPath[i].replace(/\$./g, '')
              return this.updateModel(i, _.result(data, path))
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
