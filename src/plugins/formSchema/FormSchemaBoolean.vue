<template>
  <form-schema-layout class="form-schema-boolean">
    <q-toggle :class="inlined ? '' : 'block'" v-bind:value="!!c_value" v-on:input="c_value = $event" :error="!!error"/>
  </form-schema-layout>
</template>

<script>

import { FormComponent } from './core'

export default {
  name: 'FormSchemaBoolean',

  mixins: [FormComponent],
}

</script>
