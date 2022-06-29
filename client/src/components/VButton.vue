<template>
  <button
    :class="[type, icon ? 'icon' : '']"
    @click="onClick"
    :disabled="disabled"
    :aria-label="tooltip"
    :title="tooltip"
  >
    <component v-if="icon" :is="icon"></component>
    <slot v-else></slot>
  </button>
</template>

<script setup lang="ts">
import type { FunctionalComponent, PropType, SVGAttributes } from 'vue'

const emit = defineEmits(['click'])

const props = defineProps({
  type: {
    type: String as PropType<string>,
    default: 'secondary',
    validator: (value: PropType<string>) =>
      ['primary', 'secondary'].includes(String(value)),
  },
  icon: {
    type: Object as PropType<null | FunctionalComponent<SVGAttributes>>,
    default: null,
  },
  tooltip: {
    type: String,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
})

if (props.icon && !props.tooltip) {
  throw new Error('VButton: Buttons with icons must have a tooltip')
}

const onClick = (event: Event) => {
  emit('click', event)
}
</script>

<style lang="sass" scoped>
button
  @include allmende.text-action
  @include allmende.effect-focus
  user-select: none
  display: flex
  justify-content: center
  align-items: center
  gap: 4px
  cursor: pointer
  border-radius: allmende.$radius-button
  min-height: allmende.$button-height
  padding: 0 allmende.$size-small
  &.icon
    padding: 0
    width: allmende.$button-height
  &.secondary
    color: var(--text-primary)
    background: var(--action-secondary)
    &.icon
      background: unset
    &:hover
      background: var(--action-secondary-hover)
    &:active
      background: var(--action-secondary-active)
    &:disabled
      color: var(--text-disabled)
      background: var(--action-secondary-disabled)
  &.primary
    color: var(--text-inverted)
    background: var(--action-primary)
    &:hover
      background: var(--action-primary-hover)
    &:active
      background: var(--action-primary-active)
    &:disabled
      background: var(--action-primary-disabled)
</style>
