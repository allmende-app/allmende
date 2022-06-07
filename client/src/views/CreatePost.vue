<template>
  <div>
    <v-title title="Create post">
      <template v-slot:left>
        <v-button :icon="SvgClose" tooltip="Cancel" />
      </template>
      <template v-slot:right>
        <v-button type="primary">Next</v-button>
      </template>
    </v-title>
    <div class="posts">
      <v-post-editor
        v-for="(info, i) in sightingInfo"
        :key="i"
        v-model="sightingInfo[i]"
        class="post"
      />
    </div>
    <div>
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
    <div class="text-editor">
      <textarea placeholder="What did you see..." v-model="description"></textarea>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useFilesStore } from '@/stores/files'
import VTitle from '@/components/VTitle.vue'
import VPostEditor from '@/components/post/VPostEditor.vue'
import VButton from '@/components/VButton.vue'
import SvgClose from '@/assets/icon24/close.svg?component'
import { reactive, ref, watch } from 'vue'

export interface SightingData {
  file: File
  title: string
  description: string
  datetime: number
  lat: number
  lng: number
}

const store = useFilesStore()
const sightingInfo = reactive([] as SightingData[])
const description = ref('')

store.getAndDeleteFiles().forEach((file, i) => {
  sightingInfo[i] = {
    file,
    title: '',
    description: '',
    datetime: 0,
    lat: 0,
    lng: 0,
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
      lat: 0,
      lng: 0,
    })),
  )
}
</script>

<style lang="sass" scoped>
.posts
  width: 100%
  display: grid
  @include allmende.post-grid
  align-items: center
  gap: allmende.$size-medium

.file-input
  display: none

.text-editor
  textarea
    @include allmende.effect-focus
    background: var(--layer-20)
    border-radius: allmende.$radius-card
    padding: allmende.$size-medium
    resize: none
    &::placeholder
      color: var(--text-secondary)
</style>
