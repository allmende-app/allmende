<template>
  <article class="post">
    <div class="meta">
      <div class="author">
        <div class="userpic">
          <img
            :src="`${BACKEND_URL}api/image/${post.author.avatarUrl}`"
            alt="avatar"
          />
        </div>
        {{ post.author.username }}
      </div>
      <div class="date">{{ formatDate(new Date(post.createdAt)) }}</div>
      <div v-if="post.location" class="location">
        <SvgLocation />
        <p>{{ post.location.name }}</p>
      </div>
    </div>
    <div class="image-wrapper">
      <ul class="slider">
        <li v-for="image in activeImages" :key="image._id" :class="image.pos">
          <img
            :src="`${BACKEND_URL}api/image/${image.imageUrl}`"
            :alt="image.alt"
          />
        </li>
      </ul>
      <div class="image-nav">
        <button @click="prevImage" class="prev" v-if="currentImage > 0">
          <span><SvgArrowLeft /></span>
        </button>
        <button
          @click="nextImage"
          class="next"
          v-if="currentImage < post.sightings.length - 1"
        >
          <span><SvgArrowRight /></span>
        </button>
      </div>
      <div class="image-index" v-if="post.sightings.length > 1">
        <div
          v-for="i in post.sightings.length"
          :key="i"
          :class="{ active: i - 1 === currentImage }"
        ></div>
      </div>
      <div class="info">
        <div class="description">
          <span v-if="post.text.length > 0" class="clamp">{{ post.text }}</span>
          <router-link
            :to="{ name: 'post-detail', params: { postID: post._id } }"
            >Read more…</router-link
          >
        </div>
        <action-buttons
          :likes="post.likes.length"
          :liked="post.liked"
          @likesClicked="toggleLike()"
          :comments="post.commentsCount"
          @commentsClicked="openPostsComments()"
        ></action-buttons>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import SvgLocation from '@/assets/icon16/location.svg?component'
import SvgArrowLeft from '@/assets/icon24/arrow-left.svg?component'
import SvgArrowRight from '@/assets/icon24/arrow-right.svg?component'
import { computed, ref, type PropType, onMounted } from 'vue'
import ActionButtons from '../ActionButtons.vue'
import { formatDate, BACKEND_URL } from '@/utils'
import type { LocationInfo, Post, Sighting } from '@/interfaces/types'
import { backend, reverseLocationSearch } from '@/utils'
import router from '../../router'

interface ImageData extends Sighting {
  pos: string
}

const props = defineProps({
  propPost: {
    type: Object as PropType<Post>,
    required: true,
  },
})

const post = ref<Post>(props.propPost)
const location = ref<LocationInfo | null>(null)

onMounted(async () => {
  // iterate over props.post.sightings until we find a location
  for (const sighting of post.value.sightings) {
    if (sighting.lng && sighting.lat) {
      location.value = await reverseLocationSearch(sighting.lng, sighting.lat)
      break
    }
  }
})

function getImageData(index: number, pos: string): ImageData | null {
  return post.value.sightings[index] !== null
    ? ({
        ...post.value.sightings[index],
        pos,
      } as ImageData)
    : null
}

function openPostsComments() {
  router.push(`/posts/${post.value._id}#comments`)
}

const toggleLike = () => {
  backend.client
    .put(`/api/posts/like/${post.value._id}?`, null, {
      params: {
        like: !post.value.liked,
      },
    })
    .then((response) => {
      post.value = response.data.post
    })
    .catch((error) => console.log(error))
}

function nextImage() {
  if (currentImage.value < post.value.sightings.length - 1) {
    currentImage.value++
  }
}
function prevImage() {
  if (currentImage.value > 0) {
    currentImage.value--
  }
}

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
  width: 100%

.meta
  display: grid
  grid-template-columns: minmax(0, 1fr) auto
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
    > svg
      flex-shrink: 0
    > p
      white-space: nowrap
      overflow: hidden
      text-overflow: ellipsis
      min-width: 0

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
  box-shadow: var(--shadow-card)

.image-index
  z-index: 1
  background: rgba(0, 0, 0, 0.75)
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
  justify-content: space-between
  button
    top: 0
    bottom: 0
    position: absolute
    width: 128px
    &:focus
      outline: none
    span
      padding-inline: allmende.$size-small
      display: block
      position: absolute
      inset: 0

      // always show next and prev on mobile, on laptop screen only show on hover
      opacity: 1
      @include allmende.screen-laptop
        opacity: 0
      transition: opacity 0.25s ease-in-out
      display: flex
      align-items: center
      color: var(--text-inverted)
    &:hover span, &:focus-visible span
      opacity: 1
    &.prev
      left: 0
      span
        justify-content: flex-start
        background: linear-gradient(90deg, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0) 100%)
    &.next
      right: 0
      span
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
  a
    color: var(--text-secondary)
    text-decoration: none
    font-weight: 700
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
