<script setup lang="ts">
import VButton from '@/components/VButton.vue'
import VInput from '@/components/VInput.vue'
import SvgIcon from '@/assets/icon24/bell.svg?component'
import { ref } from 'pinia/node_modules/vue-demi'
import { computed } from '@vue/reactivity'
import MapSelector from '@/components/MapSelector.vue'
import { ISighting } from '../../../server/src/models/sighting'
import VLocationSelector from '@/components/VLocationSelector.vue'
import { LocationInfo } from '../../../server/src/interfaces'

const types = ['light', 'dark']

// Text field variables
const text = ref('')
const error = computed(() => {
  return text.value.length > 5 ? 'Too many characters' : undefined
})

const modelValue = ref({} as LocationInfo)

const sightings: Array<ISighting> = [
  { lat: 51.504, lng: -0.09, alt: 'This is a way point description' },
  { lat: 51.503, lng: -0.09, alt: 'lorem ipsum 1' },
  { lat: 51.502, lng: -0.09, alt: 'lorem ipsum 2' },
  { lat: 51.501, lng: -0.09, alt: 'lorem ipsum 3' },
]

function click() {
  console.log('clicked')
}
</script>

<template>
  <div class="playground">
    <h1>Playground</h1>

    <section>
      <map-selector v-model="modelValue"></map-selector>
      <v-location-selector v-model="modelValue"></v-location-selector>
    </section>

    <section>
      <h2>Buttons</h2>
      <div class="preview">
        <div v-for="t in types" :key="t" :data-theme="t" class="theme">
          <VButton @click="click" type="primary"> Label </VButton>
          <VButton
            @click="click"
            type="primary"
            :icon="SvgIcon"
            tooltip="Bell"
          />
          <VButton @click="click"> Label </VButton>
          <VButton @click="click" :icon="SvgIcon" tooltip="Bell" />
          <VButton @click="click" type="primary" disabled> Label </VButton>
          <VButton
            @click="click"
            type="primary"
            :icon="SvgIcon"
            tooltip="Bell"
            disabled
          />
          <VButton @click="click" disabled> Label </VButton>
          <VButton @click="click" :icon="SvgIcon" tooltip="Bell" disabled />
        </div>
      </div>
    </section>
    <section>
      <h2>Text Fields</h2>
      <div class="preview down">
        <div v-for="t in types" :key="t" :data-theme="t" class="theme">
          <VInput v-model="text" label="Label" name="name" />
          <VInput
            v-model="text"
            helper-text="This is a helper text"
            label="Label"
            :error="error"
            name="name"
          />
        </div>
      </div>
    </section>
  </div>
</template>

<style lang="sass" scoped>
h1
  padding: 32px 64px 0 64px
h2
  margin-bottom: 16px
section
  background-color: var(--layer-05)
  padding: 32px
  margin: 32px
  border-radius: 16px
  .preview
    display: flex
    gap: 32px
    flex-wrap: wrap
    &.down > .theme
      flex-direction: column
  .theme
    flex: 1
    background: var(--layer-20)
    border-radius: 16px
    padding: 16px
    display: flex
    gap: 16px
    flex-wrap: wrap
</style>
