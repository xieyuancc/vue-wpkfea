<template>
  <div>
    <a-form-item
      :label="schema.title"
      :rules="schema.rules"
      :field="schema.key"
      :validate-trigger="['change']"
    >
      <a-button
        @click="handleClick"
      >
        {{schema.text}}
      </a-button>
      <a-modal v-model:visible="visible" @ok="handleOk" @cancel="handleCancel" width="800px">
        <template #title>
          选择数据
        </template>
        <a-table :columns="columns" :data="data" :bordered="{cell:true}" :row-selection="{type:'radio'}" v-model:selectedKeys="selectedKeys" size="small" />
      </a-modal>
    </a-form-item>

    <template v-for="(item,i) in linkFields">
      <a-form-item
        v-if="!item.selectShowOnly"
        :label="item.title"
        :key="i"
      >
        <a-input v-model="selectShowValues[item.name]" disabled/>
      </a-form-item>
    </template>

    <template v-for="(item,i) in linkDataMaps">
      <a-form-item
        :field="item.field"
      >
        <template #label>
          <icon-link /> {{item.title}}
        </template>
        <a-input v-model="dataMaps[item.field]" @blur="handleChange(item)" />
      </a-form-item>
    </template>
  </div>
</template>

<script>
import mixin from '../utils/mixinComponent'
import axios from 'axios'
import _ from 'lodash'

export default {
  name: 'FormLinkField',
  mixins: [mixin],
  props: ['schema'],
  inject: ['modelValue', 'updateModel'],
  setup (props) {
    // validator
    const { config: { linkFields, linkDataMaps } } = props.schema

    return {
      linkFields,
      linkDataMaps
    }
  },
  data:{
    visible: false,
    selectedKeys: [],
    selectShowValues: {},
    data: [],
    columns: [],
    dataMaps: {}
  },
  methods: {
    handleClick () {
      const { config: { linkFilter, linkForm, linkFields } } = this.schema
      this.visible = true
      if(linkForm) {
        linkFields.map(i => i.dataIndex = i.name)
        this.columns = linkFields

        axios.get('/api/linkField', {
          data: {
            formId: linkForm,
            fliter: linkFilter
          }
        }).then(res => {
          this.data = res.data.data
        })
      }
    },
    handleOk () {
      const { config: { linkDataMaps } } = this.schema

      const _data = _.find(this.data, { 'key': this.selectedKeys[0] })
      this.selectShowValues = _data

      const _dataMaps = {}
      linkDataMaps.map(i => {
        const { depend, field } = i
        if(_data[depend]) {
          _dataMaps[field] = _data[depend]
          this.updateModel(field, _data[depend])
        }
      })
      this.dataMaps = _dataMaps

      this.visible = false
    },
    handleCancel () {
      this.visible = false
    },
    handleChange (data) {
      const { field } = data
      this.updateModel(field, this.dataMaps[field])
    }
  }
}
</script>
