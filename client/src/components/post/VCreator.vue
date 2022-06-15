<template>
  <div class="creator" @click="$emit('click')">
    <profil-picture-vue :source="author.avatarUrl"></profil-picture-vue>
    <p class="name">
      {{ name }}
    </p>
  </div>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'
import { ref } from 'vue'
import { backend } from '../../utils'
import ProfilPictureVue from './ProfilPicture.vue'

const props = defineProps({
  name: {
    type: String as PropType<string>,
    required: true,
  },
  userId: {
    type: Number as PropType<number>,
    required: true,
  },
  author: {
    type: Object as PropType<any>,
    required: true,
  },
})
</script>

<style lang="sass" scoped>
.creator
  display: flex
  flex-direction: row
  align-items: center
  padding: 4px
  width: max-content
  gap: 10px
  cursor: pointer

  .name
    @include allmende.text-subhead
</style>
