<template>
  <div class="creator">
    <profil-picture-vue source="TODO"></profil-picture-vue>
    <p class="name">
      {{ name }}
    </p>
  </div>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'
import { ref } from 'vue'
import ProfilPictureVue from './ProfilPicture.vue';

const props = defineProps({
  name: {
    type: String as PropType<string>,
    required: true,
  },
  userId: {
    type: Number as PropType<number>,
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

  .name
    @include allmende.text-subhead
</style>
