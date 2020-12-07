<template>
  <div class="advert-create">
    <create-or-update-advert :is-edit="true" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import CreateOrUpdateAdvert from './components/CreateOrUpdate.vue'

export default Vue.extend({
  name: 'AdvertCreate',
  components: {
    CreateOrUpdateAdvert
  }
})
</script>

<style lang="scss" scoped></style>
