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
      />
    </div>
    <div class="helper-text" v-if="helperText">
      {{ helperText }}
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/runtime-core'
import type { PropType } from '@vue/runtime-core'

export default defineComponent({
  name: 'VInput',
  props: {
    name: {
      type: String as PropType<string>,
      required: true,
    },
    helperText: {
      type: String as PropType<string>,
      default: '',
    },
    label: {
      type: String as PropType<string>,
      default: '',
    },
    error: {
      type: Boolean as PropType<boolean>,
      default: false,
    },
    modelValue: {
      type: String as PropType<string>,
    },
    type: {
      type: String as PropType<string>,
      default: 'text',
      validator: (value: PropType<string>) =>
        ['password', 'text'].includes(String(value)),
    },
  },
  setup(props, context) {
    const updateValue = (event: Event) => {
      context.emit('update:modelValue', event?.target?.value)
    }

    return { updateValue }
  },
})
</script>

<style lang="sass" scoped>
.input-container
  width: 100%
  .input-wrapper
    position: relative
    label
      position: absolute
      left: 12px
      margin-top: 4px
      color: var(--text-secondary)
      @include allmende.text-footnote

    input
      width: 100%

      background-color: var(--layer-10)
      border-radius: allmende.$radius-input
      border: none
      padding: 12px
      padding-top: 24px
      padding-bottom: 10px
      @include allmende.effect-focus


  .helper-text
    margin: 4px 12px
    font-size: 10px
    color: var(--text-secondary)
    @include allmende.text-footnote

  &.error
    // background-color: red
    .input-wrapper
      label
        color: var(--text-error)

      input
        background-color: var(--layer-error)

    .helper-text
      color: var(--text-error)
</style>
