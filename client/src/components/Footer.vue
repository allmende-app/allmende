<template>
  <div class="footer">
    <v-button @click="openPrivacy" class="secondary"> Privacy </v-button>
    <v-button @click="openLicense" class="secondary"> License </v-button>
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
</style>
