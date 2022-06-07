<template>
  <img :src="src" alt="" height="16" width="16" />
</template>

<script setup lang="ts">
import type { PropType } from 'vue'
import { ref } from 'vue'

const props = defineProps({
  source: {
    type: String as PropType<string>,
    required: false, // TODO change this to true later
  }
})
const src = ref('/jonas.jpeg') // TODO: load from server
</script>

<style lang="sass" scoped>
img
  border-radius: 100%

</style>
