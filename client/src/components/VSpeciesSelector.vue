<template>
  <div class="species-selector">
    <div class="header">
      <label>Species</label>
      <button @click="showModal = true">Learn more</button>
    </div>
    <div class="options">
      <div v-if="modelValue === undefined">
        <VButton
          v-for="g in genus"
          :key="g.value"
          class="genus-option"
          @click="selectGenus(g.value)"
        >
          <component v-if="g.icon" :is="g.icon" />
          {{ g.name }}
        </VButton>
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
    <Modal v-if="showModal" @close="showModal = false">
      <h1>Tagging animals and plants</h1>
      <p>
        If you have taken a photo of a certain species, you can tag in your
        post.
      </p>
      <p>
        After selecting one of the 7 supercategories - Plant, Mammal, Bird,
        Insect, Mollusca, Fungi, or Reptile - Allmende can help you identify
        what kind of species it is. Alternatively, you can enter the species
        manually.
      </p>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { backend, getRandomId } from '@/utils'
import { ref, type PropType } from 'vue'
import VButton from './VButton.vue'
import SvgClose from '@/assets/icon24/close.svg?component'
import type { PredictionResult } from '@/interfaces/types'
import { computed } from '@vue/reactivity'

import SvgPlant from '@/assets/species/plant.svg?component'
import SvgBird from '@/assets/species/bird.svg?component'
import SvgFungi from '@/assets/species/fungi.svg?component'
import SvgInsect from '@/assets/species/insect.svg?component'
import SvgMollusca from '@/assets/species/mollusca.svg?component'
import SvgReptile from '@/assets/species/reptile.svg?component'
import SvgSquirrel from '@/assets/species/squirrel.svg?component'
import Modal from './Modal.vue'

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

const showModal = ref(false)
const loading = ref(false)

const options = ref([] as Suggestion[])

const species = computed({
  get: () => {
    return props.modelValue
  },
  set: (value: string | undefined | null) => {
    emit('update:modelValue', value)
  },
})

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

  console.log(result)

  options.value = result.data.predictions[0].result
    .filter((o: PredictionResult | Record<string, never>) => o.id)
    .map((o: PredictionResult) => ({
      id: o.species._id,
      score: o.score,
      type: 'ml',
      name: o.species.vernacularName || o.species.canonicalName,
      imageUrl: o.species.imageUrl,
      binomial: o.species.vernacularName
        ? o.species.canonicalName
        : o.species.scientificName,
    }))
}

const genus = [
  {
    value: 'plantae',
    name: 'Plant',
    icon: SvgPlant,
  },
  {
    value: 'mammal',
    name: 'Mammal',
    icon: SvgSquirrel,
  },
  {
    value: 'bird',
    name: 'Bird',
    icon: SvgBird,
  },
  {
    value: 'insect',
    name: 'Insect',
    icon: SvgInsect,
  },
  {
    value: 'mollusca',
    name: 'Mollusca',
    icon: SvgMollusca,
  },
  {
    value: 'fungi',
    name: 'Fungi',
    icon: SvgFungi,
  },
  {
    value: 'reptile',
    name: 'Reptile',
    icon: SvgReptile,
  },
  {
    value: 'other',
    name: 'Other',
    icon: undefined,
  },
]
</script>

<style lang="sass" scoped>
.species-selector > .header
  @include allmende.text-footnote
  display: flex
  color: var(--text-secondary)
  padding-inline: allmende.$size-xxsmall
  padding-block-end: allmende.$size-xxxxsmall
  label
    flex: 1
  button
    text-decoration: underline
    cursor: pointer

.options
  box-sizing: border-box
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

button.genus-option
  color: var(--text-primary)
  display: flex
  align-items: center
  flex-direction: column
  height: allmende.$size-huge
  border-radius: allmende.$size-xxxsmall
  > svg
    color: var(--text-secondary)
  &:focus-visible
    outline: none
    box-shadow: inset 0 0 0 2px var(--border-focus), inset 0 0 0 4px var(--action-secondary)

.loading-wrapper
  display: flex
  align-items: center
  padding-inline: allmende.$size-xxlarge
  border-radius: allmende.$size-xxxsmall
  background: var(--action-secondary)
</style>
