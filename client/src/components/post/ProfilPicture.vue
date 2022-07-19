<template>
  <img
    :src="`${BACKEND_URL}api/image/${props.source}`"
    alt=""
    height="16"
    width="16"
  />
</template>

<script setup lang="ts">
import type { PropType } from 'vue'
import { BACKEND_URL } from '@/utils'

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
