
<script>

import Vue from 'vue'


Vue.config.optionMergeStrategies.metadata = Vue.config.optionMergeStrategies.props;

export default {

  name: 'WWidget',

  props: {},
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
      properties: {}
    }
  }
}
</script>
