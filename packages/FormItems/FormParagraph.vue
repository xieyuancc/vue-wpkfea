<template>
  <a-card title="段落测试">
    <component
      v-for="(subItem,i) in schemaList"
      :key="i"
      :schema="subItem.schema"
      :is="subItem.component"
    />
  </a-card>
</template>
<script>
import { ref } from 'vue'
import { convertToSchemaList } from './components'

export default {
  name: 'FormTabs',
  props: {
    schema: {
      type: Object
    }
  },
  setup (props) {
    const schemaList = ref(convertToSchemaList(props.schema.properties))
    // console.log(props.schema.properties)
    // for (const i of Object.values(props.schema.properties)) {
    //   tabList.value.push({
    //     tab: i.title,
    //     schema: convertToSchemaList(i.properties)
    //   })
    // }

    return {
      schemaList
    }
  }
}
</script>
<style lang="scss">
</style>
