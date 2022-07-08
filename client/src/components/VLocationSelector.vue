<template>
  <div v-if="open" class="overlay" @click="close()"></div>
  <focus-trap v-model:active="open">
    <form @submit.prevent class="wrapper" @keydown.esc="close()">
      <v-input
        class="input"
        v-model="textInput"
        :helperText="open ? undefined : helperText"
        @input="
          () => {
            open = true
            debouncedSearch()
          }
        "
        label="Where were you?"
        @focus="(event: FocusEvent) => {
          (event.target as HTMLInputElement | null)?.select()
        }"
      />
      <div v-if="open" class="results">
        <ul>
          <li v-for="result in results" :key="result.osmId || result.subname">
            <button @click="updateValue(result)">
              <span>{{ result.name }}</span>
              <p>{{ result.subname }}</p>
            </button>
          </li>
        </ul>
      </div>
    </form>
  </focus-trap>
</template>

<script setup lang="ts">
import VInput from '@/components/VInput.vue'
import type { LocationInfo } from '@/interfaces/types'
import { ref, watch, type PropType } from 'vue'
import debounce from 'debounce'
import { locationSearch } from '@/utils'

const emit = defineEmits(['update:modelValue'])

const props = defineProps({
  modelValue: {
    type: null as unknown as PropType<LocationInfo | null>,
    required: true,
  },
  helperText: {
    type: String as PropType<string | undefined>,
  },
})

const open = ref(false)
const textInput = ref(props.modelValue?.name || '')
const loading = ref(false)
const results = ref([] as LocationInfo[])

watch(
  () => props.modelValue,
  (value) => {
    textInput.value = value?.name || ''
  },
)

const close = () => {
  if (textInput.value.length < 1) {
    emit('update:modelValue', null)
  }
  open.value = false
  textInput.value = props.modelValue?.name || ''
}

const updateValue = (data: LocationInfo | null) => {
  emit('update:modelValue', data)
  open.value = false
}

async function search() {
  loading.value = true
  const result = await locationSearch(textInput.value)
  results.value = result
  loading.value = false
}

const debouncedSearch = debounce(search, 500)
</script>

<style lang="sass" scoped>
.overlay
  position: fixed
  inset: 0
  background: rgba(239,240,243,0.25)
.wrapper
  position: relative
.input
  position: relative
  z-index: 2
.results
  z-index: 1
  position: absolute
  padding: allmende.$size-xxxsmall
  padding-block-start: (allmende.$size-xxxsmall * 2) + allmende.$input-height
  box-shadow: var(--shadow-card)
  left: - allmende.$size-xxxsmall
  top: - allmende.$size-xxxsmall
  right: - allmende.$size-xxxsmall
  background: var(--layer-20)
  border-radius: allmende.$size-xxxsmall

ul
  list-style: none
  button
    @include allmende.effect-focus
    border-radius: 4px
    padding: allmende.$size-xxxsmall
    text-align: left
    width: 100%
    &:hover
      background: var(--action-secondary-hover)
    &:active
      background: var(--action-secondary-active)
    p
      @include allmende.text-footnote
      color: var(--text-secondary)
      white-space: nowrap
      overflow: hidden
      text-overflow: ellipsis
</style>
