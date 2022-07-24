/* eslint-disable @typescript-eslint/no-explicit-any */
import SmartForm from './SmartForm.vue'
// import FormTabs from './FormItems/FormTabs.vue'
import utils from './utils/utils'

SmartForm.install = function (app: any) {
  if (!utils.app) {
    utils.app = app
  }
  console.log(app)
  app.component(SmartForm.name, SmartForm)
  // app.component(FormTabs.name, FormTabs)
}

const components = [
  SmartForm
  // FormTabs
]

const install = function (app: any): void {
  // if (install.installed) { return }
  if (!utils.app) {
    utils.app = app
  }
  // eslint-disable-next-line array-callback-return
  components.map(component => {
    app.component(component.name, component)
  })
}

export default {
  install: install,
  SmartForm: SmartForm
}
