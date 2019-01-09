<template>
  <div class="form-schema-ething-resource">
    <small v-if="schema.description" class="form-schema-description">{{ schema.description }}</small>

    <resource-select
      :value="castedModel"
      @input="setValue"
      :filter="filter"
      :type="types"
      :multiple="multiple"
      use-id
    />

    <small class="form-schema-error" v-if="$v.value.$error">{{ errorMessage }}</small>
  </div>
</template>

<script>

import ResourceSelect from '../../components/ResourceSelect'
import { FormComponent, registerForm } from './core'


var FormSchemaEthingResource = {
  name: 'FormSchemaEthingResource',

  mixins: [FormComponent],

  components: {
    ResourceSelect
  },

  computed: {
    types () {
      if (this.schema.onlyTypes) {
        return this.schema.onlyTypes.join(' ')
      }
    },
    multiple () {
      return this.schema.type === 'array'
    },
    filter () {
      var schema = this.schema
      var filters = []
      if (schema.filter) {
        filters.push((r) => {
          return schema.filter.call(schema, r)
        })
      }
      if (schema.must_throw) {
        filters.push((r) => {
          var signals = this.$ethingUI.get(r).signals
          for (var i in signals) {
            if (this.$ethingUI.isSubclass(signals[i], schema.must_throw)) return true
          }
        })
      }
      if (filters.length) {
        return function (r) {
          for(var i in filters) {
            if (!filters[i].call(schema, r)) return false
          }
          return true
        }
      }
    }
  },

}

registerForm(FormSchemaEthingResource, schema => {
  if (schema.format === 'ething.resource') {
    return true
  }
})

export default FormSchemaEthingResource

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
