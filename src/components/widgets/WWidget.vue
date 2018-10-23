
<script>

import Vue from 'vue'
import { extend } from 'quasar'

Vue.config.optionMergeStrategies.metadata = function (parent, child) {
    return extend(true, {}, parent || {}, child || {})
}

export default {

  name: 'WWidget',

  props: {
    color: String,
    default: '#ffffff'
  },

  data() {
    return {
      error: false
    };
  },
  watch: {
    error(value, oldValue) {
      this.$emit("error", value);
    }
  },
  methods: {
    setError (err) {
      this.error = err
    }
  },

  metadata: {
    label: 'widget',
    description: null,
    minWidth: null,
    maxWidth: null,
    minHeight: null,
    maxHeight: null,
    options: {
      // a json schema describing the user options
      properties: {
        color: {
          type: 'string',
          format: 'color',
          description: 'The color of the widget\'s background',
          default: '#ffffff'
        }
      }
    }
  }
}
</script>
