import WDeviceLabel from '../../components/widgets/WDeviceLabel'

export default {

  icon: 'mdi-weight',

  widgets: {
    'pressure.label': {
      extends: WDeviceLabel,
      props: {
        attr: {
          default: 'pressure'
        },
        unit: {
          default: 'Pa'
        }
      },
      metadata: {
        label: 'pressure (label)',
        description: 'show the pressure (in Pa)',
      }
    }
  }

}
