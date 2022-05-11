<template>
  <button :class="type" @click="onClick" :disabled="disabled">
    <slot></slot>
  </button>
</template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";
import type { PropType } from "@vue/runtime-core";

export default defineComponent({
  emits: ["click"],
  props: {
    type: {
      type: String as PropType<string>,
      default: "secondary",
      // INFO: use arrow function here, otherwise there is an waring when instanciating VButton!
      validator: (value: PropType<string>) => ['primary', 'secondary'].includes(String(value))
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  setup(props, { emit }) {
    const onClick = (event: Event) => {
      emit('click', event)
    }

    return { onClick }
  }
})

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
  border-radius: allmende.$radius-button
  height: allmende.$button-height
  padding: 0 allmende.$size-small
  &.icon
    padding: 0
    width: allmende.$button-height
  &.secondary
    background: var(--action-secondary)
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
