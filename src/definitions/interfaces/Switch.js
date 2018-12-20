import WDeviceMultiLabel from '../../components/widgets/WDeviceMultiLabel'

export default {

  icon: 'mdi-toggle-switch',

  data (resource) {
    return {
      'state': resource.attr('state') ? 'on' : 'off'
    }
  },

  widgets: {
    'state': {
      extends: WDeviceMultiLabel,
      props: {
        items: {
          default () {
            return [{
              attr: 'state',
              map: [{
                key: true,
                value: 'opened'
              },{
                key: false,
                value: 'closed'
              }]
            }]
          }
        }
      },
      metadata: {
        label: 'state',
        description: 'show the state of the switch',
      }
    }
  }

}
