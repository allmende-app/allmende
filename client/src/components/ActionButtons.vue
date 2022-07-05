<template>
  <div class="actions">
    <button @click="$emit('likesClicked')">
      <SvgLike :class="liked ? 'liked' : ''" />{{ likes }}
    </button>
    <button @click="$emit('commentsClicked')">
      <SvgComment />{{ comments }}
    </button>
  </div>
</template>

<script lang="ts" setup>
import SvgLike from '@/assets/icon24/like.svg?component'
import SvgComment from '@/assets/icon24/comment.svg?component'
import { PropType } from '@vue/runtime-core'

const props = defineProps({
  likes: {
    type: Number as PropType<number>,
    required: true,
  },
  liked: {
    type: Boolean as PropType<boolean>,
    required: true,
  },
  comments: {
    type: Number as PropType<number>,
    required: true,
  },
})
</script>

<style lang="sass">
.liked
  color: red


.actions
  display: grid
  grid-template-columns: 1fr 1fr
  button
    color: var(--icon-default)
    display: flex
    align-items: center
    justify-content: center
    gap: allmende.$size-xxxxsmall
    padding: allmende.$size-xxxsmall
    @include allmende.text-action
    @include allmende.effect-focus
    &:hover
      background: var(--action-secondary-hover)
    &:active
      background: var(--action-secondary-active)
    &:first-child
      border-bottom-left-radius: allmende.$size-small
    &:last-child
      border-bottom-right-radius: allmende.$size-small
</style>
