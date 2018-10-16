// import something here
import EThing from 'ething-js'


if (!EventSource) {
	console.log('[SSE] load EventSource polyfill')
	EventSource = require('eventsource')
}

// SSE

var _events_handlers = {}

const CLOSED = 0
const OPENING = 1
const OPEN = 2

export var SSE = {
	source: null,

	state: CLOSED,

	autoreconnect: true,

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

		this.state = OPENING

		console.log('[SSE] connecting...')

		var source = this.source = new EventSource(EThing.config.serverUrl + "/api/events", { withCredentials: true, https: {rejectUnauthorized: false} })

		source.onopen = function() {
			console.log("[SSE] connected")
			self.state = OPEN

			self.emit('connected')
		}

		source.onerror = function() {
			if (self.state !== CLOSED) {
				console.warn("[SSE] disconnected")
				self.stop()

				self.emit('disconnected')

				if (self.autoreconnect) {
					setTimeout(() => {
						if (self.state === CLOSED) {
							console.log("[SSE] reconnecting...")
							self.start()
						}
					}, 5000)
				}
			}
		}

		source.onmessage = (event) => {
			var data = JSON.parse(event.data)
			this.dispatch(data)
		}


	},

	stop () {
		this.state = CLOSED
		if(this.source){
			console.log('[SSE] stop')
      this.source.close()
		}
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

		}

		EThing.trigger(evt);
  },

};


export default {
  install ({ EThingUI }) {
    EThingUI.SSE = SSE
  }
}
