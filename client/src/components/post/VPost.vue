<template>
  <article class="post">
    <div class="meta">
      <div class="author">
        <div class="userpic"><img src="/birds/amsel1.jpg" /></div>
        David
      </div>
      <div class="date">5d</div>
      <div class="location">
        <SvgLocation />Schlosspart Charlottenburg Berlin
      </div>
    </div>
    <div class="image-wrapper">
      <ul class="slider">
        <li v-for="image in activeImages" :key="image.id" :class="image.pos">
          <img :src="image.src" :alt="image.alt" />
        </li>
      </ul>
      <div class="image-nav">
        <button @click="prevImage" class="prev">
          <span><SvgArrowLeft /></span>
        </button>
        <button @click="nextImage" class="next">
          <span><SvgArrowRight /></span>
        </button>
      </div>
      <div class="image-index">
        <div
          v-for="i in images.length"
          :key="i"
          :class="{ active: i - 1 === currentImage }"
        ></div>
      </div>
      <div class="info">
        <div class="description">
          <span class="clamp"
            >Once the city used to pulse with energy. Dirty and dangerous, but
            alive and wonderful. Now it's something else. The changes came
            slowly at first. Most didn't realize, or didn't care, and accepted
            them. They chose a comfortable life. Some didn't. And those who
            refused to conform were pushed to the sidelines, criminalized. They
            became our clients. We call ourselves Runners. We exist on the edge
            between the gloss and the reality: the mirror's edge. We keep out of
            trouble, out of sight, and the cops don't bother us. Runners see the
            city in a different way. We see the flow. Rooftops become pathways
            and conduits, possibilities and routes of escape. The flow is what
            keeps us running, keeps us alive.</span
          >
        </div>
        <action-buttons
          :likes="12"
          :liked="false"
          @likesClicked="someFunction"
          :comments="8"
          @commentsClicked="someFunction"
        ></action-buttons>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import SvgLocation from '@/assets/icon16/location.svg?component'
import SvgLike from '@/assets/icon24/like.svg?component'
import SvgComment from '@/assets/icon24/comment.svg?component'
import SvgArrowLeft from '@/assets/icon24/arrow-left.svg?component'
import SvgArrowRight from '@/assets/icon24/arrow-right.svg?component'
import { computed, ref } from 'vue'
import ActionButtons from '../ActionButtons.vue'

interface ImageData {
  id: number
  pos: string
  src: string
  alt: string
}

function getImageData(index: number, pos: string): ImageData | false {
  return images[index]
    ? {
        id: index,
        src: images[index],
        alt: `todo${index + 1}`,
        pos,
      }
    : false
}

function nextImage() {
  if (currentImage.value < images.length - 1) {
    currentImage.value++
  }
}
function prevImage() {
  if (currentImage.value > 0) {
    currentImage.value--
  }
}

const images = [
  '/birds/amsel1.jpg',
  '/birds/amsel2.jpg',
  '/birds/amsel3.jpg',
  '/birds/amsel1.jpg',
  '/birds/amsel2.jpg',
]

const currentImage = ref(0)

// computed array of the current image the previous and next image
const activeImages = computed(() => {
  return [
    getImageData(currentImage.value - 1, 'left'),
    getImageData(currentImage.value, ''),
    getImageData(currentImage.value + 1, 'right'),
  ].filter(Boolean) as ImageData[]
})
</script>

<style lang="sass" scoped>

.post
  width: 400px

.meta
  display: grid
  grid-template-columns: 1fr auto
  grid-template: 1fr
  padding-inline: allmende.$size-xxsmall
  padding-block-end: allmende.$size-xxsmall
  .author, .location
    display: flex
    align-items: center
    gap: allmende.$size-xxxxsmall
  .author
    @include allmende.text-subhead
  .date, .location
    @include allmende.text-footnote
    color: var(--text-secondary)
  .location
    grid-area: 2 / 1 / 3 / 4

.userpic
  width: allmende.$size-xsmall
  height: allmende.$size-xsmall
  border-radius: 50%
  overflow: hidden
  display: inline-block
  img
    width: 100%
    height: 100%

.image-wrapper
  overflow: hidden
  height: 557px
  position: relative
  display: flex
  gap: allmende.$size-xxxsmall - 2px
  flex-direction: column
  justify-content: flex-end
  background: #e1eae1
  border-radius: allmende.$size-medium
  padding: allmende.$size-xxxsmall

.image-index
  z-index: 1
  background: rgba(0, 0, 0, 0.25)
  border-radius: allmende.$size-large
  display: inline-flex
  align-self: center
  gap: allmende.$size-xxxxsmall
  padding: allmende.$size-xxxxsmall
  > div
    border-radius: 50%
    height: 5px
    width: 5px
    background: white
    opacity: 0.5
    &.active
      opacity: 1

.image-nav
  position: absolute
  inset: 0
  display: flex
  justify-content: space-between
  button
    width: 128px
    position: relative
    &:focus
      outline: none
    span
      padding-inline: allmende.$size-small
      display: block
      position: absolute
      inset: 0
      opacity: 0
      transition: opacity 0.25s ease-in-out
      display: flex
      align-items: center
      color: var(--text-inverted)
    &:hover span, &:focus-visible span
      opacity: 1
    &.prev span
      justify-content: flex-start
      background: linear-gradient(90deg, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0) 100%)
    &.next span
      justify-content: flex-end
      background: linear-gradient(90deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.2) 100%)

.info
  z-index: 1
  border-radius: allmende.$size-small
  background: var(--layer-20)

.description
  @include allmende.text-footnote
  padding: allmende.$size-xsmall
  border-bottom: 1px solid var(--border-seperator)
  .clamp
    -webkit-box-orient: vertical
    display: -webkit-box
    overflow: hidden
    word-break: break-word
    -webkit-line-clamp: 3
.slider
  list-style: none
  li
    position: absolute
    inset: 0
    transition: transform 0.5s ease-in-out
    &.left
      transform: translateX(-100%)
    &.right
      transform: translateX(100%)
    img
      width: 100%
      height: 100%
      object-fit: cover
</style>
