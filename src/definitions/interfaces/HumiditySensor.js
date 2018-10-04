import WDeviceLabel from '../../components/widgets/WDeviceLabel'
import WDeviceKnob from '../../components/widgets/WDeviceKnob'

export default {

  icon: 'mdi-water-percent',

  data (resource) {
    return {
      'humidity': resource.attr('humidity') + '%'
    }
  },

  widgets: {
    'humidity.label': {
      extends: WDeviceLabel,
      props: {
        attr: {
          default: 'humidity'
        },
        unit: {
          default: '%'
        }
      },
      metadata: {
        label: 'humidity (label)',
        description: 'show the humidity level (in %)'
      }
    },
    'humidity.knob': {
      extends: WDeviceKnob,
      props: {
        attr: {
          default: 'humidity'
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
      metadata: {
        label: 'humidity (knob)',
        description: 'show the humidity level (in %)'
      }
    },
  }

}
