
export default {
  icon: 'mdi-ray-start-arrow',

  color: 'orange',

  properties: {
    flow: {
      format: 'ething.flow'
    },
  },

  open (resource, more) {
    return '/flow/' + resource.id()
  },

  widgets: {
    'full': 'WFlow',
    'single node': 'WFlowNode'
  }

}
