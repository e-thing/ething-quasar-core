<template>
  <div class="form-schema-oneof">
    <small v-if="!inlined && schema.description" class="form-schema-description">{{ schema.description }}</small>
    
    <div :class="inlined ? 'row' : ''">
      <q-select
        v-model="typeIndex"
        :options="selectOptions"
        :class="inlined?(valueSchema ? 'col-auto' : 'col-12'):''"
      />
      <form-schema :class="inlined?'col':''" :inline="inlined" :key="typeIndex" v-if="valueSchema" :level="level+1" :schema="valueSchema" :model="value_" required @input="onValueChange($event)" @error="setError($event)"/>
    </div>
    
  </div>
</template>

<script>

import { FormComponent, registerForm } from './core'


export default {
  name: 'FormSchemaEthingOneof',

  mixins: [FormComponent],

  data () {
    return {
      typeIndex: 0,
      value_: undefined
    }
  },

  watch: {
    typeIndex (val) {
      this.onChange()
    },
    castedModel: {
      handler (model) {
        if (!model) return
        var value = model.value
        if (typeof value !== 'undefined' && value !==null) {
          this.value_ = value
        }
        var type = model.type
        for(var i in this.schema.oneOf) {
          if (this.schema.oneOf[i].properties.type.const === type){
            this.typeIndex = parseInt(i)
            return
          }
        }
      },
      immediate: true
    }
  },

  computed: {
    selectOptions () {
      return this.schema.oneOf.map((s, index) => {
        return {
          label: s.properties.type.label || s.properties.type.const,
          value: index
        }
      })
    },
    typeName () {
      if (this.typeIndex === null) return
      return this.schema.oneOf[this.typeIndex].properties.type.const
    },
    valueSchema () {
      if (this.typeIndex === null) return
      return this.schema.oneOf[this.typeIndex].properties.value
    },
    hasValue () {
      return !!this.valueSchema
    }
  },

  methods: {
    onValueChange (val) {
      this.onChange()
    },
    onChange () {
      var val = this.value_
      this.value_ = undefined
      var type = this.typeName
      if (!type) return
      var v = {
        type
      }
      if (this.hasValue) {
        v.value = val
      }
      this.setValue(v)
    }
  }

}

</script>
