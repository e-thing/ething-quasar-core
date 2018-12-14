<template>
  <div>
      <template v-if="!isWidget">
        <div ref="component"/>
      </template>
      <template v-else v-for="(widget,index) in widgets">
        <widget :class="{'q-mt-md': index}" :widgetClass="widget.widgetClass" :widgetOptions="widget.widgetOptions" />
      </template>
  </div>
</template>

<script>


export default {
    name: 'DeviceComponent',

    props: {
      device: {}
    },

    data() {
      return {
        isWidget: false,
        instance: null,
        widgets: [],
        widgetClass: null,
        widgetOptions: null
      };
    },

    computed: {
      computedDevice () {
        if (typeof this.device == 'string') {
          return this.$ething.arbo.get(this.device)
        }
        return this.device
      }
    },

    mounted() {
      if (!this.computedDevice) return

      var meta = this.$ethingUI.get(this.computedDevice)
      var component = meta.mainComponent
      var componentAttr = meta.mainComponentAttributes

      if (typeof component == 'string') {
        component = [component]
        componentAttr = [componentAttr]
      }

      if (Array.isArray(component)) {
        // component contains a list of widget id of the current resource

        component.forEach( (widgetId, index) => {

            var widgetClass = meta.widgets[widgetId]

            if (!widgetClass) {
                console.error('widget "' + widgetId + '" not found for the resource ' + this.computedDevice.id())
                return
            }

            var widgetOptions = {
                resource: this.computedDevice.id()
            }

            if (componentAttr && componentAttr[index]) {
                Object.assign(widgetOptions, componentAttr[index])
            }

            this.widgets.push({
                widgetClass,
                widgetOptions
            })
        })

        this.isWidget = !!this.widgets.length

      }

      else if (component) {

        // create constructor
        if (this.$ethingUI.utils.isPlainObject(component)) {
          component = Vue.extend(component);
        }

        // create an instance of Component and mount it
        var componentInstance = new component({
          propsData: Object.assign({
            resource: this.computedDevice
          }, componentAttr || {}),
          parent: this
        });

        componentInstance.$mount(this.$refs.component);

        this.instance = componentInstance
      }

    },

    beforeDestroy () {
      if (this.instance) {
        this.instance.$destroy()
      }
    }

}
</script>
