<template>
  <div class="form-schema-string">
    <small v-if="schema.description" class="form-schema-description">{{ schema.description }}</small>
    <q-input
      :type="inputType"
      v-bind:value="castedModel"
      v-on:input="setValue"
      :error="$v.value.$error"
    />
    <small class="form-schema-error" v-if="$v.value.$error">{{ errorMessage }}</small>
  </div>
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

    if (typeof this.schema.minLength === 'number') {
      validators.minLength = minLength(this.schema.minLength)
    }
    if (typeof this.schema.maxLength === 'number') {
      validators.maxLength = maxLength(this.schema.maxLength)
    }
    if (typeof this.schema.pattern === 'string') {
      validators.regex = regex(this.schema.pattern)
    }
    if (this.schema.format === 'email') {
      validators.email = email
    }

    return {
      value: validators
    }
  },

  methods: {
    cast (model) {
      return model === null ? '' : String(model)
    },
  },

  computed: {
    inputType () {
      if (this.schema.format === 'text') return 'textarea'
      if (this.schema.format === 'email') return 'email'
      if (this.schema.format === 'password') return 'password'
      return 'text'
    }
  }

}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
