<template>
  <div class="resource-edit">
    <create-or-edit :is-edit="true" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import CreateOrEdit from './components/CreateOrEdit.vue'

export default Vue.extend({
  name: 'ResourceEdit',
  components: {
    CreateOrEdit
  }
})
</script>

<style lang="scss" scoped></style>
