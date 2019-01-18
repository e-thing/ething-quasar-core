
export default {
  icon: 'mdi-ray-start-arrow',

  color: 'orange',

  properties: {
    flow: {
      readOnly: true
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
