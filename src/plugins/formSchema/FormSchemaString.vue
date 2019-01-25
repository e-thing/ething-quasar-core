<template>
  <form-schema-layout class="form-schema-string">
    <q-input
      :type="inputType"
      :value="c_value"
      @input="c_value = $event"
      :error="!!error"
    />
  </form-schema-layout>
</template>

<script>

import { FormComponent } from './core'
import { minLength, maxLength, email } from 'vuelidate/lib/validators'
import { regex } from './validators'

export default {
  name: 'FormSchemaString',

  mixins: [FormComponent],

  validations () {

    var validators = {}

    if (typeof this.c_schema.minLength === 'number') {
      validators.minLength = minLength(this.c_schema.minLength)
    }
    if (typeof this.c_schema.maxLength === 'number') {
      validators.maxLength = maxLength(this.c_schema.maxLength)
    }
    if (typeof this.c_schema.pattern === 'string') {
      validators.regex = regex(this.c_schema.pattern)
    }
    if (this.c_schema.format === 'email') {
      validators.email = email
    }

    return {
      c_value: validators
    }
  },

  methods: {
    cast (model) {
      return model === null ? '' : String(model)
    },
  },

  computed: {
    inputType () {
      if (this.c_schema.format === 'text') return 'textarea'
      if (this.c_schema.format === 'email') return 'email'
      if (this.c_schema.format === 'password') return 'password'
      return 'text'
    }
  }

}

</script>
