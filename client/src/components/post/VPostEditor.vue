<template>
  <section>
    <div class="preview">
      <img v-if="fileData" :src="(fileData as string)" />
    </div>
    <form class="information">
      <v-input
        v-model="longitude"
        label="Longitude"
      />
      <v-input
        v-model="latitude"
        label="Latitude"
      />
      <v-input v-model="description" label="Description" />
    </form>
  </section>
</template>

<script setup lang="ts">
import VInput from '@/components/VInput.vue'
import VSpeciesSelector from '@/components/VSpeciesSelector.vue'
import { computed, ref, type PropType } from 'vue'
import exifr from 'exifr'
import type { SightingData } from '@/views/CreatePost.vue'

const emit = defineEmits(['update:modelValue'])

const fileData = ref(null as string | ArrayBuffer | null)
const locationExtracted = ref(false)

const props = defineProps({
  modelValue: {
    type: Object as PropType<SightingData>,
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
const longitude = computed({
  get: () => {
    return String(props.modelValue.lng)
  },
  set: (value) => {
    updateValue({
      ...props.modelValue,
      lng: parseFloat(value),
    })
  },
})
const latitude = computed({
  get: () => {
    return String(props.modelValue.lat)
  },
  set: (value) => {
    updateValue({
      ...props.modelValue,
      lat: parseFloat(value),
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

exifr.gps(props.modelValue.file).then((result) => {
  if (result) {
    longitude.value = String(result.longitude)
    latitude.value = String(result.latitude)
    locationExtracted.value = true
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
</style>
