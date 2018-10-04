import EThing from 'ething-js'
import promiseFinally from 'promise.prototype.finally'
import storeModules from './store'


// necessary for older browsers
promiseFinally.shim()


export default {
  install (EThingUI, Vue, opts) {

    var router = opts.router
    var store = opts.store

    console.log(router)

    if (!router) {
      throw new Error('no router set !')
    }

    if (!store) {
      throw new Error('no store set !')
    }

    if (storeModules) {
      for (var name in storeModules) {
        store.registerModule(name, storeModules[name])
      }
    }

    Object.assign(EThingUI, {

        router,
        store,

        /*
        return the url for opening a resource
        */
        route (resource, more) {
          return this.get(resource).open(more)
        },

        open (resource, more) {
          var route = EThingUI.route(resource, more)
          if (route) {
            router.push(route)
          }
        },

    })




  }
}
