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

export default {
  name: 'FormSchemaEnum',

  mixins: [FormComponent],

  computed: {
    selectOptions () {
      var enumLabels = this.c_schema.enumLabels || []
      return (this.c_schema.enum || []).map( (v, i) => {
        return {
            label: i<enumLabels.length ? enumLabels[i] : String(v),
            value: v
        }
      })
    }
  }

}

</script>
