<template>
  <div class="nav-wrapper">
    <nav>
      <div>
        <button
          @click="router.push('/')"
          aria-label="Home"
          class="nav-button"
          :class="{ active: $route.name === 'home' }"
        >
          <SvgHome />
        </button>
      </div>
      <div>
        <button
          @click="router.push('/user')"
          aria-label="User"
          class="nav-button"
          :class="{ active: $route.name === 'user' }"
        >
          <SvgUser />
        </button>
      </div>
      <div class="search-wrapper">
        <input
          type="file"
          id="file-button"
          multiple
          @change="handleFileEvent"
          accept="image/png, image/gif, image/jpeg"
        />
        <label for="file-button" class="nav-button search"><SvgPlus /></label>
      </div>
    </nav>
  </div>
</template>

<script setup lang="ts">
import SvgHome from '@/assets/icon24/home.svg?component'
import SvgPlus from '@/assets/icon24/plus.svg?component'
import SvgUser from '@/assets/icon24/user.svg?component'
import { useRouter } from 'vue-router'
import { useFilesStore } from '@/stores/files'

const router = useRouter()
const store = useFilesStore()

function handleFileEvent(event: Event) {
  const file = event.target as HTMLInputElement
  const files2 = file.files
  if (!files2) {
    return
  }
  store.addFiles(Array.from(files2))
  router.push({ name: 'create-post' })
}
</script>

<style lang="sass" scoped>
.search-wrapper
  grid-area: add
  > input
    width: 0
    height: 0
    position: absolute
    &:focus
      outline: none

nav
  background: var(--layer-20)
  color: var(--icon-disabled)
  z-index: 10
  // Mobile only
  padding-inline: allmende.$size-small
  position: fixed
  display: grid
  border-top: 1px solid var(--border-seperator)
  left: 0
  right: 0
  bottom: 0
  grid-template-columns: repeat(3, 1fr)
  grid-template-areas: ". add ."
  @include allmende.screen-laptop
    // Desktop only
    padding-inline: 0
    position: relative
    display: flex
    border: none
    width: allmende.$size-huge
    box-shadow: var(--shadow-card)
    border-radius: allmende.$size-xsmall
    padding-top: allmende.$size-xxxsmall
    overflow-y: auto
    flex: 1
    flex-direction: column

nav > div
  display: flex
  justify-content: center
  position: relative
  padding: allmende.$size-xxxsmall
  @include allmende.screen-laptop
    display: initial
    &:nth-last-child(2)
      flex: 1

.nav-button
  @include allmende.effect-focus
  display: flex
  align-items: center
  justify-content: center
  width: allmende.$size-xlarge
  border-radius: allmende.$size-xlarge
  aspect-ratio: 1
  &:hover
    background: var(--action-secondary-hover)
  &:active
    background: var(--action-secondary-active)
  &.active
    color: var(--icon-default)
  @include allmende.screen-laptop
    width: 100%
    aspect-ratio: 1

.search
  color: var(--icon-default)
  display: flex
  justify-content: center
  align-items: center
  height: allmende.$size-xxlarge
  width: allmende.$size-xxlarge
  box-shadow: var(--shadow-card)
  background: var(--layer-10)
  border-radius: 50%
  position: absolute
  bottom: allmende.$size-medium
  &:hover
    background: var(--action-secondary-hover)
  &:active
    background: var(--action-secondary-active)
  @include allmende.screen-laptop
    position: static
    box-shadow: none

input:focus-visible + .search
  @include allmende.effect-focus-unwrapped

@include allmende.screen-laptop
  .nav-wrapper
    position: fixed
    top: 0
    height: 100%
    padding-block: allmende.$size-xlarge
    box-sizing: border-box
    display: flex
</style>
