<template>
  <section :class="{ 'preview-mode': previewMode }">
    <div class="preview">
      <img v-if="fileData" :src="(fileData as string)" />
      <v-button
        v-if="!previewMode"
        type="overlay"
        :icon="SvgIcon"
        tooltip="Remove photo"
        class="overlay-btn top"
        @click="emit('remove')"
      />
      <v-button
        v-if="!showAlt && !previewMode"
        type="overlay"
        class="overlay-btn bottom"
        @click="showAlt = true"
        >+ALT</v-button
      >
      <div v-if="analyzing" class="grid">
        <p class="fade-in-offset">
          <span class="spinner"></span>Analyzing image...
        </p>
      </div>
    </div>
    <form class="information" @submit.prevent :class="{ hidden: previewMode }">
      <v-species-selector
        :file="props.modelValue.file"
        v-model="species"
        @updating="(b) => (analyzing = b)"
      />
      <v-location-selector
        v-model="location"
        :helper-text="
          locationExtracted
            ? 'Location data has been extracted from the image.'
            : undefined
        "
      />
      <map-selector
        v-model="location"
      ></map-selector>
      <v-input
        v-if="showAlt"
        v-model="description"
        label="Image description"
        helperAction="What is alt text?"
        @helperClick="showAltModal = true"
      />
      <modal v-if="showAltModal" @close="showAltModal = false">
        <h1>Photo descriptions</h1>
        <p>
          You can add a description, also called alt text, to your photos to
          make them accessible to more people, including those who are blind or
          visually impaired.
        </p>
        <p>
          Good descriptions are short and concise, but convey the content of
          your photos accurately enough for readers to understand the context.
        </p>
      </modal>
    </form>
  </section>
</template>

<script setup lang="ts">
import VInput from '@/components/VInput.vue'
import VLocationSelector from '@/components/VLocationSelector.vue'
import MapSelector from '@/components/MapSelector.vue'
import VSpeciesSelector from '@/components/VSpeciesSelector.vue'
import { computed, ref, type PropType } from 'vue'
import exifr from 'exifr'
import type { SightingData } from '@/views/CreatePost.vue'
import { reverseLocationSearch } from '@/utils'
import VButton from '../VButton.vue'
import SvgIcon from '@/assets/icon16/close.svg?component'
import Modal from '../Modal.vue'

const emit = defineEmits(['update:modelValue', 'remove'])

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

const showAlt = ref(false)
const showAltModal = ref(false)
const analyzing = ref(false)

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
const species = computed({
  get: () => {
    return props.modelValue.species
  },
  set: (value) => {
    updateValue({
      ...props.modelValue,
      species: value,
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
  width: 100%

.preview
  border-radius: allmende.$radius-card
  background: var(--layer-05)
  box-shadow: var(--shadow-card-subtle)
  min-height: allmende.$radius-card * 2
  line-height: 0
  overflow: hidden
  max-height: 512px
  align-self: start
  width: 100%
  position: relative
  .grid
    position: absolute
    inset: 0
    display: flex
    flex-direction: column
    justify-content: end
    align-items: end
    padding: allmende.$size-xsmall
    > p
      @include allmende.text-footnote
      text-transform: uppercase
      font-weight: 600
      display: flex
      align-items: center
      background: rgba(255, 255, 255, 0.75)
      backdrop-filter: blur(16px)
      gap: allmende.$size-xxxsmall
      padding: allmende.$size-xxxsmall
      padding-right: allmende.$size-xsmall
      border-radius: allmende.$size-large
      z-index: 2
    &::after
      content: ''
      position: absolute
      inset: 0
      -webkit-mask-repeat: no-repeat
      -webkit-mask-size: 400% 400%
      -webkit-mask-position: 0 0
      -webkit-mask-image: linear-gradient(270deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 1) 10%, rgba(255, 255, 255, 0.5) 60%, rgba(255, 255, 255, 1) 70%, rgba(255, 255, 255, 0) 100%)
      background-image: url('/scan-dot.svg')
      background-size: 30%
      background-position: center
      background-color: rgba(123, 97, 255, 0.25)
      opacity: 0.75
      animation: mask-movement 3s infinite cubic-bezier(0, 0.5, 1, 0.5)
  img
    display: block
    width: 100%
    height: 100%
    object-fit: cover

.information
  display: flex
  flex-direction: column
  gap: allmende.$size-xsmall
  padding: allmende.$size-small
  &.hidden
    display: none

.preview-mode
  width: 100px
  height: 100px
  .preview
    width: 100%
    height: 100%
    .grid
      display: none

@keyframes mask-movement
  0%
    -webkit-mask-position: 150% 0
  100%
    -webkit-mask-position: -100% 0

button.overlay-btn
  position: absolute
  left: allmende.$size-xxsmall
  min-height: allmende.$size-medium
  z-index: 2
  &.top
    top: allmende.$size-xxsmall
    width: allmende.$size-medium
  &.bottom
    padding: 0 allmende.$size-xxsmall
    bottom: allmende.$size-xxsmall
    top: auto
</style>
