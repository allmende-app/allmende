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
        v-for="(file, i) in store.getFiles"
        :key="i"
        :file="file"
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
  </div>
</template>

<script setup lang="ts">
import { useFilesStore } from '@/stores/files'
import VTitle from '@/components/VTitle.vue'
import VPostEditor from '@/components/post/VPostEditor.vue'
import VButton from '@/components/VButton.vue'
import SvgClose from '@/assets/icon24/close.svg?component'
import { ref } from 'vue'

const store = useFilesStore()

const fileInput = ref(null as HTMLInputElement | null)

function handleFileEvent(event: Event) {
  const file = event.target as HTMLInputElement
  const files2 = file.files
  if (!files2) {
    return
  }
  store.addFiles(Array.from(files2))
}
</script>

<style lang="sass" scoped>
.posts
  width: 100%
  display: flex
  flex-direction: column
  align-items: center
  gap: allmende.$size-medium

.file-input
  display: none
</style>
