<template>
  <div class="form-schema-ething-flow-node">
    <small v-if="schema.description" class="form-schema-description">{{ schema.description }}</small>

    <flow-node-select
      :value="castedModel"
      @input="setValue"
      :filter="computed_filter"
      :multiple="multiple"
      :flow="flow"
      use-id
    />

    <small class="form-schema-error" v-if="$v.value.$error">{{ errorMessage }}</small>
  </div>
</template>

<script>

import FlowNodeSelect from '../../components/FlowNodeSelect'
import { FormComponent, registerForm } from './core'


var FormSchemaEthingFlowNode = {
  name: 'FormSchemaEthingFlowNode',

  mixins: [FormComponent],

  components: {
    FlowNodeSelect
  },

  computed: {
    multiple () {
      return this.schema.type === 'array'
    },
    computed_filter () {
      var schema = this.schema

      return (flow, node) => {
        return this.filter(flow, node, schema)
      }
    },
    flow () {
      return this.schema._flow
    }
  },

  methods: {
    filter (flow, node, schema) {
      if (schema.filter) {
        if (!schema.filter.call(schema, flow, node)) return false
      }
      return true
    }
  }

}

registerForm(FormSchemaEthingFlowNode, schema => {
  if (schema.format === 'ething.flow.node') {
    return true
  }
})

export default FormSchemaEthingFlowNode

</script>
