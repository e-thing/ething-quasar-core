<template>
  <div class="widget" :class="{'widget-err': hasError}" :style="style">
    <div v-if="hasError" class="widget-err-layer fit">
        <div class="absolute-center text-center ellipsis-3-lines q-caption">
            {{ error || 'error' }}
        </div>
    </div>
    <div class="widget-content-layer" :class="inline ? '' : 'fit'">
      <template v-if="isDynReg">
        <div ref="dynW"/>
      </template>
      <component v-else ref="staticW" :is="widgetClass" v-bind="widgetOptions" @error="error = $event"/>
    </div>
  </div>
</template>

<script>
import { widgets } from '../widget'


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
        widgetInstance: null,
        manualDestroy: false,
        metadata: null
      };
    },
    computed: {
      isDynReg() {
        return typeof this.widgetClass !== "string";
      },
      style () {
        var style = {}

        if (this.widgetInstance) {

          style['background-color'] = this.widgetInstance.bgColor || '#FFFFFF'
          style['color'] = this.widgetInstance.color || '#027be3'

          var metadata = this.metadata
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
      },
      hasError () {
        return !!this.error
      },
      resource () {
        var resource = null
        if (this.widgetOptions.resource) {
          resource = this.$ething.arbo.get(this.widgetOptions.resource)
        }
        return resource
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
        this.manualDestroy = true
      } else {
        this.widgetInstance = this.$refs.staticW
      }

      var metadata = this.widgetInstance.constructor.options.metadata
      if (typeof metadata === 'function') {
        metadata = metadata.call(this, this.resource)
      }
      this.metadata = metadata
    },

    beforeDestroy () {
      if (this.manualDestroy && this.widgetInstance) {
        this.widgetInstance.$destroy()
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
    /* border 1px solid $negative */
    /* background-color $red-1 */
  & > .widget-err-layer
    color white
    background-color $negative
    & > div
      max-width: 100%

  & > .widget-content-layer.fit > *
    width: 100%
    height: 100%

</style>
