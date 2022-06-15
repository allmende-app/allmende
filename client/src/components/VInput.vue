<template>
  <div :class="'textfield ' + (error ? 'error' : '')">
    <div class="textfield-wrapper">
      <input
        :type="type"
        :autocomplete="autocomplete"
        :class="{ filled: modelValue && modelValue.length > 0 }"
        :id="inputId"
        :value="modelValue"
        @input="updateValue"
        @focus="(e) => emit('focus', e)"
        @blur="(e) => emit('blur', e)"
        :aria-invalid="error ? 'true' : undefined"
        :aria-describedby="helperText || error ? helperId : undefined"
      />
      <label :for="inputId">{{ label }}</label>
    </div>
    <div class="helper-text" v-if="error || helperText">
      {{ error || helperText }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { getRandomId } from '@/utils'
import type { PropType } from 'vue'

const inputId = getRandomId()
const helperId = getRandomId()

const emit = defineEmits(['update:modelValue', 'focus', 'blur'])

defineProps({
  label: {
    type: String as PropType<string>,
    default: '',
  },
  helperText: {
    type: String as PropType<string | undefined>,
  },
  error: {
    type: String as PropType<string | undefined>,
  },
  modelValue: {
    type: String as PropType<string>,
    required: true,
  },
  type: {
    type: String as PropType<string>,
    default: 'text',
    validator: (value: PropType<string>) =>
      ['password', 'text'].includes(String(value)),
  },
  autocomplete: {
    type: String as PropType<string | undefined>,
  },
})

const updateValue = (event: Event) => {
  emit('update:modelValue', (event?.target as HTMLInputElement).value)
}
</script>

<style lang="sass" scoped>
.textfield
  color: var(--text-primary)
  > .textfield-wrapper
    position: relative
    height: allmende.$input-height
    input
      @include allmende.effect-focus
      @include allmende.text-body
      box-sizing: border-box
      border-radius: allmende.$radius-input
      background: var(--layer-10)
      width: 100%
      height: 100%
      margin: 0
      padding: (allmende.$size-xxsmall + 7px) allmende.$size-xxsmall (allmende.$size-xxsmall - 7px) allmende.$size-xxsmall
    label
      @include allmende.text-footnote
      color: var(--text-secondary)
      position: absolute
      left: allmende.$size-xxsmall
      right: initial
      top: 50%
      transform: translateY(-55%) scale(1.166)
      transform-origin: left top
      transition: transform 150ms cubic-bezier(0.4, 0, 0.2, 1),color 150ms
      pointer-events: none
    input:focus + label, input.filled + label
      transform: translateY(-106%) scale(1.0)
  > .helper-text
    @include allmende.text-footnote
    padding: 0 allmende.$size-xxsmall
    padding-top: allmende.$size-xxxxsmall

  &.error
    > .textfield-wrapper input
      background-color: var(--layer-error)
    > .helper-text, > .textfield-wrapper label
      color: var(--text-error)
</style>
