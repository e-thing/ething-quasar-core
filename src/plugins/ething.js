import EThing from 'ething-js'

export default {
  install ({ EThingUI, Vue }) {

    EThing._store =  new Vue({
      resources: EThing.arbo.list()
    })

    Vue.prototype.$ething = EThing
    window.EThing = EThing
    EThingUI.EThing = EThing
  }
}
