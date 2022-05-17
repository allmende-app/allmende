<template>
  <div class="image-slider">
    <div class="image-container">
      <img alt="ams" :src="images[currentImage]" class="slide" />
    </div>
    <div class="content">
      <div class="control">
        <span v-for="(image, index) in images" :key="index" @click="setImage(index)" class="control-button" :class="{active: (new Number(index)) == currentImage}"></span>
      </div>
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const images = [
  "/birds/amsel1.jpg",
  "/birds/amsel2.jpg",
  "/birds/amsel3.jpg"
]

const currentImage = ref(0)

const setImage = (index: number)  => {
  currentImage.value = index
}

</script>

<style lang="sass" scoped>

.image-slider
  width: 100%
  height: max-content

  border-radius: allmende.$radius-button
  overflow: hidden

  position: relative

  .image-container
    img
      width: 100%
      height: 550px // TODO make me responsive please :)
      display: block
  .content
    position: absolute
    bottom: calc(allmende.$size-xxxsmall)
    left: 50%
    transform: translateX(-50%)

    width: calc(100% - allmende.$size-xxxsmall * 2)

    display: flex
    flex-direction: column
    align-items: center
    gap: allmende.$size-xxxxsmall

    .control
      display: flex
      flex-direction: row
      gap: 4px

      border-radius: 8px
      background: rgba(0, 0, 0, 0.25)
      padding: 4px

      width: max-content

      .control-button
        display: block
        background-color: #fff
        opacity: 0.5
        height: 10px
        width: 10px
        border-radius: 100%
        cursor: pointer

        &.active
          opacity: 1

</style>
