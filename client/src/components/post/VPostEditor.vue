<template>
  <section :class="{ 'preview-mode': previewMode }">
    <div class="preview">
      <img v-if="fileData" :src="(fileData as string)" />
    </div>
    <form v-if="!previewMode" class="information" @submit.prevent>
      <v-species-selector />
      <v-location-selector
        v-model="location"
        :helper-text="
          locationExtracted
            ? 'Location data has been extracted from the image.'
            : undefined
        "
      />
      <v-input v-model="description" label="Description" />
    </form>
  </section>
</template>

<script setup lang="ts">
import VInput from '@/components/VInput.vue'
import VLocationSelector from '@/components/VLocationSelector.vue'
import VSpeciesSelector from '@/components/VSpeciesSelector.vue'
import { computed, ref, type PropType } from 'vue'
import exifr from 'exifr'
import type { SightingData } from '@/views/CreatePost.vue'
import { reverseLocationSearch } from '@/utils'

const emit = defineEmits(['update:modelValue'])

const fileData = ref(null as string | ArrayBuffer | null)
const locationExtracted = ref(false)

const props = defineProps({
  modelValue: {
    type: Object as PropType<SightingData>,
    required: true,
  },
  previewMode: {
    type: Boolean as PropType<boolean>,
    required: true,
  },
})

const updateValue = (data: SightingData) => {
  emit('update:modelValue', data)
}

const description = computed({
  get: () => {
    return props.modelValue.description
  },
  set: (value) => {
    updateValue({
      ...props.modelValue,
      description: value,
    })
  },
})
const location = computed({
  get: () => {
    return props.modelValue.location
  },
  set: (value) => {
    updateValue({
      ...props.modelValue,
      location: value,
    })
  },
})

let reader = new FileReader()
reader.addEventListener(
  'load',
  () => {
    fileData.value = reader.result
  },
  false,
)
reader.readAsDataURL(props.modelValue.file)

exifr.gps(props.modelValue.file).then(async (result) => {
  if (result && !isNaN(result.latitude) && !isNaN(result.longitude)) {
    locationExtracted.value = true
    updateValue({
      ...props.modelValue,
      location: {
        name: 'Image Location',
        subname: '',
        lng: result.longitude,
        lat: result.latitude,
      },
    })
    const location = await reverseLocationSearch(
      result.longitude,
      result.latitude,
    )
    updateValue({
      ...props.modelValue,
      location,
    })
  }
})
</script>

<style lang="sass" scoped>
section
  background: var(--layer-20)
  border-radius: allmende.$radius-card
  display: flex
  flex-direction: column

.preview
  border-radius: allmende.$radius-card
  background: var(--layer-05)
  box-shadow: var(--shadow-card-subtle)
  min-height: allmende.$radius-card * 2
  line-height: 0
  overflow: hidden
  max-height: 512px
  align-self: start
  img
    display: block
    width: 100%

.information
  display: flex
  flex-direction: column
  gap: allmende.$size-xsmall
  padding: allmende.$size-small

.preview-mode
  width: 100px
  height: 100px
  .preview
    width: 100%
    height: 100%
</style>
