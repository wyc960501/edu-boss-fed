<template>
  <div class="advert-space-edit">
    <create-or-update-space :is-edit="true"/>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import CreateOrUpdateSpace from './components/CreateOrUpdate.vue'

export default Vue.extend({
  name: 'AdvertSpaceEdit',
  components: {
    CreateOrUpdateSpace
  }
})
</script>

<style lang="scss" scoped>

</style>
