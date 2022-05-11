<template>
  <button><slot /></button>
</template>

<script setup lang="ts">
defineProps<{
}>()
</script>

<style scoped lang="sass">
button
  @include allmende.text-action
  @include allmende.effect-focus
  user-select: none
  display: flex
  justify-content: center
  align-items: center
  gap: 4px
  border-radius: allmende.$radius-button
  height: allmende.$button-height
  padding: 0 allmende.$size-xsmall
  background: var(--action-secondary)
  &:hover
    background: var(--action-secondary-hover)
  &:active
    background: var(--action-secondary-active)
  &.icon
    padding: 0
    width: allmende.$button-height
  &.primary
    color: var(--text-inverted)
    background: var(--action-primary)
    &:hover
      background: var(--action-primary-hover)
    &:active
      background: var(--action-primary-active)
</style>
