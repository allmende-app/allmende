<template>
  <focus-trap>
    <Teleport to="body">
      <div class="modal-wrapper">
        <section class="modal">
          <div class="action">
            <v-button
              :icon="SvgClose"
              tooltip="Cancel"
              @click="emit('close')"
            />
          </div>
          <div class="content">
            <slot></slot>
          </div>
        </section>
      </div>
    </Teleport>
  </focus-trap>
</template>

<script lang="ts" setup>
import SvgClose from '@/assets/icon24/close.svg?component'
import VButton from './VButton.vue'

const emit = defineEmits(['close'])
</script>

<style lang="sass">
.modal-wrapper
  position: fixed
  inset: 0
  display: flex
  flex-direction: column
  justify-content: flex-end
  align-items: center
  z-index: 100
  background: var(--action-secondary-disabled)
  @include allmende.screen-laptop
    padding: allmende.$size-xlarge
    justify-content: center

.modal
  box-sizing: border-box
  background: var(--layer-20)
  padding: allmende.$size-xsmall
  width: 100%
  max-height: 95vh
  border-radius: allmende.$radius-card
  border-bottom-left-radius: 0
  border-bottom-right-radius: 0
  box-shadow: var(--shadow-card)
  @include allmende.screen-laptop
    max-width: 512px
    border-radius: allmende.$radius-card

.action
  display: flex
  justify-content: flex-end

.content
  padding-inline: allmende.$size-medium
  padding-block-start: allmende.$size-xsmall
  padding-block-end: allmende.$size-xlarge
  h1
    @include allmende.text-navbar
    margin-block-end: allmende.$size-xsmall
  p
    color: var(--text-secondary)
    margin-block-end: allmende.$size-xxxsmall
</style>
