import EThing from 'ething-js'

function dispatch (event) {
  // console.log(event)

  var name = event.name,
    isResourceEvent = !!event.data.resource,
    resource,
    evt = EThing.Event(name, {
      data: event.data,
      originalEvent: event
    });

  if(isResourceEvent){
    var resourceId = event.data.resource.id;

    if (event.data.resource) {
      if (name === 'ResourceDeleted') {
        EThing.arbo.remove(resourceId);
      } else {
        EThing.arbo.update(EThing.instanciate(event.data.resource))
      }
    }

    resource = EThing.arbo.get(resourceId);
    if(resource){
      resource.trigger(evt);
    }

  }

  EThing.trigger(evt);
}

EThing.arbo.dispatch = dispatch

export default {
  install ({ EThingUI, Vue }) {
    Vue.prototype.$ething = EThing
    window.EThing = EThing
  }
}
