import WDeviceLabel from '../../components/widgets/WDeviceLabel'
import WDeviceKnob from '../../components/widgets/WDeviceKnob'

export default {

  icon: 'mdi-water-percent',

  widgets: {
    'moisture.label': {
      extends: WDeviceLabel,
      props: {
        attr: {
          default: 'moisture'
        },
        unit: {
          default: '%'
        }
      },
      metadata: {
        label: 'moisture (label)',
        description: 'show the moisture level (in %)',
      }
    },
    'moisture.knob': {
      extends: WDeviceKnob,
      props: {
        attr: {
          default: 'moisture'
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
        label: 'moisture (knob)',
        description: 'show the moisture level (in %)',
      }
    },
  }

}
