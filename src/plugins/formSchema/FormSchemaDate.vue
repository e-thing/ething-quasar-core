<template>
  <form-schema-layout class="form-schema-date">
    <q-datetime :type="datetype" v-bind:value="c_value" v-on:input="c_value = $event" :error="!!error" format24h/>
  </form-schema-layout>
</template>

<script>

import { FormComponent } from './core'

export default {
  name: 'FormSchemaDate',

  mixins: [FormComponent],

  computed: {
    datetype () {
      if (this.c_schema.format === 'date') {
        return 'date'
      }
      if (this.c_schema.format === 'time') {
        return 'time'
      }
      return 'datetime'
    },
  }

}

</script>
