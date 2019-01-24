<template>
  <form-schema-layout class="form-schema-number-slider">
    <q-slider
      :value="c_value"
      @input="c_value = $event"
      :error="!!error"
      :min="c_schema.minimum"
      :max="c_schema.maximum"
      :step="c_schema.multipleOf"
      label-always
    />
  </form-schema-layout>
</template>

<script>

import FormSchemaNumber from './FormSchemaNumber'

export default {
  name: 'FormSchemaNumberSlider',

  mixins: [FormSchemaNumber],

}

</script>
