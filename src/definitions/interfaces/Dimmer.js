import WDeviceLabel from '../../components/widgets/WDeviceLabel'
import WDeviceKnob from '../../components/widgets/WDeviceKnob'

export default {

  icon: 'mdi-contrast-circle',

  data (resource) {
    return {
      'level': resource.attr('level') + '%'
    }
  },

  widgets: {
    'dimmer.label': {
      extends: WDeviceLabel,
      props: {
        attr: {
          default: 'level'
        },
        unit: {
          default: '%'
        }
      },
      metadata: {
        label: 'level (label)',
        description: 'show the level'
      }
    },
    'dimmer.knob': {
      extends: WDeviceKnob,
      props: {
        attr: {
          default: 'level'
        },
        unit: {
          default: '%'
        },
        min: {
          default: 0
        },
        max: {
          default: 100
        }
      },
      metadata:{
        label: 'level (knob)',
        description: 'show the level'
      }
    }
  }

}
