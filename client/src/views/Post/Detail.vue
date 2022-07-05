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
        :liked="liked"
        @likesClicked="toggleLike"
        :comments="commentsCount"
        @commentsClicked="scrollToComments"
      ></action-buttons>
    </section>

    <section class="section">
      <h2 class="headline">Map</h2>
      <map-vue v-if="ready" :sightings="sightings"> </map-vue>
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
      <comments-vue :post-id="postID" @comment-added="commentsCount++">
      </comments-vue>
    </section>
  </div>
</template>

<script setup lang="ts">
import { onMounted, PropType, Ref, ref } from 'vue'
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
import { backend } from '../../utils'
import type { AxiosError } from 'axios'
import type { ISighting } from '../../../../server/src/models/sighting'
import { onBeforeRouteLeave, onBeforeRouteUpdate } from 'vue-router'

/**
 * Props
 */
const props = defineProps({
  postID: {
    type: String as PropType<string>,
    required: true,
  },
})

const ready = ref(false)

onMounted(() => {
  if (router.currentRoute.value.hash == '#comments') {
    setTimeout(() => {
      scrollToComments()
    }, 200)
  }
})

/**
 * Data
 */
const text = ref('')
const commentsCount = ref(0) // TODO: get comments length with post detail request
const likes = ref(0)
const sightings: Ref<Array<ISighting>> = ref([])
const liked = ref(false)

/**
 * Functions
 */
const back = () => router.back()
const setPost = (post: any) => {
  text.value = post.text
  likes.value = post.likes.length
  sightings.value = post.sightings
  commentsCount.value = post.commentsCount
  liked.value = post.liked

  console.log(post)

  ready.value = true
}

const scrollToComments = () =>
  router.replace(router.currentRoute.value.path + '#comments')

const toggleLike = () => {
  backend.client
    .put(`/api/posts/like/${props.postID}?`, null, {
      params: {
        like: !liked.value,
      },
    })
    .then((response) => setPost(response.data.post))
    .catch((error) => console.log(error))
}

/**
 * Startup Calls
 */
backend.client
  .get(`/api/posts/${props.postID}`)
  .then((response) => setPost(response.data.post))
  .catch((error: AxiosError) => console.log(error.code))
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
