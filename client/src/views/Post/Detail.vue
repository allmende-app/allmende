<template>
  <div>
    <v-title-vue title="post">
      <template v-slot:left>
        <v-button :icon="ArrowLeftSVG" tooltip="Back" @click="back" />
      </template>
    </v-title-vue>

    <section class="section">
      <div class="post-text">
        {{ text }}
      </div>
      <action-buttons
        :likes="likes"
        :liked="false"
        @likesClicked="toggleLike"
        :comments="comments.length"
        @commentsClicked="scrollToComments"
      ></action-buttons>
    </section>

    <section class="section">
      <h2 class="headline">Map</h2>
      <map-vue></map-vue>
    </section>

    <section class="section" v-for="sighting in sightings" :key="sighting.id">
      <sighting-vue
        :location="sighting.location"
        :kindom="sighting.kingdom"
        :species="sighting.species"
        :source="sighting.imageUrl"
        :alt="sighting.alt"
      ></sighting-vue>
    </section>

    <section class="section" id="comments">
      <h2 class="headline">Comments</h2>
      <comments-vue :post-id="postID"></comments-vue>
    </section>
  </div>
</template>

<script setup lang="ts">
import { PropType, Ref, ref } from 'vue'
import MapVue from '@/components/Map.vue'
import CommentsVue from '@/components/Comments.vue'
import ArrowLeftSVG from '@/assets/icon24/arrow-left.svg?component'
import SvgLike from '@/assets/icon24/like.svg?component'
import SvgComment from '@/assets/icon24/comment.svg?component'
import SightingVue from '@/components/post/Sighting.vue'
import VTitleVue from '@/components/VTitle.vue'
import VButton from '@/components/VButton.vue'
import router from '@/router'
import ActionButtons from '@/components/ActionButtons.vue'
import { log } from 'console'
import { backend } from '../../utils'
import type { AxiosError } from 'axios'
import type { ISighting } from '../../../../server/src/models/sighting'

/**
 * Props
 */
const props = defineProps({
  postID: {
    type: String as PropType<string>,
    required: true,
  },
})

/**
 * Data
 */
const text = ref('')
const comments = ref([])
const likes = ref(0)
const sightings: Ref<Array<ISighting>> = ref([])

/**
 * Functions
 */
const back = () => router.back()
const toggleLike = () => {
  // TODO: toggle like here
}
const scrollToComments = () =>
  router.replace(router.currentRoute.value.path + '#comments')

/**
 * fetching post details
 */
backend.client
  .get(`/api/posts/${props.postID}`)
  .then((response) => {
    const post = response.data.post
    console.log(post)

    text.value = post.text
    likes.value = post.likes.length
    sightings.value = post.sightings
    console.log(sightings.value)
  })
  .catch((error: AxiosError) => {
    console.log(error.code)
  })
</script>

<style lang="sass" scoped>
.headline
  margin-bottom: allmende.$size-xxxsmall


.post-text
  @include allmende.text-body
  padding: allmende.$size-medium
  background-color: white
  border-radius: allmende.$radius-card
  margin-bottom: allmende.$size-xxxsmall

.section
  margin-bottom: allmende.$size-small
  </style>
