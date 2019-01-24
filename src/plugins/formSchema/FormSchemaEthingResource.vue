<template>
  <div class="form-schema-ething-resource">
    <small v-if="schema.description" class="form-schema-description">{{ schema.description }}</small>

    <resource-select
      :value="castedModel"
      @input="setValue"
      :filter="computed_filter"
      :multiple="multiple"
      use-id
      :create-types="createTypes"
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
    multiple () {
      return this.schema.type === 'array'
    },
    computed_filter () {
      var schema = this.schema

      return (r) => {
        return this.filter(r, schema)
      }
    },
    createTypes () {
      var r = []
      if (this.schema.onlyTypes) {
        r = r.concat(this.schema.onlyTypes)
      }
      if (this.schema.must_throw) {
        // find all class that emits the signal
        this.$ethingUI.iterate('resources', (resourceClsName) => {
          var resourceCls = this.$ethingUI.get(resourceClsName)
          if (resourceCls.signals.indexOf(this.schema.must_throw) !== -1) {
            r.push(resourceClsName)
          }
        })
      }
      return r
    }
  },

  methods: {
    filter (r, schema) {
      var pok;

      if (schema.must_throw) {
        pok = false
        var signals = this.$ethingUI.get(r).signals
        for (var i in signals) {
          if (this.$ethingUI.isSubclass(signals[i], schema.must_throw)) {
            pok = true
            break
          }
        }
        if (!pok) return false
      }
      if (schema.onlyTypes) {
        pok = false
        var accepted_types = schema.onlyTypes
        for(var i in accepted_types) {
          if (r.isTypeof(accepted_types[i])){
            pok = true
            break
          }
        }
        if (!pok) return false
      }
      if (schema.filter) {
        if (!schema.filter.call(schema, r)) return false
      }

      return true
    }
  }

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
