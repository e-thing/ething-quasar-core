<template>
  <form-schema-layout class="form-schema-boolean">
    <q-select
      v-bind:value="c_value" v-on:input="c_value = $event"
      :options="[{label: 'True', value: true}, {label: 'False', value: false}]"
      :error="!!error"
    />
  </form-schema-layout>
</template>

<script>

import { FormComponent } from './core'

export default {
  name: 'FormSchemaBooleanSelect',

  mixins: [FormComponent],
}

</script>
