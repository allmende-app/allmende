<template>
  <div :class="'input-container ' + (error ? 'error' : '')">
    <div class="input-wrapper">
      <label :for="name">{{ label }}</label>
      <input type="text" class="input-field" :name="name" :id="name" :value="value">
    </div>
    <div class="helper-text">
      {{ helperText }}
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";
import type { PropType } from "@vue/runtime-core";

export default defineComponent({
  name: "VInput",
  props: {
    name: {
      type: String as PropType<string>,
      required: true,
    },
    value: { // TODO als v-model binden!!!
      type: String as PropType<string>,
      default: ""
    },
    helperText: {
      type: String as PropType<string>,
      default: ""
    },
    label: {
      type: String as PropType<string>,
      default: ""
    },
    error: {
      type: String as PropType<string>,
      default: ""
    }
  },
  setup(props) {
    console.log("Input loaded");
  }
})

</script>

<style lang="sass" scoped>
@import "../assets/sass/config.sass"

// .frame-wrapper
.input-container
  .input-wrapper
    label
      position: absolute
      left: 12px
      margin-top: 4px
      color: $font-secondary
      font-size: $font-size-footnote

    .input-field
      background-color: $layer-color-10 // TODO set correct color here!!!
      border-radius: $border-radius
      border: none
      font-family: $main-font
      font-size: $font-size-body
      padding: 12px
      padding-top: 24px
      padding-bottom: 10px

      &:focus, &:active, &:focus-visible
        outline: $border-color-focus solid $border-width


  .helper-text
    margin: 4px 12px
    font-size: 10px
    color: $font-secondary
    font-size: $font-size-footnote

  &.error
    // background-color: red
    .input-wrapper
      label
        color: $font-error

      input
        background-color: $layer-color-error

    .helper-text
      color: $font-error


</style>
