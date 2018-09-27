
import { version } from '../package.json'

import Core from './core.js'
import * as utils from './utils.js'

import * as components from './components.js'
import * as plugins from './plugins.js'


var EThingUI = {
  version,
  utils,
  components
}


EThingUI.install = function(Vue, opts = {}) {

  if (EThingUI.__installed) { return }
  EThingUI.__installed = true

  Core.install(EThingUI, Vue)

  Vue.prototype.$ethingUI = EThingUI
  if (window) {
    // make it global to be accessible by the plugins !
    window.EThingUI = EThingUI
  }

  components && Object.keys(components).forEach(key => {
    const c = components[key]
    if (c.name !== undefined) {
      Vue.component(c.name, c)
    }
  })

  if (plugins) {
    const param = { EThingUI, Vue, opts }
    Object.keys(plugins).forEach(key => {
      const p = plugins[key]
      if (typeof p.install === 'function') {
        p.install(param)
      }
    })
  }

}

export default EThingUI
