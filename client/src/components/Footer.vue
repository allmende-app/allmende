<template>
  <div class="footer">
    <a @click="openPrivacy" class="footer-link"> Privacy </a>
    <a @click="openLicense" class="footer-link"> License </a>
  </div>
</template>

<script lang="ts" setup>
import router from '../router'
import VButton from './VButton.vue'

const openPrivacy = () => router.push('/privacy')
const openLicense = () => router.push('/license')
</script>

<style lang="sass">
.footer
  position: relative
  @include allmende.screen-laptop
    position: fixed
  right: 0
  bottom: 0

  display: flex
  flex-direction: row
  justify-content: flex-end
  gap: allmende.$size-xxsmall
  padding: allmende.$size-xxsmall
  background-color: var(--layer-20)
  border-bottom-left-radius: allmende.$radius-card
  border-top-left-radius: allmende.$radius-card

  .footer-link
    cursor: pointer

</style>
