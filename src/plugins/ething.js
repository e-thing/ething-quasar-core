import EThing from 'ething-js'

export default {
  install ({ EThingUI, Vue }) {
    Vue.prototype.$ething = EThing
    window.EThing = EThing
  }
}