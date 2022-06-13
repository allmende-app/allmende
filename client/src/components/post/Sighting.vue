<template>
  <div class="sighting">
    <img :src="`${baseURL}api/image/${source}`" :alt="alt" />

    <div class="details">
      <div class="location">
        {{ location }}
      </div>

      <div class="specie">
        {{ species }}
      </div>

      <div class="animal-kindom">
        {{ kingdom }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ObjectId } from 'mongoose';
import type { PropType } from 'vue'
import { ref } from 'vue'
import type { KingdomType } from '../../../../server/src/interfaces';
import { backend } from '../../utils'
const baseURL = backend.baseURL

const props = defineProps({
  source: {
    type: String as PropType<string | undefined>,
    required: true,
  },
  alt: {
    type: String as PropType<string | undefined>,
    required: true,
  },
  // TODO: do we need something like a location description
  location: {
    type: String as PropType<string>,
    required: false,
    default: null,
  },
  kindom: {
    type: String as PropType<KingdomType | undefined>,
    required: true,
  },
  species: {
    type: Object as PropType<ObjectId | undefined>,
    required: true,
  },
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
    .specie
      @include allmende.text-headline

    .animal-kindom, .location
      @include allmende.text-footnote

    .location
      color: var(--text-secondary)
</style>
