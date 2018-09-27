import WSwitch from '../../components/widgets/WSwitch'

export default {

  icon: 'mdi-toggle-switch',

  widgets: {
    'switch': {
      extends: WSwitch,
      props: {
        attr: {
          default: 'state',
        },
        fn_setter: {
          default: 'setState',
        }
      },
      metadata: {
        description: 'toggle the device'
      }
    }
  }

}
