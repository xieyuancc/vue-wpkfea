<template>
  <a-tabs
    v-model="activeKey"
    type="card"
  >
    <a-tab-pane
      v-for="(item,i) in tabList"
      :key="i"
    >
      <template #title>
        <a-badge :count="getCount(item.schema)">{{item.tab}}</a-badge>
      </template>
      <component
        v-for="(subItem,i) in item.schema"
        :key="i"
        :schema="subItem.schema"
        :is="subItem.component"
      />
    </a-tab-pane>
  </a-tabs>
</template>
<script>
import { ref } from 'vue'
import { convertToSchemaList } from './components'

export default {
  name: 'FormTabs',
  props: {
    schema: {
      type: Object
    },
    errors: {
      type: Array
    }
  },
  setup (props) {
    const tabList = ref([])
    const properties = props.schema.properties
    for (const i of Object.values(properties)) {
      tabList.value.push({
        tab: i.title,
        schema: convertToSchemaList(i.properties)
      })
    }

    const getCount = (schema) => {
      const list = []
      if(!props.errors || !props.errors.value) {
        return 0
      }
      const getProperties = (properties) => {
        for (const j of Object.values(properties)) {
          if(j.properties) {
            getProperties(j.properties)
          }
          list.push(j.key)
        }
      }
      schema.map(i => {
        for (const j of Object.keys(i.schema)) {
          if(j === 'properties') {
            getProperties(i.schema[j])
          } else if(j === 'key') {
            list.push(i.schema[j])
          }
        }
      })

      const alonePlants = [...new Set(list)].filter(item => props.errors.value.includes(item)).length
      return alonePlants
    }

    return {
      getCount,
      tabList,
      activeKey: ref(0)
    }
  }
}
</script>
<style lang="scss">
</style>
