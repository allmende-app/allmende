<template>
  <main>
    <v-title v-if="step == 0" title="Create post">
      <template v-slot:left>
        <v-button
          :icon="SvgClose"
          tooltip="Cancel"
          @click="$router.push('/')"
        />
      </template>
      <template v-slot:right>
        <v-button type="primary" @click="nextStep">Next</v-button>
      </template>
    </v-title>
    <v-title v-else title="Create post">
      <template v-slot:left>
        <v-button type="primary" :disabled="step > 1" @click="step = 0">Back</v-button>
      </template>
      <template v-slot:right>
        <v-button type="primary" :disabled="step > 1" @click="nextStep">Next</v-button>
      </template>
    </v-title>
    <div class="posts" :class="{ 'preview-mode': step > 0 }">
      <v-post-editor
        v-for="(info, i) in sightingInfo"
        :key="info.rid"
        :preview-mode="step > 0"
        v-model="sightingInfo[i]"
        class="post"
        @remove="removeSighting(i)"
      />
    </div>
    <div class="notice" v-if="step == 0 && sightingInfo.length < 1">
      <p>To create a post, upload photos</p>
    </div>
    <div class="notice" v-else-if="step == 2">
      <p><span class="spinner"></span> Uploading photos...</p>
    </div>
    <div class="notice" v-else-if="step == 3">
      <p>Post created.</p>
      <p class="fade-in-offset"><span class="spinner"></span> Redirecting to post...</p>
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
  </main>
</template>

<script setup lang="ts">
import { useFilesStore } from '@/stores/files'
import VTitle from '@/components/VTitle.vue'
import VPostEditor from '@/components/post/VPostEditor.vue'
import VButton from '@/components/VButton.vue'
import SvgClose from '@/assets/icon24/close.svg?component'
import { reactive, ref } from 'vue'
import { backend, getRandomId } from '../utils'
import type { LocationInfo, Post } from '@/interfaces/types'
import router from '@/router'

export interface SightingData {
  rid: string
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
    rid: getRandomId(),
    file,
    title: '',
    description: '',
    datetime: 0,
    location: null,
    species: undefined,
  }
})

const fileInput = ref(null as HTMLInputElement | null)

function removeSighting(i: number) {
  // remove item with index i from sightingInfo
  sightingInfo.splice(i, 1)
}

function handleFileEvent(event: Event) {
  const file = event.target as HTMLInputElement
  const files2 = file.files
  if (!files2) {
    return
  }
  sightingInfo.push(
    ...Array.from(files2).map((file) => ({
      rid: getRandomId(),
      file,
      title: '',
      description: '',
      datetime: 0,
      location: null,
      species: undefined,
    })),
  )
}

async function nextStep() {
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
        osmId: info.location?.osmId,
        species: info?.species,
      })),
    }),
  )

  step.value = 2
  const result = await backend.client({
    method: 'post',
    url: '/api/posts',
    data: bodyFormData,
    timeout: 80000, // 50000ms = 80s
  })
  step.value = 3

  if (result.status === 201) {
    const post = result.data.post as Post
    setTimeout(() => {
      router.push({ name: 'post-detail', params: { postID: post._id } })
    }, 250)
  } else {
    console.error(result)
    step.value = 1
  }
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
    flex-direction: row
    gap: allmende.$size-xsmall
    flex-wrap: wrap
    justify-content: center

.notice
  text-align: center
  padding: allmende.$size-medium
  p
    margin-block-end: allmende.$size-xxxsmall
    display: flex
    justify-content: center
    align-items: center
    gap: allmende.$size-xxxsmall

.file-input
  display: none

.upload-button
  padding-block: allmende.$size-medium
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
