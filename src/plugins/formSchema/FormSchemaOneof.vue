<template>
  <form-schema-layout class="form-schema-oneof">

    <div :class="inlined ? 'row' : ''">
      <q-select
        v-model="typeIndex"
        :options="selectOptions"
        :class="inlined?(valueSchema ? 'col-auto' : 'col-12'):''"
      />
      <form-schema :class="inlined?'col':''" :inline="inlined" :key="typeIndex" v-if="valueSchema" :level="level+1" :schema="valueSchema" :value="value_" required @input="onValueChange($event)" @error="$emit('error',$event)"/>
    </div>

  </form-schema-layout>
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
    c_value: {
      handler (model) {
        if (!model) return
        this.value_ = model.value
        var type = model.type
        for(var i in this.c_schema.oneOf) {
          if (this.c_schema.oneOf[i].properties.type.const === type){
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
      return this.c_schema.oneOf.map((s, index) => {
        return {
          label: s.properties.type.label || s.properties.type.const,
          value: index
        }
      })
    },
    typeName () {
      if (this.typeIndex === null) return
      return this.c_schema.oneOf[this.typeIndex].properties.type.const
    },
    valueSchema () {
      if (this.typeIndex === null) return
      return this.c_schema.oneOf[this.typeIndex].properties.value
    },
    hasValue () {
      return !!this.valueSchema
    }
  },

  methods: {
    onValueChange (val) {
      this.onChange(val)
    },
    onChange (val) {
      this.value_ = val
      var type = this.typeName
      if (!type) return
      var v = {
        type
      }
      if (this.hasValue) {
        v.value = val
      }
      this.c_value = v
    }
  }

}

</script>
