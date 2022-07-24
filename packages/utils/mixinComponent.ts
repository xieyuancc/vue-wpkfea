/* eslint-disable no-new-func */
// import utils from './utils'
export default {
  props: {
    guid: {},
    parentForm: {},
    cProps: {}
  },
  data: function () {
    return {
      visible: true,
      enabled: true
    }
  },
  // mounted () {

  // },
  created () {
    // if (!this.$smart) {
    //   // utils.fetch = v => {
    //   //   return utils.commomFetch.call(this, v)
    //   // }
    //   // console.log(utils.Vue)
    //   utils.Vue.$smart = utils
    // }
    this.bindStateResult()
  },
  methods: {
    changeVisible (key) {
      this.config.statesResult
        .filter(v => v.action === 'visible' && v.keys.includes(key))
        .forEach(v => {
          const result = v.logic.replace(/\$\{\w+\}/g, (str) => {
            let r = this.$store.state.smart[str.replace(/\W/g, '')]
            r = typeof r === 'object' ? r[this.guid] : r
            return String(r)
          })
          this.visible = new Function('return function(){return ' + result + '}')()()
        })
    },
    changeEnabled (key) {
      this.config.statesResult
        .filter(v => v.action === 'enabled' && v.keys.includes(key))
        .forEach(v => {
          const result = v.logic.replace(/\$\{\w+\}/g, (str) => {
            let r = this.$store.state.smart[str.replace(/\W/g, '')]
            r = typeof r === 'object' ? r[this.guid] : r
            return String(r)
          })
          this.enabled = new Function('return function(){return ' + result + '}')()()
        })
    },
    changeValue (key) {
      this.config.statesResult
        .filter(v => v.action === 'value' && v.keys.includes(key))
        .forEach(v => {
          const result = v.logic.replace(/\$\{\w+\}/g, (str) => {
            let r = this.$store.state.smart[str.replace(/\W/g, '')]
            r = typeof r === 'object' ? r[this.guid] : r
            return String(r)
          })
          if (new Function('return function(){return ' + result + '}')()()) {
            if (!(v.value instanceof Array)) {
              this.currentValue = v.value
            } else {
              while (this.currentValue.length > 0) {
                this.currentValue.pop()
              }
              v.value.forEach(val => {
                this.currentValue.push(val)
              })
            }
            this.handleInput(v)
          }
        })
    },
    changeNotValue (key) {
      this.config.statesResult
        .filter(v => v.action === 'notValue' && v.keys.includes(key))
        .forEach(v => {
          const result = v.logic.replace(/\$\{\w+\}/g, (str) => {
            let r = this.$store.state.smart[str.replace(/\W/g, '')]
            r = typeof r === 'object' ? r[this.guid] : r
            return String(r)
          })
          // eslint-disable-next-line no-new-func
          if (new Function('return function(){return ' + result + '}')()()) {
            v.value.forEach(val => {
              if (this.config.type === 'FormCheckbox') {
                if (this.currentValue instanceof Array && this.currentValue.some(cv => cv === val)) {
                  this.currentValue.splice(this.currentValue.findIndex(cv => cv === val), 1)
                }
              } else if (this.config.type === 'FormRadio') {
                if (this.currentValue === val) {
                  this.currentValue = null
                  for (const o of this.config.options) {
                    if (!this.hideItems.includes(o.value) && !this.disabledItems.includes(o.value)) {
                      this.currentValue = o.value
                      break
                    }
                  }
                  this.handleInput()
                }
              }
            })
          }
        })
    },
    bindStateResult () {
      if (!this.config || !this.config.statesResult) {
        return
      }
      this.config.statesResult.forEach(state => {
        const action = state.action.replace(/^[a-z]/, function ($1) { return $1.toUpperCase() })
        if (!this['change' + action]) {
          console.error('method: change' + action + ': not found!')
          return
        }
        state.keys.forEach(key => {
          if (action === 'States') {
            return
          }

          this.$watch('$store.state.smart.' + key, function () {
            this['change' + action](key)
          }, { deep: true })
        })
        this['change' + action](state.keys[0])
      })
    }
  }
}
