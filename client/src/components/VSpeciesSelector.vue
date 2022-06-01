<template>
  <div class="species-selector">
    <label>Species</label>
    <div class="options">
      <div>
        <div v-for="option in options" class="option" :key="option.value">
          <input
            type="radio"
            name="species"
            :value="option.value"
            :id="`${id}-${option.value}`"
            v-model="species"
            onfocus="this.nextSibling.scrollIntoView()"
          />
          <label :for="`${id}-${option.value}`">
            <span v-if="option.type == 'manual'" class="type manual"
              >Manual</span
            >
            <span v-if="option.type == 'ml'" class="type ml"
              >ML suggestion</span
            >
            <span v-if="option.name" class="name">{{ option.name }}</span>
            <span v-if="option.binomial" class="binomial">{{
              option.binomial
            }}</span>
          </label>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getRandomId } from '@/utils'
import { ref } from 'vue'

const id = getRandomId()

const options = [
  {
    value: '__selection__',
    type: 'manual',
    name: 'Select Species',
  },
  {
    value: 'abfv',
    type: 'ml',
    name: 'Common snipe',
    binomial: 'Gallinago gallinago',
  },
  {
    value: 'avfv',
    type: 'ml',
    name: 'Common snipe',
    binomial: 'Gallinago gallinago',
  },
  {
    value: 'unknown',
    type: 'unknown',
    name: 'Unknown',
  },
]

const species = ref(undefined as string | undefined)
</script>

<style lang="sass" scoped>
.species-selector > label
  @include allmende.text-footnote
  display: block
  color: var(--text-secondary)
  padding-inline: allmende.$size-xxsmall
  padding-block-end: allmende.$size-xxxxsmall

.options
  box-sizing: border-box
  margin-bottom: allmende.$size-xxsmall
  overflow-x: auto
  margin-inline: - allmende.$size-small
  scrollbar-width: none
  -ms-overflow-style: none
  &::-webkit-scrollbar
    display: none

.options > div
  display: inline-flex
  gap: allmende.$size-xxxsmall
  padding-inline: allmende.$size-small

.option > input
  display: block
  appearance: none
  width: 0
  height: 0

.option > label
  box-sizing: border-box
  display: flex
  justify-content: center
  height: allmende.$size-huge
  padding-inline: allmende.$size-xsmall
  flex-direction: column
  border-radius: allmende.$size-xxxsmall
  background: var(--action-secondary)
  &:hover
    background: var(--action-secondary-hover)
  &:active
    background: var(--action-secondary-active)

.option
  span
    white-space: nowrap
  span.type
    @include allmende.text-label
    &.manual
      color: #FF6161
    &.ml
      color: #7B61FF
  span.name
    @include allmende.text-headline
  span.binomial
    @include allmende.text-footnote

.option
  input:checked + label
    background: var(--action-secondary-active)
  input:focus-visible + label
    box-shadow: inset 0 0 0 2px var(--border-focus)
</style>
