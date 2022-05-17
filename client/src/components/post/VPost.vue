<template>
  <div class="post">
    <div class="meta">
      <div class="post-creation">
        <v-creator name="David" :user-id="1"> </v-creator>
        <p>5d</p>
      </div>
      <v-location></v-location>
    </div>

    <image-slider>
      <div class="post-body">
        <span class="content">
          Once the city used to pulse with energy. Dirty and dangerous, but
          alive and wonderful. Now it's something...
        </span>
        <div class="interactions">
          <span class="likes">
            <component :is="LikesIcon"></component>
            12
          </span>
          <span class="comments">
            <component :is="CommentsIcon"></component>
            1
          </span>
        </div>
      </div>
    </image-slider>
  </div>
</template>

<script setup lang="ts">
import { PropType } from '@vue/runtime-core'
import ImageSlider from './ImageSlider.vue'
import VCreator from './VCreator.vue'
import VLocation from '../VLocation.vue'
import LikesIcon from '@/assets/icon24/like.svg'
import CommentsIcon from '@/assets/icon24/comment.svg'

const props = defineProps({
  // TODO: use IPost here
  text: {
    type: String as PropType<string>,
    required: true,
  },
  sightings: {
    type: Array,
    required: false,
  },
  author: {},
  likes: {},
  comments: {},
  tags: {},
})
</script>

<style lang="sass" scoped>
@import '@/styles/variables.sass'

.post
  width: 90%
  max-width: 500px
  .meta
    margin-bottom: 12px
    .post-creation
      display: flex
      flex-direction: row
      align-items: center
      justify-content: space-between

  .post-body
    width: 100%
    background-color: var(--layer-20)
    @include allmende.text-footnote
    border-radius: allmende.$radius-button
    .content
      display: block
      padding: allmende.$size-xsmall
      padding-bottom: allmende.$size-xxsmall
      border-bottom: 1px solid var(--border-seperator)
    .interactions
      width: 100%
      display: flex
      flex-direction: row

      span
        width: 50%
        text-align: center
        padding: 10px
        @include allmende.text-subhead
        display: flex
        justify-content: center
        align-items: center
        gap: 6px
</style>
