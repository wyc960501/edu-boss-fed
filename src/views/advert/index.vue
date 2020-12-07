<template>
  <div class="advert-index">
    <advert-list />
  </div>
</template>

<script>
import Vue from 'vue'
import AdvertList from './components/List'

export default Vue.extend({
  name: 'AdvertIndex',
  components: {
    AdvertList
  }
})
</script>

<style lang="scss" scoped></style>
