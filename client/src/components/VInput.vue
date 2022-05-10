<template>
  <div :class="'input-container ' + (error ? 'error' : '')">
    <div class="input-wrapper">
      <label :for="name">{{ label }}</label>
      <input
        :type="type"
        class="input-field"
        :name="name"
        :id="name"
        :value="modelValue"
        @input="updateValue"
      >
    </div>
    <div class="helper-text" v-if="helperText">
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
    helperText: {
      type: String as PropType<string>,
      default: ""
    },
    label: {
      type: String as PropType<string>,
      default: ""
    },
    error: {
      type: Boolean as PropType<boolean>,
      default: false
    },
    modelValue: {
      type: String as PropType<string>
    },
    type: {
      type: String as PropType<string>,
      default: 'text',
      validator: (value: PropType<string>) => ['password', 'text'].includes(String(value))
    }
  },
  setup(props, context) {

const updateValue = (event: any) => {
      context.emit('update:modelValue', event.target.value);
    }

    return { updateValue }
  }
})

</script>

<style lang="sass" scoped>
@import "../assets/sass/config.sass"

.input-container
  width: 100%
  .input-wrapper
    position: relative

    label
      position: absolute
      left: 12px
      margin-top: 4px
      color: $font-secondary
      font-size: $font-size-footnote

    input
      width: 100%

      background-color: $layer-color-10
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
