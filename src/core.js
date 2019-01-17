import EThing from 'ething-js'
import promiseFinally from 'promise.prototype.finally'
import storeModules from './store'
import { LocalStorage, SessionStorage } from 'quasar'


// necessary for older browsers
promiseFinally.shim()


export default {
  install (EThingUI, Vue, opts) {

    Vue.config.errorHandler = function (err, vm, info)  {
      let handler, current = vm
      if (vm.$options.errorHandler) {
      	handler = vm.$options.errorHandler
      } else {
      	while (current.$parent) {
        	current = current.$parent
        	if (handler = current.$options.errorHandler) break
        }
      }
      if (handler) handler.call(current, err, vm, info)
      else console.error(err)
    }


    var router = opts.router
    var store = opts.store

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

    EThing.on('ConfigUpdated', function(evt) {
      console.log('[app] settings updated', evt)
      EThingUI.settings = evt.data.config
    })

    const eventBus = new Vue();

    Object.assign(EThingUI, {

        router,
        store,

        getVueInstance () {
          return this.router.app
        },

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

        /*
        settings
        */
        settings: {},

        loadSettings () {
          return EThing.settings.get().then(settings => {

            this.settings = settings

            return settings
          })
        },

        /*
        eventEmitter
        */
        on () {
          return eventBus.$on.apply(eventBus, arguments)
        },
        once () {
          return eventBus.$once.apply(eventBus, arguments)
        },
        off () {
          return eventBus.$off.apply(eventBus, arguments)
        },
        emit () {
          return eventBus.$emit.apply(eventBus, arguments)
        },

        /*
        web storage
        */
        dbSet (key, value, storage) {
          var _storage = storage==='session' ? SessionStorage : LocalStorage
          _storage.set(key, value)
        },
        dbGet (key, storage) {
          var _storage = storage==='session' ? SessionStorage : LocalStorage

          if (key instanceof RegExp) {
            var _all = _storage.get.all()
            var _res = {}
            for(var k in _all) {
              if (key.test(k)) {
                _res[k] = _all[k]
              }
            }
            return _res
          } else if (typeof key === 'string'){
            return _storage.get.item(key)
          } else {
            return _storage.get.all()
          }
        },
        dbDelete (key, storage) {
          var _storage = storage==='session' ? SessionStorage : LocalStorage
          _storage.remove(key)
        }


    })




  }
}
