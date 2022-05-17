<template>
  <div class="location">
    <component :is="LocationIcon"></component>
    <span>
      Schlosspart Charlottenburg Berlin
    </span>
  </div>
</template>

<script setup lang="ts">
import LocationIcon from '@/assets/icon16/location.svg'

</script>

<style lang="sass" scoped>
.location
    @include allmende.text-footnote
    display: flex
    justify-content: left
    align-items: center
    gap: 4px
    padding: 4px
    padding-top: 0
</style>
