// import { ref, inject, watch } from 'vue'
import { ref } from 'vue'
import axios from 'axios'

// option处理
export function useOptions (schema) {
  const options = schema.enum ? ref(schema.enum) : ref([])

  if (schema.apiUrl) {
    axios.get(schema.apiUrl).then(v => {
      options.value = v.data.data
    })
  }
  return { options }
}
