// import something here
import EThing from 'ething-js'


if (!EventSource) {
	console.log('load EventSource polyfill')
	EventSource = require('eventsource')
}

// SSE

var _events_handlers = {}


export var SSE = {
	source: null,

	connected: false,

	on (event, handler) {
		if (!_events_handlers[event]) {
			_events_handlers[event] = []
		}
		_events_handlers[event].push({
			handler
		})
	},

	off (event, handler) {
		if (_events_handlers[event]) {
			if (handler) {
				_events_handlers[event] = _events_handlers[event].filter(item => item.handler !== handler)
			} else {
				// remove all handler
				_events_handlers[event] = []
			}
		}
	},

	emit (event, args) {
		if (_events_handlers[event]) {
			_events_handlers[event].forEach(item => {
				item.handler(args)
			})
		}
	},

	start () {
		var self = this

		var source = this.source = new EventSource(EThing.config.serverUrl + "/api/events", { withCredentials: true, https: {rejectUnauthorized: false} })

		source.onopen = function() {
			console.log("SSE connected")
			self.connected = true

			self.emit('connected')
		}

		source.onerror = function() {
			if (self.connected === true) {
				console.warn("SSE disconnected")
				self.connected = false

				self.emit('disconnected')
			}
		}

		source.onmessage = (event) => {
			var data = JSON.parse(event.data)
			this.dispatch(data)
		}


	},

	stop () {
		if(this.source)
      this.source.close()
	},

  dispatch (event) {
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

		} else {
			EThing.trigger(evt);
		}
  },

};


export default {
  install ({ EThingUI }) {
    EThingUI.SSE = SSE
  }
}
