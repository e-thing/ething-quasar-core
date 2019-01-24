<template>
  <form-schema-layout class="form-schema-multi-type">

    <q-select
      stack-label="type"
      :value="type" @input="setType"
      :options="selectOptions"
    />

    <form-schema v-if="isValid" ref="child" :required="required" :schema="computedSchema" :value="cachedValue" :level="level" @input="onChildValueChange" @error="c_value = $event"/>

  </form-schema-layout>
</template>

<script>

import { FormComponent } from './core'

const defaultTypes = ['string', 'number', 'boolean', 'object', 'array']


export default {
  name: 'FormSchemaMultiType',

  mixins: [FormComponent],

  props: {
    types: {
      type: Array,
      default () {
        return defaultTypes
      }
    }
  },

  computed: {

    isValid () {
      return typeof this.computedSchema === 'object'
    },

    computedSchema () {
      return typeof this.type !== 'undefined' ? { type: this.type } : undefined
    },

    selectOptions () {
      return this.types.map(type => {
        return {
          label: type,
          value: type
        }
      })
    },
  },

  data () {
    return {
      type: undefined,
      cachedValue: undefined
    }
  },

  watch: {
    c_value () {
      this.refreshFromModel()
    },
  },

  methods: {

    setType (type) {
      this.type = type

      this.$nextTick(() => {
        if (this.$refs['child']) {
          this.c_value = this.$refs['child'].value
          this.$emit('error', this.$refs['child'].error)
        }
      })

    },

    refreshFromModel () {
      var jsType = typeof this.c_value

      if (jsType === 'object' && Array.isArray(this.c_value)) {
        jsType = 'array'
      }

      if (this.types.indexOf(jsType) !== -1) {
        this.type = jsType
        this.cachedValue = this.c_value
      } else {
        this.type = this.types[0]
      }
    },

    onChildValueChange (val) {
      this.cachedValue = val
      this.c_value = val
    }
  },

  mounted () {
    this.refreshFromModel()
  },

}

</script>
