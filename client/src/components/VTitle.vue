<template>
  <div class="title">
    <div class="left">
      <slot name="left"></slot>
    </div>
    <span class="center"> {{ title }}<LogoSvg /> </span>
    <div class="right">
      <slot name="right"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'
import LogoSvg from '@/assets/logo.svg?component'

defineProps({
  title: {
    type: String as PropType<string>,
    default: 'allmende',
  },
})
</script>

<style lang="sass" scoped>

.title
  height: allmende.$size-huge
  display: grid
  grid-template-columns: 1fr auto 1fr

  .left, .right
    display: flex
  .left
    justify-content: flex-start
  .right
    justify-content: flex-end

  .left, .center, .right
    padding-block: allmende.$size-xsmall

  .center
    @include allmende.text-navbar
    align-self: center
    position: relative
    z-index: -1
    > svg
      position: absolute
      color: var(--layer-05)
      left: -130px
      top: -370px
      width: 557px
      height: 557px
</style>
