import EThing from 'ething-js'

export default {
  install ({ ethingUI, Vue }) {
    Vue.prototype.$ething = EThing
    window.EThing = EThing
  }
}