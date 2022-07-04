<template>
  <div class="license">
    <v-title>
      <template v-slot:left>
        <v-button :icon="ArrowLeftSVG" tooltip="Back" @click="back" />
      </template>
    </v-title>
    <h1>License</h1>
    <p>
      TODO: License
    </p>
  </div>
</template>

<script setup lang="ts">
import VTitle from '@/components/VTitle.vue';
import ArrowLeftSVG from '@/assets/icon24/arrow-left.svg?component'
import router from '../router';
import VButton from '@/components/VButton.vue'

const back = () => router.back()

</script>

<style lang="sass" scoped>
.license
  // test
</style>
