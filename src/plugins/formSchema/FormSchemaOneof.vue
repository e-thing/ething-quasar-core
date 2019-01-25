<template>
  <form-schema-layout class="form-schema-oneof">

    <div :class="inlined ? 'row' : ''">
      <q-select
        v-model="subtypeindex"
        :options="selectOptions"
        :class="inlined?(subvalueschema ? 'col-auto' : 'col-12'):''"
      />
      <form-schema :class="inlined?'col':''" :inline="inlined" v-if="subvalueschema" :level="level+1" :schema="subvalueschema" required :value="subvalue" @input="subvalue = $event" @error="$emit('error',$event)"/>
    </div>

  </form-schema-layout>
</template>

<script>

import { FormComponent, registerForm } from './core'


export default {
  name: 'FormSchemaEthingOneof',

  mixins: [FormComponent],

  computed: {
    selectOptions () {
      return this.c_schema.oneOf.map((s, index) => {
        return {
          label: s.properties.type.label || s.properties.type.const,
          value: index
        }
      })
    },

    subvalue: {
      get () {
        if (this.c_value) return this.c_value.value
      },
      set (val) {
        if (this.c_value)
          this.$set(this.c_value, 'value', val)
        else
          this.c_value = {
            type: this.subtype,
            value: val
          }
      }
    },

    subtype: {
      get () {
        if (this.c_value) return this.c_value.type
      },
      set (val) {
        this.c_value = {
          type: val
        }
      }
    },

    subtypeindex: {
      get () {
        var type = this.subtype
        for(var i in this.c_schema.oneOf) {
          if (this.c_schema.oneOf[i].properties.type.const === type){
            return parseInt(i)
          }
        }
      },
      set (index) {
        this.subtype = this.c_schema.oneOf[index].properties.type.const
      }
    },

    subvalueschema () {
      if (typeof this.subtypeindex === 'undefined') return
      return this.c_schema.oneOf[this.subtypeindex].properties.value
    },

  }

}

</script>
