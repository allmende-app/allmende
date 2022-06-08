<script setup lang="ts">
import { RouterView } from 'vue-router'

import { useRouter } from 'vue-router'
import VNavigation from './components/VNavigation.vue'

const router = useRouter()
</script>

<template>
  <div
    class="app"
    :class="{
      withNavigation: !$route.meta.hideNavigation,
      fullSize: $route.meta.fullSize,
    }"
  >
    <VNavigation v-if="!$route.meta.hideNavigation" />
    <RouterView class="main" />
  </div>
</template>

<style lang="sass" scoped>
.app
  width: 100%
  max-width: 1200px
  margin: 0 auto
  > .main
    flex: 1
    margin-inline: allmende.$size-xsmall
  &.withNavigation > .main
    padding-bottom: allmende.$size-huge
  &.fullSize
    width: 100%
    max-width: none
    margin: 0
    > .main
      margin: 0
  @include allmende.screen-laptop
    box-sizing: border-box
    display: flex
    &.withNavigation
      padding: allmende.$size-xlarge
      gap: allmende.$size-xlarge
      > .main
        padding-bottom: 0
        margin-inline-start: allmende.$size-huge + allmende.$size-xlarge
</style>
