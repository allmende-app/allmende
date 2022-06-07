<template>
  <div class="sighting">
    <img :src="source" alt="">

    <div class="details">
      <div class="location">
        {{ location }}
      </div>

      <div class="animal-name">
        {{ name }}
      </div>

      <div class="specie">
        {{ specie }}
      </div>
    </div>
    </div>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'
import { ref } from 'vue'

const props = defineProps({
  source: {
    type: String as PropType<string>,
    required: true,
  },
  location: {
    type: String as PropType<string>,
    required: false,
    default: null
  },
  name: {
    type: String as PropType<string>,
    required: true,
  },
  specie: {
    type: String as PropType<string>,
    required: true
  }
})
</script>

<style lang="sass" scoped>
.sighting

  background-color: white
  border-radius: allmende.$radius-card

  img
    height: auto
    width: 100%
    border-radius: allmende.$radius-card

  .details
    padding: 12px allmende.$size-small 16px 24px
    .name
      @include allmende.text-headline

    .specie, .location
      @include allmende.text-footnote

    .location
      color: var(--text-secondary)

</style>
