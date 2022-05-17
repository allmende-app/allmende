<template>
  <div class="creator">
    <img :src="src" alt="" height="16" width="16">
    <p class="name">
      {{ name }}
    </p>
  </div>
</template>

<script setup lang="ts">
import type { PropType } from 'vue';
import { ref } from 'vue';

const props = defineProps({
  name: {
    type: String as PropType<string>,
    required: true
  },
  userId: {
    type: Number as PropType<number>,
    required: true
  }
})

const src = ref("/jonas.jpeg") // TODO: load from server

</script>

<style lang="sass" scoped>
.creator
  display: flex
  flex-direction: row
  align-items: center
  padding: 4px
  width: max-content
  gap: 10px
  img
    border-radius: 100%

</style>
