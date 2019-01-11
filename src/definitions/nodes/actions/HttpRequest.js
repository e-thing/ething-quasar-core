export default {

  properties: {
    
    method: {
        id: 'HttpRequest.method'
    },
    body: {
      format: 'text',
      dependencies: {
        'HttpRequest.method': function (method, self, node) {
          self.$set(self.parent().mutableSchema.properties.body, '_disabled', ['POST', 'PUT', 'PATCH'].indexOf(method) === -1)
        }
      }
    },
    
  }

}
