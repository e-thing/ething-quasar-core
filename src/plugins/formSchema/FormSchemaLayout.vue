<template>
  <div class="form-schema-layout" :style="{display: inlined ? 'inline' : 'block'}" :class="{indent: level}">
    <small
      style="display: block;"
      v-if="!inlined && schema.description"
      class="form-schema-description"
    >
      {{ schema.description }}
    </small>
    <slot></slot>
    <small
      style="display: block;"
      class="form-schema-error"
      v-if="!inlined && error"
    >
      {{ error }}
    </small>
  </div>
</template>

<script>

export default {
  name: 'formSchemaLayout',

  computed: {
    inlined () {
      return this.$parent.inlined
    },

    schema () {
      return this.$parent.c_schema
    },

    error () {
      return this.$parent.error
    },

    level () {
      return this.$parent.level
    },

  },

}

</script>

<style lang="stylus">
@import '~variables'

.form-schema-description
    margin-bottom 8px
    display inline-block
    color $faded

.form-schema-error
  color $negative

pad-width = 20px

.indent
  margin-left: pad-width

</style>
