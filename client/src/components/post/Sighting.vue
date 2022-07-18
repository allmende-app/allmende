<template>
  <div class="sighting">
    <img
      :src="`${baseURL}api/image/${props.sighting.imageUrl}`"
      :alt="props.sighting.alt"
    />

    <div
      class="details"
      v-if="props.sighting.location || props.sighting.species"
    >
      <div v-if="props.sighting.location" class="location">
        {{ props.sighting.location }}
      </div>

      <div v-if="props.sighting.species" class="species">
        {{
          props.sighting.species.vernacularName ||
          props.sighting.species.canonicalName
        }}
      </div>

      <div v-if="props.sighting.species" class="animal-kindom">
        {{
          props.sighting.species.vernacularName
            ? props.sighting.species.canonicalName
            : props.sighting.species.scientificName
        }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Sighting } from '@/interfaces/types'
import { backend } from '@/utils'
import type { PropType } from 'vue'
const baseURL = backend.baseURL

const props = defineProps({
  sighting: {
    type: Object as PropType<Sighting>,
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
    background: var(--layer-05)
    box-shadow: var(--shadow-card-subtle)
    display: block

  .details
    padding: 12px allmende.$size-small 16px 24px
    .species
      @include allmende.text-headline

    .animal-kindom, .location
      @include allmende.text-footnote

    .location
      color: var(--text-secondary)
      &:not(:last-child)
        margin-bottom: 4
        px
</style>
