<template>
  <button :class="type" @click="sayHello" :disabled="disabled">
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
      default: "primary",
      // INFO: use arrow function here, otherwise there is an waring when instanciating VButton!
      validator: (value: PropType<string>) => ['primary', 'secondary'].includes(String(value))
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  setup(props, { emit }) {
    emit('click')

    const sayHello = () => {
      console.log("Hello");
      emit('click')
    }

    return { sayHello }
  }
})

</script>

<style lang="sass" scoped>
@import "../assets/sass/config.sass"

$button-border-radius: 32px

button
  background-color: #fff
  border: none
  border-radius: $button-border-radius
  padding: 16px 24px
  border: 2px solid transparent
  cursor: pointer
  font-family: $main-font
  font-weight: 600

  &.primary
    background-color: $primary
    color: $font-inverted
    &:hover
      background-color: $primary-hover
    &:disabled
      background-color: $primary-disabled
    &:active
      background-color: $primary-active
  &.secondary
    background-color: $secondary
    color: $font-primary
    &:hover
      background-color: $secondary-hover
    &:disabled
      background-color: $secondary-disabled
    &:active
      background-color: $secondary-active
  &:focus
      border-color: $border-color-focus



</style>
