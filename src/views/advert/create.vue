<template>
  <div class="advert-create">
    <create-or-update-advert />
  </div>
</template>

<script>
import Vue from 'vue'
import CreateOrUpdateAdvert from './components/CreateOrUpdate'

export default Vue.extend({
  name: 'AdvertCreate',
  components: {
    CreateOrUpdateAdvert
  }
})
</script>

<style lang="scss" scoped></style>
