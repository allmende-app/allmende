<template>
  <div class="species-selector">
    <label>Species</label>
    <div class="options">
      <div v-if="modelValue === undefined" class="genus">
        <VButton
          v-for="g in genus"
          :key="g.value"
          @click="selectGenus(g.value)"
          >{{ g.name }}</VButton
        >
      </div>
      <div v-else>
        <div v-if="loading" v-for="i in 5" :key="i" class="loading-wrapper">
          <div class="spinner"></div>
        </div>
        <div v-for="option in options" class="option" :key="option.id">
          <input
            type="radio"
            name="species"
            :value="option.id"
            :id="`${id}-${option.id}`"
            v-model="species"
          />
          <label :for="`${id}-${option.id}`" :class="option.type">
            <div class="details">
              <span v-if="option.type == 'manual'" class="type">Manual</span>
              <span v-if="option.type == 'ml'" class="type">ML suggestion</span>
              <span v-if="option.name" class="name">{{ option.name }}</span>
              <span v-if="option.binomial" class="binomial">{{
                option.binomial
              }}</span>
            </div>
            <div class="info">
              <div v-if="option.imageUrl" class="img">
                <img :src="option.imageUrl" :alt="option.name" />
              </div>
              <p>{{ Math.round(option.score) }}%</p>
            </div>
          </label>
        </div>
        <div class="option">
          <input
            type="radio"
            name="species"
            value="__xxx__"
            :id="`${id}-custom`"
            v-model="species"
          />
          <label :for="`${id}-custom`" class="manual">
            <div class="details">
              <span class="type">Manual</span>
              <span class="name">Select Species</span>
            </div>
          </label>
        </div>
        <button
          class="option icon"
          @click="emit('update:modelValue', undefined)"
        >
          <SvgClose />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { backend, getRandomId } from '@/utils'
import { ref, type PropType } from 'vue'
import VButton from './VButton.vue'
import SvgClose from '@/assets/icon24/close.svg?component'
import type { PredictionResult } from '@/interfaces/types'

interface Suggestion {
  id: number
  score: number
  type: string
  name: string
  binomial: string
  imageUrl?: string
}

const id = getRandomId()

const emit = defineEmits(['update:modelValue', 'updating'])

const props = defineProps({
  modelValue: {
    type: String as PropType<string | null | undefined>,
  },
  file: {
    type: Object as PropType<File>,
    required: true,
  },
})

const loading = ref(false)

const options = ref([] as Suggestion[])

const species = ref(undefined as string | undefined)

async function selectGenus(genus: string) {
  const bodyFormData = new FormData()
  bodyFormData.append('file', props.file)

  bodyFormData.append('types', genus)

  options.value = []

  emit('updating', true)
  loading.value = true
  emit('update:modelValue', null)
  const result = await backend.client({
    method: 'post',
    url: '/api/predict',
    data: bodyFormData,
    timeout: 25000, //25 seconds
  })
  emit('updating', false)
  loading.value = false

  options.value = result.data.predictions[0].result.map(
    (o: PredictionResult) => ({
      id: o.id,
      score: o.score,
      type: 'ml',
      name: o.species.vernacularName || o.species.canonicalName,
      imageUrl: o.species.imageUrl,
      binomial: o.species.vernacularName
        ? o.species.canonicalName
        : o.species.scientificName,
    }),
  )
}

const genus = [
  {
    value: 'plantae',
    name: 'Plant',
  },
  {
    value: 'mammal',
    name: 'Mammal',
  },
  {
    value: 'bird',
    name: 'Bird',
  },
  {
    value: 'insect',
    name: 'Insect',
  },
  {
    value: 'mollusca',
    name: 'Mollusca',
  },
  {
    value: 'fungi',
    name: 'Fungi',
  },
  {
    value: 'reptile',
    name: 'Reptile',
  },
  {
    value: 'other',
    name: 'Other',
  },
]
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
  &:focus
    outline: none

.option > label, button.option
  box-sizing: border-box
  display: flex
  align-items: center
  height: allmende.$size-huge
  padding-inline: allmende.$size-xsmall
  gap: allmende.$size-xsmall
  border-radius: allmende.$size-xxxsmall
  background: var(--action-secondary)
  &.icon
    color: var(--text-secondary)
    padding-inline: allmende.$size-xxsmall
  &:hover
    background: var(--action-secondary-hover)
  &:active
    background: var(--action-secondary-active)

.option > label
  > .info
    display: flex
    align-items: center
    flex-direction: column
    > p
      background: var(--layer-20)
      border-radius: allmende.$size-large
      color: #7B61FF
      padding-block: 2px
      padding-inline: allmende.$size-xxxsmall
      @include allmende.text-label
      margin-top: - allmende.$size-xxxxsmall
    > .img
      background: rgba(0, 0, 0, 0.1)
      width: allmende.$size-large
      height: allmende.$size-large
      border-radius: allmende.$size-large
      overflow: hidden
      > img
        width: 100%
        height: 100%
        object-fit: cover
  > .details
    display: flex
    flex-direction: column

.option
  span
    white-space: nowrap
  span.type
    @include allmende.text-label
  label.manual span.type
    color: #FF6161
  label.ml span.type
    color: #7B61FF
  span.name
    @include allmende.text-headline
  span.binomial
    @include allmende.text-footnote
    line-height: 0.95

.option
  input:checked + label
    background: var(--action-primary)
    color: var(--text-inverted)
    span.type
      opacity: 0.75
      color: var(--text-inverted)
  input:focus-visible + label
    box-shadow: inset 0 0 0 2px var(--border-focus), inset 0 0 0 4px var(--action-secondary)

.genus
  display: flex
  flex-wrap: wrap
  gap: 8px
  justify-content: stretch
  > button
    @include allmende.text-footnote
    min-height: 40px
    padding: 0 8px
    flex-grow: 1
    border-radius: allmende.$size-xxxsmall

.loading-wrapper
  display: flex
  align-items: center
  padding-inline: allmende.$size-xxlarge
  border-radius: allmende.$size-xxxsmall
  background: var(--action-secondary)
</style>
