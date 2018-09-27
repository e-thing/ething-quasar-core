import WDimmable from '../../components/widgets/WDimmable'

export default {

  icon: 'mdi-contrast-circle',

  widgets: {
    'dimmer': {
      extends: WDimmable,
      props: {
        attr: {
          default: 'level'
        },
        fn_setter: {
          default: 'setLevel'
        }
      },
      metadata: {
        description: 'adjust the level'
      }
    }
  }
}
