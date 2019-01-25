<template>
  <form-schema-layout class="form-schema-enum">
    <q-select
      v-bind:value="c_value" v-on:input="c_value = $event"
      :options="selectOptions"
      :error="!!error"
    />
  </form-schema-layout>
</template>

<script>

import { FormComponent } from './core'

/*
options:
$labels: string[], f(val, index, len)
$icons: string[], f(val, index, len)
*/

export default {
  name: 'FormSchemaEnum',

  mixins: [FormComponent],

  computed: {
    selectOptions () {
      return (this.c_schema.enum || []).map( (v, i, arr) => {
        var len = arr.length
        return {
            label: String(this.getLabel(v, i, len)),
            value: v,
            icon: this.getIcon(v, i, len)
        }
      })
    }
  },

  methods: {
    getLabel (val, index, len) {
      var labels = this.c_schema['$labels'] || []

      if (Array.isArray(labels)) {
        if (index<labels.length) return labels[index]
      } else if (typeof labels === 'function') {
        return labels.call(this, val, index, len)
      }

      return val
    },
    getIcon (val, index, len) {
      var icons = this.c_schema['$icons'] || []

      if (Array.isArray(icons)) {
        if (index<icons.length) return icons[index]
      } else if (typeof icons === 'function') {
        return icons.call(this, val, index, len)
      }

    }
  }

}

</script>
