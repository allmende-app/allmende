<template>
  <div class="species-selector">
    <Modal title="Manual selection" :show-close="false" v-if="modalOpen">
      <v-input
        label="Search..."
        v-model="modalTextInput"
        @input="
          () => {
            modalLoading = true
            debouncedSearch()
            modalSelected = undefined
          }
        "
      />
      <div class="selector-options">
        <p class="explainer" v-if="modalTextInput.length < 1">
          Manually select a species by typing in a search term.
        </p>
        <div v-else-if="modalLoading" class="selector-loading">
          <div class="spinner"></div>
        </div>
        <p class="explainer" v-else-if="modalResults.length < 1">No results.</p>
        <div
          v-else
          v-for="result in modalResults"
          :key="result._id"
          class="option"
        >
          <input
            type="radio"
            :value="result._id"
            v-model="modalSelected"
            :id="`${idModal}-${result._id}`"
          />
          <label :for="`${idModal}-${result._id}`">
            <div class="info">
              <div class="img">
                <img
                  v-if="result.imageUrl"
                  :src="result.imageUrl"
                  :alt="result.name"
                />
              </div>
            </div>
            <div class="details">
              <span v-if="result.name" class="name">{{ result.name }}</span>
              <span v-if="result.binomial" class="binomial">{{
                result.binomial
              }}</span>
            </div>
          </label>
        </div>
      </div>
      <div class="selector-actions">
        <v-button @click="modalOpen = false">Cancel</v-button>
        <v-button @click="modalSelect" type="primary" :disabled="!modalSelected"
          >Select</v-button
        >
      </div>
    </Modal>
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
              <p v-if="option.score">{{ Math.round(option.score) }}%</p>
            </div>
          </label>
        </div>
        <div class="option">
          <input
            type="radio"
            name="species"
            :value="manualOption ? manualOption.id : '__undefined__'"
            :id="`${id}-custom`"
            @click.prevent="openModal"
            v-model="species"
          />
          <label :for="`${id}-custom`" class="manual">
            <div class="details">
              <span class="type">Manual</span>
              <span class="name">{{
                manualOption ? manualOption.name : 'Select Species'
              }}</span>
              <span v-if="manualOption" class="binomial">{{
                manualOption.binomial
              }}</span>
            </div>
            <div class="info">
              <div v-if="manualOption?.imageUrl" class="img">
                <img :src="manualOption.imageUrl" :alt="manualOption.name" />
              </div>
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
import { backend, getRandomId, speciesSearch } from '@/utils'
import { nextTick, ref, type PropType } from 'vue'
import VButton from './VButton.vue'
import SvgClose from '@/assets/icon24/close.svg?component'
import type { PredictionResult, SpeciesSearchResult } from '@/interfaces/types'
import { computed } from '@vue/reactivity'
import VInput from '@/components/VInput.vue'

import SvgPlant from '@/assets/species/plant.svg?component'
import SvgBird from '@/assets/species/bird.svg?component'
import SvgFungi from '@/assets/species/fungi.svg?component'
import SvgInsect from '@/assets/species/insect.svg?component'
import SvgMollusca from '@/assets/species/mollusca.svg?component'
import SvgReptile from '@/assets/species/reptile.svg?component'
import SvgSquirrel from '@/assets/species/squirrel.svg?component'
import Modal from './Modal.vue'
import debounce from 'debounce'

interface Suggestion {
  id: string
  score?: number
  type: string
  name: string
  binomial?: string
  imageUrl?: string
}

const id = getRandomId()
const idModal = getRandomId()

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
const manualOption = ref(undefined as Suggestion | undefined)

const species = computed({
  get: () => {
    return props.modelValue
  },
  set: (value: string | undefined | null) => {
    emit('update:modelValue', value)
  },
})

function selectGenus(genus: string) {
  const bodyFormData = new FormData()
  bodyFormData.append('file', props.file)

  bodyFormData.append('types', genus)

  options.value = []

  emit('updating', true)
  loading.value = true
  emit('update:modelValue', null)
  backend
    .client({
      method: 'post',
      url: '/api/predict',
      data: bodyFormData,
      timeout: 50000,
    })
    .then((result) => {
      emit('updating', false)
      loading.value = false

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
    }).catch((error) => {
      options.value = []
      emit('updating', false)
      loading.value = false
      console.error(error)
    })
}

// MODAL

const modalOpen = ref(false)
const modalSelected = ref(undefined as string | undefined)
const modalTextInput = ref('')
const modalLoading = ref(false)
const modalResults = ref([] as SpeciesSearchResult[])

async function search() {
  modalLoading.value = true
  const result = await speciesSearch(modalTextInput.value)
  modalResults.value = result
  modalLoading.value = false
}

function openModal() {
  modalSelected.value = undefined
  modalTextInput.value = ''
  modalOpen.value = true
}
function modalSelect() {
  if (modalSelected.value == undefined) {
    modalOpen.value = false
    return
  }
  const selection = modalResults.value.find(
    (o: SpeciesSearchResult) => o._id === modalSelected.value,
  )

  if (selection == undefined) {
    modalOpen.value = false
    return
  }

  manualOption.value = {
    id: selection._id,
    type: 'manual',
    name: selection.name,
    binomial: selection.binomial,
    imageUrl: selection.imageUrl,
  }
  modalOpen.value = false
  nextTick(() => {
    emit('update:modelValue', modalSelected.value)
  })
}

const debouncedSearch = debounce(search, 500)

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

.selector-actions
  display: flex
  align-items: center
  justify-content: flex-end
  gap: allmende.$size-xxxsmall
.selector-options
  overflow-y: auto
  height: 40vh
  margin-block: allmende.$size-xsmall
  gap: allmende.$size-xxxsmall
  display: flex
  flex-direction: column
  .selector-loading
    margin: allmende.$size-medium
    text-align: center
  .explainer
    margin: allmende.$size-medium
    text-align: center
  .option
    label
      padding: allmende.$size-xxsmall
      height: auto
    span
      white-space: normal
      word-break: break-all
    .info .img
      width: allmende.$size-xxlarge
      height: allmende.$size-xxlarge
</style>
