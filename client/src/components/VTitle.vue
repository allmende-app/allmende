<template>
  <div class="title">
    <div class="left">
      <slot name="left"></slot>
    </div>
    <span class="center">
      {{ title }}
    </span>
    <div class="right">
      <slot name="right"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import BackIcon from '@/assets/icon24/back.svg'
import CloseIcon from '@/assets/icon24/close.svg'
import { PropType } from '@vue/runtime-core'

const props = defineProps({
  title: {
    type: String as PropType<string>,
    required: true
  },
})

</script>

<style lang="sass" scoped>

.title
  width: 100%
  height: allmende.$size-huge
  display: flex
  justify-content: space-between
  align-items: center
  // padding: allmende.$size-xsmall

  .left, .center, .right
    padding: allmende.$size-xsmall

  .center
    @include allmende.text-title-1
    align-self: center

</style>
