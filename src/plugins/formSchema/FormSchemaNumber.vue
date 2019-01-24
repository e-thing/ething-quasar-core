<template>
  <form-schema-layout class="form-schema-number">
    <q-input
      type="number"
      :value="c_value"
      v-on:input="c_value = $event"
      :error="!!error"
    />
  </form-schema-layout>
</template>

<script>

import { FormComponent } from './core'
import { minValue, maxValue } from 'vuelidate/lib/validators'

export default {
  name: 'FormSchemaNumber',

  mixins: [FormComponent],

  validations () {

    var validators = {}

    // todo : multipleOf , exclusiveMaximum , exclusiveMinimum

    if (typeof this.c_schema.minimum === 'number') {
      validators.minValue = minValue(this.c_schema.minimum)
    }
    if (typeof this.c_schema.maximum === 'number') {
      validators.maxValue = maxValue(this.c_schema.maximum)
    }

    return {
      c_value: validators
    }
  },

  methods: {
    cast (model) {
      return Number(model)
    }
  }

}

</script>
