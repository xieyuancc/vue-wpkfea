<template>
  <form-container
    :schema="schema"
    ref="smartForm"
    v-model="stateValue"
  >
  </form-container>
</template>
<script>
import { defineComponent, ref, watch } from 'vue'
// import * as utils from './utils/utils'
import FormContainer from './FormItems/FormContainer.vue'
import { getDefaultValue } from './utils/dataDeal'
import { generateFomula } from './utils/formula'
import { getDefaultRules } from './utils/initConfig'

export default defineComponent({
  name: 'SmartForm',
  components: {
    FormContainer
  },
  emits: ['update:modelValue'],
  props: {
    modelValue: {
      type: Object
    },
    schema: {
      type: Object
    }
  },
  setup (props, context) {

    const stateValue = ref(props.modelValue)

    // schema打平后数据
    const schemaFields = {}

    // 设置默认值
    getDefaultValue(props.schema, stateValue.value, schemaFields)

    // 初始化rules
    getDefaultRules(props.schema, stateValue.value)

    generateFomula(schemaFields, stateValue)
    // const script = `{
    //   setup (props, context) {
    //     // console.log(stateValue)
    //     watch(
    //       [() => stateValue.value.input_id, () => stateValue.value.input_inner],
    //       ([foo, bar]) => {
    //         stateValue.value.input_inner2 = foo + bar
    //         console.log([foo, bar])
    //       }
    //     )
    //   }
    // }
    // `
    // // eslint-disable-next-line no-new-func
    // const r = new Function(
    //   'Vue',
    //   'stateValue',
    //   'return function(Vue,stateValue){return ' +
    //     script.replace('watch(', 'Vue.watch(') +
    //     '}'
    // )()(Vue, stateValue)
    // // Vue.watch(
    // //   () => stateValue.value.input_id,
    // //   (v) => { console.log(v) }
    // // )
    // // console.log(stateValue)
    // r.setup(props, context)
    // watch(
    //   () => props.modelValue,
    //   (val) => {
    //     // console.log(val)
    //   },
    //   { deep: true }
    // )
    // this.component = markRaw(
    //   defineComponent({
    //     name: 'FormContainer',
    //     extends: FormContainer
    //     // mixins: [mixin]
    //   })
    // )
    return {
      stateValue
    }
  },
  data () {
    return {
      config: null,
      component: null,
      tempOptions: {},
      value: {}
    }
  },
  watch: {
    // modelValue (val) {
    //   console.log(val)
    // }
    // states: {
    //   handler (v) {
    //     if (!v) {
    //       return
    //     }
    //     this.$nextTick(() => {
    //       const stateKeys = Object.keys(this.$refs.smartForm.$store.state.smart)
    //       for (const o of Object.entries(v)) {
    //         if (!stateKeys.includes(o[0])) {
    //           console.error('未注册key：' + o[0])
    //           continue
    //         } else if (typeof o[0] !== 'string' || typeof o[1] !== 'boolean') {
    //           console.error('states数据格式不正确')
    //           continue
    //         }
    //         this.setState(o[0], o[1])
    //       }
    //     })
    //   },
    //   deep: true,
    //   immediate: true
    // },
    // options: {
    //   handler (v) {
    //     if (!v) {
    //       return
    //     }
    //     this.$nextTick(() => {
    //       for (const o of Object.entries(v)) {
    //         if (typeof o[0] !== 'string' || o[1] instanceof Array === false) {
    //           continue
    //         }
    //         const optionStr = JSON.stringify(o[1])
    //         if (
    //           this.tempOptions[o[0]] &&
    //           this.tempOptions[o[0]] !== optionStr
    //         ) {
    //           this.tempOptions[o[0]] = optionStr
    //           continue
    //         }
    //         this.$refs.smartForm.setOptions(o[0], o[1])
    //       }
    //     })
    //   },
    //   deep: true,
    //   immediate: true
    // }
  },
  methods: {
    // getFormConfig () {
    //   if (this.formSchema) {
    //     this.config = this.formSchema
    //     this.registerComponent()
    //     // } else if (this.configId) {
    //     //   if (window.smartData && window.smartData[this.configId]) {
    //     //     this.config = window.smartData[this.configId]
    //     //     this.registerComponent()
    //     //   } else {
    //     //     // todo get from server
    //     //   }
    //   } else {
    //     console.error('请配置formSchema')
    //   }
    // },
    // registerComponent () {
    //   // console.log('created')
    //   let mixin = {}
    //   if (this.config.rules) {
    //     let script = this.config.rules[0].script
    //     const params = this.config.rules[0].params
    //     for (const key of Object.keys(params)) {
    //       script = script.replace('${' + key + '}', params[key])
    //     }
    //     // eslint-disable-next-line no-new-func
    //     mixin = new Function(script)()
    //     // mixin = conditionalCompilation(script, 'PC')
    //   }
    //   this.component = markRaw(
    //     defineComponent({
    //       name: 'FormContainer',
    //       extends: FormContainer,
    //       mixins: [mixin]
    //     })
    //   )
    //   // console.log(FormContainer)
    //   //   if (this.config.formAttr.i18n) {
    //   //     i18nDeal.call(this, this.config)
    //   //   }
    //   // utils.Vue.FormContainer = FormContainer
    //   //   let mixin = {}
    //   //   if (this.config.script) {
    //   //     const script = this.config.script.replace(/export default/, 'return')
    //   //     mixin = conditionalCompilation(script, 'PC')
    //   //   }
    //   //   let componentStore = null
    //   //   if (this.config.states) {
    //   //     const states = {}
    //   //     this.config.states.forEach((v: any) => {
    //   //       states[v.key] = v.defaultValue
    //   //     })
    //   //     componentStore = store(states)
    //   //   }
    //   //   const tempComponent = {
    //   //     extends: FormContainer,
    //   //     mixins: [mixin]
    //   //   }
    //   //   if (componentStore !== null) {
    //   //     tempComponent.store = componentStore
    //   //   }
    //   //   const Profile = utils.Vue.extend(tempComponent)
    //   // this.component = FormContainer
    // },
    // handleButtonClick (key) {
    //   this.$emit('handleButtonClick', key)
    // },
    // handleInput (val) {
    //   // this.value = val
    //   console.log(val)
    //   // this.$emit('input', val)
    // },
    // submit (value) {
    //   this.$emit('submit', value)
    // },
    // submitForm () {
    //   // this.$refs.smartForm.validate().then((v) => {
    //   //   if (v) {
    //   //     this.$refs.smartForm.submitForm()
    //   //   }
    //   // })
    // }
    // setState (key, value) {
    //   this.$refs.smartForm.$store.commit('changeState', {
    //     key: key,
    //     value: value,
    //     guid: null
    //   })
    // },
    // setOptions (target, options) {
    //   this.$refs.smartForm.setOptions(target, options)
    // },
    // validate () {
    //   return this.$refs.smartForm.validate()
    // }
  },
  created () {
    // utils.setAppId(this.appId)
    // console.log(this.modelValue)
    // this.modelValue.input = '111'
    // this.modelValue.input2 = ''
    // console.log(this.modelValue)
    // this.getFormConfig()
    // utils.$slots = this.$slots
  },
  mounted () {
    // for (const key of Object.keys(this.$slots)) {
    //   utils.$scopedSlots[key] = this.$slots[key]
    // }
  }
})
</script>

<style lang="scss" scoped>
</style>
