<template>
  <a-form :model="stateValue" ref="formRef" @submit="handleSubmit">
    <template v-for="(item,i) in schemaList">
    <component
      v-if="(item.schema.visible === undefined || item.schema.visible === true)? true : false"
      :key="i"
      :schema="item.schema"
      :is="item.component"
      :disabled="(item.schema.writeOnly === undefined || item.schema.writeOnly === true)? false : true"
      :errors="errors"
    />
    </template>
    <a-form-item>
      <a-space>
        <a-button html-type="submit">提交</a-button>
        <a-button @click="$refs.formRef.resetFields()">重置</a-button>
      </a-space>
    </a-form-item>
    <!-- <FormTabs></FormTabs> -->
    <!-- <a-input
      v-model="input"
      placeholder="Please input"
    /> -->
  </a-form>
</template>

<script>
import { ref, computed, watch } from 'vue'
import { convertToSchemaList } from './components'

// const mixin = {
//   watch: {
//     'modelValue.input' (v) {
//       this.modelValue.input2 = v + 'test'
//     }
//   }
// }

export default {
  // components: {
  //   // eslint-disable-next-line vue/no-unused-components
  //   FormInput
  // },
  // watch: {
  //   'modelValue.input': {
  //     handler (v) {
  //       console.log(v)
  //     }
  //   }
  // },
  props: {
    schema: Object,
    modelValue: Object
  },
  provide () {
    return {
      modelValue: computed(() => this.stateValue),
      updateModel: (key, value) => {
        this.stateValue[key] = value
      }
    }
  },
  setup (props) {
    // const schemaList = ref([])
    // for (const i of Object.keys(props.schema.properties)) {
    //   if (props.schema.properties[i].widget === 'FormTabs') {
    //     schemaList.value.push({
    //       schema: props.schema.properties[i],
    //       component: 'FormTabs'
    //     })
    //     continue
    //   }
    //   props.schema.properties[i].key = i
    //   schemaList.value.push({
    //     schema: Object.assign(props.schema.properties[i], { key: i }),
    //     component: markRaw(components[props.schema.properties[i].widget])
    //   })
    // }
    const schemaList = convertToSchemaList(props.schema.properties)
    const stateValue = ref(props.modelValue)

    // watch(props.modelValue, (modelValue) => {
    //   console.log(modelValue)
    // }, { deep: true })

    const formRef = ref()
    watch(stateValue, (newValue, oldValue) => {
      formRef.value.validate();
    }, { deep: true })

    return {
      formRef,
      stateValue,
      schemaList
    }
  },

  emits: ['update:modelValue'],
  // mixins: [mixin],
  data () {
    return {
      rules: {},
      self: this,
      input: '',
      errors: ref([])
    }
  },
  methods: {
    // registerComponents () {
    //   this.formSchema.formItemList.forEach((item) => {
    //     if (!item.script || typeof item.type !== 'string') {
    //       item.component = markRaw(components[item.type])
    //       // return
    //     }
    //     // const mixinCustom = conditionalCompilation(
    //     //   item.script.replace(/export default/, 'return'),
    //     //   'PC'
    //     // )
    //     // const Profile = this.$smart.Vue.extend({
    //     //   name: item.type + '_' + item.key,
    //     //   extends: components[item.type],
    //     //   mixins: [mixinCustom]
    //     // })
    //     // item.component = Profile
    //   })
    // },
    handleInput (e, key) {
      // console.log(e)
      this.modelValue[key] = e
      // console.log(this.modelValue)
      // this.modelValue[key] = e.srcElement.value
      // console.log(this.modelValue)
      // this.$emit('changeValue', this.modelValue)
    },

    handleSubmit ({errors}) {
      const offSet = (curEle) =>  {
        var totalTop = null;
        var par = curEle.offsetParent;
        totalTop += curEle.offsetTop;
        while (par){
          if (navigator.userAgent.indexOf("MSIE 8.0") === -1){
            totalTop += par.clientTop;
          }
          totalTop += par.offsetTop;
          par = par.offsetParent;
        }
        return totalTop;
      }

      if(errors) {
        this.errors.value = Object.keys(errors)
        const ele = document.querySelector(".arco-input-error")
        const offsetTop = offSet(ele)
        window.scrollTo(0, offsetTop)
      }
    }
  },
  mounted () {
    // this.registerComponents()
    // console.log(this.stateValue)
    // console.log(this.$utils)
  },
  created () {
    // console.log(this.stateValue)
  }
}
</script>

<style lang="scss"></style>
