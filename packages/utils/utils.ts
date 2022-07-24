/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prefer-const */
// import axios from 'axios'
import * as dayjs from 'dayjs'
// let appId = ''
let app = null
let $slots = {}
let $scopedSlots = {}
let customComponents = {}

// const platform = 'pc' // 平台选择 pc|m|app|wq|erp

// const instance = axios.create({
//   /* 设置默认根地址 */
//   baseURL: 'https://sff.jd.com', // 线上 预发可绑定 sff.jd.com 11.94.2.226
//   timeout: 60000, // 设置请求超时设置
//   headers: {
//     'Content-Type': 'application/json;charset=UTF-8',
//     'X-Requested-With': 'XMLHttpRequest',
//     'dsm-platform': platform
//   },
//   withCredentials: true
// })

/**
 * dsm通用拦截器
 */
// function fetch ({ api, v = '1.0', method = 'post', data }) {
//   return new Promise((resolve, reject) => {
//     const url = `/api?v=${v}&api=${api}&appId=${appId}`

//     instance({ url, method, data })
//       .then(res => {
//         console.log(res)
//         if (res.data.code === 200) { // 接口返回200
//           resolve(res.data.data)
//         } else if (res.data.redirectUrl) { // 接口返回非200
//           window.location.href = res.data.redirectUrl
//         } else {
//           this.$message.error(res.data.msg)
//           reject(res)
//         }
//       }, (err) => {
//         console.error(err)
//         this.$message.error('网络异常！')
//         reject(err)
//       })
//   })
// }

function getQuery (name: string) {
  let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i')
  let r = window.location.href.substring(1).match(reg)
  if (r != null) {
    return decodeURIComponent(r[2])
  }
  return ''
}
// function setAppId (v) {
//   appId = v
// }
function guid (): string {
  function r4 () {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
  }
  return (r4() + r4() + '-' + r4() + '-' + r4() + '-' + r4() + '-' + r4() + r4() + r4())
}
const getType = (o: any) => Object.prototype.toString.call(o).slice(8, -1)

function isValidKey (key: string | number | symbol, object: object): key is keyof typeof object {
  return key in object
}

function deepClone (obj: any): object | Array<any> {
  let result: any
  if (getType(obj) === 'Object') {
    result = {}
    for (const key in obj) {
      if (isValidKey(key, obj)) {
        if (['Object', 'Array'].includes(getType(obj[key]))) {
          result[key] = deepClone(obj[key])
        } else {
          result[key] = obj[key]
        }
      }
    }
  } else if (getType(obj) === 'Array') {
    result = []
    for (const key of obj) {
      result.push(deepClone(key))
    }
  } else {
    return obj
  }
  return result
}

function isNumeric (obj: any): boolean {
  let realStringObj = obj && obj.toString()
  return (
    getType(obj) !== 'Array' && realStringObj - parseFloat(realStringObj) + 1 >= 0
  )
}

export default {
  getQuery,
  guid,
  commomFetch: fetch,
  getType,
  isNumeric,
  deepClone,
  dayjs,
  app,
  $slots,
  $scopedSlots,
  customComponents
}
