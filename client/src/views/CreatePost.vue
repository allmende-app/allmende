<template>
  <v-title v-if="step == 0" title="Create post">
    <template v-slot:left>
      <v-button :icon="SvgClose" tooltip="Cancel" @click="$router.push('/')" />
    </template>
    <template v-slot:right>
      <v-button type="primary" @click="nextStep">Next</v-button>
    </template>
  </v-title>
  <v-title v-else title="Create post">
    <template v-slot:left>
      <v-button type="primary" @click="step = 0">Back</v-button>
    </template>
    <template v-slot:right>
      <v-button type="primary" @click="nextStep">Next</v-button>
    </template>
  </v-title>
  <div class="posts" :class="{ 'preview-mode': step == 1 }">
    <v-post-editor
      v-for="(info, i) in sightingInfo"
      :key="i"
      :preview-mode="step == 1"
      v-model="sightingInfo[i]"
      class="post"
    />
  </div>
  <div class="notice" v-if="step == 0 && sightingInfo.length < 1">
    <p>To create a post, upload photos</p>
  </div>
  <div class="upload-button" v-if="step == 0">
    <input
      class="file-input"
      type="file"
      id="file-button"
      multiple
      @change="handleFileEvent"
      accept="image/png, image/gif, image/jpeg"
      ref="fileInput"
    />
    <v-button @click="fileInput?.click()" type="primary"
      >Add more photos</v-button
    >
  </div>
  <div v-if="step == 1">
    <div class="text-editor">
      <textarea
        placeholder="What did you see..."
        v-model="description"
      ></textarea>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useFilesStore } from '@/stores/files'
import VTitle from '@/components/VTitle.vue'
import VPostEditor from '@/components/post/VPostEditor.vue'
import VButton from '@/components/VButton.vue'
import SvgClose from '@/assets/icon24/close.svg?component'
import { onMounted, reactive, ref } from 'vue'
import { backend } from '../utils'
import type { LocationInfo } from '@/interfaces/types'

export interface SightingData {
  file: File
  title: string
  description: string
  datetime: number
  location: LocationInfo | null
  species: string | undefined | null
}

const store = useFilesStore()
const sightingInfo = reactive([] as SightingData[])
const step = ref(0)
const description = ref('')

store.getAndDeleteFiles().forEach((file, i) => {
  sightingInfo[i] = {
    file,
    title: '',
    description: '',
    datetime: 0,
    location: null,
    species: undefined,
  }
})

const fileInput = ref(null as HTMLInputElement | null)

function handleFileEvent(event: Event) {
  const file = event.target as HTMLInputElement
  const files2 = file.files
  if (!files2) {
    return
  }
  sightingInfo.push(
    ...Array.from(files2).map((file) => ({
      file,
      title: '',
      description: '',
      datetime: 0,
      location: null,
      species: undefined,
    })),
  )
}

function nextStep() {
  // only if there are files
  if (sightingInfo.length === 0) {
    return
  }
  if (step.value == 0) {
    step.value++
    return
  }

  const bodyFormData = new FormData()

  sightingInfo.forEach((info) => {
    bodyFormData.append('file', info.file)
  })

  bodyFormData.append(
    'post',
    JSON.stringify({
      text: description.value,
      sightings: sightingInfo.map((info) => ({
        description: info.description.length < 1 ? undefined : info.description,
        lat: info.location?.lat,
        lng: info.location?.lng,
        species: info?.species,
      })),
    }),
  )

  backend.client({
    method: 'post',
    url: '/api/posts',
    data: bodyFormData,
  })
}
</script>

<style lang="sass" scoped>
.posts
  width: 100%
  display: grid
  @include allmende.post-grid
  gap: allmende.$size-medium
  &.preview-mode
    display: flex
    gap: allmende.$size-xsmall
    flex-wrap: wrap
    justify-content: center

.notice
  text-align: center
  padding: allmende.$size-medium

.file-input
  display: none

.upload-button
  padding-top: allmende.$size-medium
  display: flex
  justify-content: center

.text-editor
  width: 100%
  margin-block-start: allmende.$size-medium
  textarea
    height: 256px
    width: 100%
    box-sizing: border-box
    @include allmende.effect-focus
    background: var(--layer-20)
    border-radius: allmende.$radius-card
    padding: allmende.$size-medium
    resize: none
    &::placeholder
      color: var(--text-secondary)
</style>
