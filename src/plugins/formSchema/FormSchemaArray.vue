<template>
  <form-schema-layout class="form-schema-array" :class="{indent: level}">

    <div>
      <q-btn flat size="md"
        @click="addItem"
        label="Add item"
        icon="add"
      />
    </div>

    <div
      v-for="(item, key) in items"
      :key="key"
      class="formField"
    >
      <div>
        <span class="q-field-label" style="vertical-align: middle">#{{ key }}</span>

        <q-btn flat size="sm"
          color="negative"
          @click="removeItem(key)"
          label="remove"
          icon="delete"
          style="vertical-align: middle"
        />

        <q-btn flat size="sm"
          color="secondary"
          @click="moveItem(key, 'up')"
          label="up"
          icon="arrow_drop_up"
          v-if="key > 0"
        />

        <q-btn flat size="sm"
          color="secondary"
          @click="moveItem(key, 'down')"
          label="down"
          icon="arrow_drop_down"
          v-if="key < items.length -1"
        />

      </div>

      <form-schema :schema="item.schema" :value="getModel(key)" :level="level+1" @input="onChildValueChange(key, $event)" @error="onChildErrorChange(key, $event)"/>

    </div>

  </form-schema-layout>
</template>

<script>

import { FormComponent } from './core'

export default {
  name: 'FormSchemaArray',

  mixins: [FormComponent],

  data () {
    return {
      items: []
    }
  },

  watch: {
    c_value () {
      this.refreshFromModel()
    }
  },

  methods: {
    refreshFromModel () {
      this.items = (this.c_value || []).map(v => {
        return {
          schema: this.c_schema.items || {}
        }
      })
    },

    getModel (key) {
      return Array.isArray(this.c_value) && key < this.c_value.length ? this.c_value[key] : undefined
    },

    addItem () {
      this.items.push({
        schema: this.c_schema.items || {}
      })
    },

    removeItem (key) {
      this.items.splice(key, 1)
      this.c_value.splice(key, 1)
    },

    moveItem (key, dir) {
      var rmitem = this.items.splice(key, 1)
      var rm = this.c_value.splice(key, 1)
      this.items.splice(key+(dir==='up' ? -1 : 1), 0, rmitem[0])
      this.c_value.splice(key+(dir==='up' ? -1 : 1), 0, rm[0])
    },

    onChildValueChange (key, val) {
      this.$set(this.c_value, key, val)
    },

    onChildErrorChange (key, val) {
      this.$set(this.items[key], 'error', val)
      /*this.$set(this.items, key, Object.assign({}, this.items[key], {
        error: val
      }))*/
      this.$emit('error', Object.values(this.items).some(item => item.error))
    }
  },

  mounted () {
    this.refreshFromModel()
  }


}

</script>
