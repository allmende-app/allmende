<template>
  <section>
    <div class="preview">
      <img v-if="fileData" :src="(fileData as string)" />
    </div>
    <form class="information">
      <v-species-selector />
      <v-input
        v-model="location"
        :helper-text="
          locationExtracted ? 'Location data has been taken from the photo' : ''
        "
        label="Location"
      />
      <v-input v-model="description" label="Description" />
    </form>
  </section>
</template>

<script setup lang="ts">
import VInput from '@/components/VInput.vue'
import VSpeciesSelector from '@/components/VSpeciesSelector.vue'
import { ref } from 'vue'
import exifr from 'exifr'

const fileData = ref(null as string | ArrayBuffer | null)
const locationExtracted = ref(false)

//form data
const location = ref('')
const description = ref('')

const props = defineProps({
  file: {
    type: File,
    required: true,
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
reader.readAsDataURL(props.file)

exifr.gps(props.file).then((result) => {
  if (result) {
    location.value = `${result.latitude}, ${result.longitude}`
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
  width: 400px

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
