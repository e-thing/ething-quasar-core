import EThing from 'ething-js'
import promiseFinally from 'promise.prototype.finally'


// necessary for older browsers
promiseFinally.shim()


export default {
  install (EThingUI, Vue, opts) {
    
    var router = opts.router
    var store = opts.store

    Object.assign(EThingUI, {

        /*
        return the url for opening a resource
        */
        route (resource, more) {
          if (resource instanceof EThing.File) {
            if (/\.plot$/.test(resource.basename())) {
              return '/chart/' + resource.id()
            } else if (/image/.test(resource.mime())) {
              return '/image/' + resource.id()
            } else if ('application/javascript' == resource.mime()) {
              return '/script/' + resource.id()
            } else {
              return '/text/' + resource.id()
            }
          }
          else if (resource instanceof EThing.Table) {
            if (more === 'chart') {
              return '/chart/' + resource.id()
            } else {
              return '/table/' + resource.id()
            }
          }
          else if (resource instanceof EThing.Device) {
            return '/device/' + resource.id()
          }
          else if (resource instanceof EThing.Rule) {
            return '/rule'
          }
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
