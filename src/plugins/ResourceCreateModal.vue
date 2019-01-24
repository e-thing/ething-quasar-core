<template>
  <modal
    ref="modal"
    :value="value"
    @input="$emit('input', $event)"
    title="create"
    icon="add"
    @valid="$emit('ok')"
    @cancel="$emit('cancel')"
  >

    toto

  </modal>
</template>

<script>

export default {
    name: 'ResourceCreateModal',

    props: {
      value: Boolean,
    },

    data () {
        return {}
    },

    methods: {
      show () {
        return this.$refs.modal.show()
      },
      hide () {
        return this.$refs.modal ? this.$refs.modal.hide() : Promise.resolve()
      }
    }

}
</script>
