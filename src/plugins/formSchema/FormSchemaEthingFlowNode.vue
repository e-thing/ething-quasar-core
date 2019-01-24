<template>
  <form-schema-layout class="form-schema-ething-flow-node">
    <flow-node-select
      :value="c_value"
      @input="c_value = $event"
      :filter="computed_filter"
      :multiple="multiple"
      :flow="flow"
      use-id
    />
  </form-schema-layout>
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
      return this.c_schema.type === 'array'
    },
    computed_filter () {
      var schema = this.c_schema

      return (flow, node) => {
        return this.filter(flow, node, schema)
      }
    },
    flow () {
      return this.c_schema._flow
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
