<template>
  <div class="form-schema-ething-flow-descriptor">
    <small v-if="schema.description" class="form-schema-description">{{ schema.description }}</small>

    <q-select
      v-model="typeIndex"
      :options="selectOptions"
    />

    <form-schema v-if="valueSchema" :schema="valueSchema" :model="value_" @input="onValueChange($event)" @error="setError($event)"/>

    <small class="form-schema-error" v-if="$v.value.$error">{{ errorMessage }}</small>
  </div>
</template>

<script>

import { FormComponent, registerForm } from './core'


var FormSchemaEthingFlowDescriptor = {
  name: 'FormSchemaEthingFlowDescriptor',

  mixins: [FormComponent],

  components: {
    FlowNodeSelect
  },

  data () {
    return {
      typeIndex: null,
      value_: null
    }
  },

  watch: {
    typeIndex () {
      this.onChange()
    },
    value_ () {
      this.onChange()
    }
  },

  computed: {
    selectOptions () {
      return this.schema.oneOf.map((s, index) => {
        return {
          label: s.properties.type.label,
          value: index
        }
      })
    },
    typeName () {
      if (this.typeIndex === null) return
      return this.schema..oneOf[this.typeIndex].properties.type.const
    },
    valueSchema () {
      if (this.typeIndex === null) return
      return this.schema..oneOf[this.typeIndex].properties.value
    },
    hasValue () {
      return !!this.valueSchema
    }
  },

  methods: {
    onValueChange (val) {
      this.value_ = val
    },
    onChange () {
      var type = this.typeName
      if (!type) return
      var v = {
        type
      }
      if (this.hasValue) {
        v.value = this.value_
      }
      this.setValue(v)
    }
  }

}

registerForm(FormSchemaEthingFlowDescriptor, schema => {
  if (schema.format === 'ething.flow.descriptor') {
    return true
  }
})

export default FormSchemaEthingFlowDescriptor

</script>
