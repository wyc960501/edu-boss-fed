<template>
  <div class="advert-space-create">
    <create-or-update-space />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import CreateOrUpdateSpace from './components/CreateOrUpdate.vue'

export default Vue.extend({
  name: 'AdverSpaceCreate',
  components: {
    CreateOrUpdateSpace
  }
})
</script>

<style lang="scss" scoped>

</style>
