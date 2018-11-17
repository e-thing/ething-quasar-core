import EThing from 'ething-js'
import io from 'socket.io-client'
import ioWildcardMiddleware from 'socketio-wildcard'


var patch  = ioWildcardMiddleware(io.Manager)

//var globalSocket = io(EThing.config.serverUrl)
var eventsSocket = io(EThing.config.serverUrl + '/events', {
	autoConnect: false
}); // todo: auth

patch(eventsSocket)

eventsSocket.on('connect', () => {
	console.log('[socketio] connected')
});

eventsSocket.on('disconnect', () => {
	console.log('[socketio] disconnected')
});

eventsSocket.on('*', (event, a) => {
	// console.log('[socketio]', event)
	var signal = event.data[1];
	EThing.arbo.dispatch(JSON.parse(signal))
})


export default {
  install ({ EThingUI }) {
		Object.assign(EThingUI, {
			io,
			ioPatch: patch,
			eventsSocket
		})
  }
}
