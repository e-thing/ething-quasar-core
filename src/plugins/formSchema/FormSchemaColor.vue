<template>
  <div class="form-schema-color">
    <small v-if="schema.description" class="form-schema-description">{{ schema.description }}</small>
    <q-color :value="castedModel" v-on:input="setValue" :error="$v.value.$error" format-model="hex"/>
    <small class="form-schema-error" v-if="$v.value.$error">{{ errorMessage }}</small>
  </div>
</template>

<script>

import { FormComponent } from './core'

export default {
  name: 'FormSchemaDate',

  mixins: [FormComponent],

  props: {
    model: String
  },

  methods: {
    cast (model) {
      return model || '#FF0000' // qcolor bugs if #000000 or #FFFFFF
    }
  }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
