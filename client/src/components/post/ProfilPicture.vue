<template>
  <img :src="`${baseURL}image/${source}`" alt="" height="16" width="16" />
</template>

<script setup lang="ts">
import type { PropType } from 'vue'
import { ref } from 'vue'
import { backend } from '../../utils'

const baseURL = backend.baseURL

const props = defineProps({
  source: {
    type: String as PropType<string>,
    required: false, // TODO change this to true later
  },
})
</script>

<style lang="sass" scoped>
img
  border-radius: 100%
</style>
