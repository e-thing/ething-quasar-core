<template>
  <form-schema-layout class="form-schema-textarea">
    <q-input
      type="textarea"
      :value="c_value"
      @input="c_value = $event"
      :error="!!error"
    />
  </form-schema-layout>
</template>

<script>
import Input from './Input'

export default {
  name: 'FormSchemaTextarea',

  mixins: [Input]

}

</script>
