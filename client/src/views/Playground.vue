<script setup lang="ts">
import VButton from '@/components/VButton.vue'
import VInput from '@/components/VInput.vue'
import SvgIcon from '@/assets/icon24/bell.svg?component'
import { ref } from 'pinia/node_modules/vue-demi'
import { computed } from '@vue/reactivity'

const types = ['light', 'dark']

// Text field variables
const text = ref('')
const error = computed(() => {
  return text.value.length > 5 ? 'Too many characters' : undefined
})

function click() {
  console.log('clicked')
}
</script>

<template>
  <div class="playground">
    <h1>Playground</h1>

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
