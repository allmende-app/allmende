<template>
  <div class="title">
    <div class="logo"><LogoSvg /></div>
    <div class="left">
      <slot name="left"></slot>
    </div>
    <span class="center"> {{ title }}</span>
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
    z-index: -1

  .logo
    position: absolute
    overflow: hidden
    left: 0
    right: 0
    top: 0
    display: flex
    align-items: center
    justify-content: center
    z-index: -1
    > svg
      flex-shrink: 0
      margin-top: -370px
      color: var(--layer-05)
      margin-left: 90px
      width: 557px
      height: 557px
      @include allmende.screen-laptop
        margin-top: -370px
        margin-left: 230px
</style>
