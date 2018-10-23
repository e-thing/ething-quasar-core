<template>
  <div class="widget" :class="{'widget-err': error}" :style="style">
    <div v-if="error" class="widget-err-layer absolute-center text-center">error</div>
    <div v-else class="widget-content-layer" :class="inline ? '' : 'fit'">
      <template v-if="isDynReg">
        <div ref="dynW"/>
      </template>
      <component v-else ref="staticW" :is="widgetClass" v-bind="widgetOptions" @error="error = $event"/>
    </div>
  </div>
</template>

<script>
import { widgets } from '../plugins/widget'


export default {
    name: 'Widget',

    components: widgets,

    props: {
      widgetClass: {},
      widgetOptions: {},
      inline: Boolean
    },
    data() {
      return {
        error: false,
        widgetInstance: null
      };
    },
    computed: {
      isDynReg() {
        return typeof this.widgetClass !== "string";
      },
      style () {
        var style = {}

        if (this.widgetInstance) {

          style['background-color'] = this.widgetInstance.color || '#FFFFFF'

          var metadata = this.widgetInstance.constructor.options.metadata
          if (metadata.minWidth) {
            style.minWidth = metadata.minWidth + 'px'
            if (this.inline) {
              style.width = style.minWidth
            }
          }
          if (metadata.minHeight) {
            style.minHeight = metadata.minHeight + 'px'
            style.height = this.inline ? style.minHeight : '1px'
          }
        }

        return style
      }
    },
    mounted() {
      if (this.isDynReg) {

        var WidgetComponent;

        // create constructor
        if (this.$ethingUI.utils.isPlainObject(this.widgetClass)) {
          WidgetComponent = Vue.extend(this.widgetClass);
        } else {
          WidgetComponent = this.widgetClass
        }

        // create an instance of WidgetComponent and mount it
        var WidgetComponentInstance = new WidgetComponent({
          propsData: this.widgetOptions,
          parent: this
        });

        WidgetComponentInstance.$on("error", evt => {
          this.error = evt;
        });

        WidgetComponentInstance.$mount(this.$refs.dynW);

        this.widgetInstance = WidgetComponentInstance
      } else {
        this.widgetInstance = this.$refs.staticW
      }
    },
    methods: {
      hasContentOverflow () {
        var el = null
        if (this.isDynReg) {
          el = this.$refs.dynW
        } else {
          if (this.$refs.staticW) {
            el = this.$refs.staticW.$el
          }
        }
        if (el) {
          return el.scrollWidth > el.clientWidth
        }
        return false
      }
    }

}
</script>

<style lang="stylus">
@import '~variables'

.widget
  overflow hidden
  &.widget-err
    border 1px solid $negative
    background-color $red-1
  & > .widget-err-layer
    color $negative
  & > .widget-content-layer.fit > *
    width: 100%
    height: 100%

</style>
