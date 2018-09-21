
import { version } from '../package.json'

import Core from './core.js'
import * as utils from './utils.js'

import * as components from './components.js'
import * as plugins from './plugins.js'


export const ethingUI = {
  version,
  utils,
  components
}


function install(Vue, opts = {}) {
  
  if (ethingUI.__installed) { return }
  ethingUI.__installed = true
  
  Core.install(ethingUI, Vue)
  
  Vue.prototype.$ethingUI = ethingUI
  if (window) {
    window.ethingUI = ethingUI
  }
  
  opts.components && Object.keys(opts.components).forEach(key => {
    const c = opts.components[key]
    if (c.name !== undefined) {
       console.log('install componant:', c.name)
      Vue.component(c.name, c)
    }
  })
  
  if (opts.plugins) {
    const param = { ethingUI, Vue, opts }
    Object.keys(opts.plugins).forEach(key => {
      const p = opts.plugins[key]
      if (typeof p.install === 'function') {
        p.install(param)
      }
    })
  }
  
  
  // todo: to remove
  window.meta = ethingUI.meta
  window.formSchema = ethingUI.formSchema
  window.widget = ethingUI.widget
  
}


export default {
    version,
    install: function (Vue, opts) {
        install(Vue, {
            components,
            plugins,
        })
    }
}