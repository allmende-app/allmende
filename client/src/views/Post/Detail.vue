<template>
  <div>
    <v-title-vue title="post">
      <template v-slot:left>
        <v-button :icon="ArrowLeftSVG" tooltip="Back" @click="back" />
      </template>
    </v-title-vue>

    <div class="content" v-if="post != null">
      <div class="information">
        <section class="section text">
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
          </div>
          <div v-if="post.text.length > 0" class="post-text">
            {{ post.text }}
          </div>
          <action-buttons
            :likes="post.likes.length"
            :liked="post.liked"
            @likesClicked="toggleLike"
            :comments="post.commentsCount"
            @commentsClicked="scrollToComments"
          ></action-buttons>
        </section>

        <section class="section" v-if="showMap">
          <h2 class="headline">Map</h2>
          <map-vue :sightings="post.sightings"> </map-vue>
        </section>
      </div>

      <section class="posts">
        <sighting-vue
          v-for="sighting in post.sightings"
          :key="sighting._id"
          :sighting="sighting"
        ></sighting-vue>
      </section>

      <section class="section" id="comments">
        <h2 class="headline">Comments</h2>
        <comments-vue
          :post-id="postID"
          @comment-added="() => post && post.commentsCount++"
        >
        </comments-vue>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, type PropType } from 'vue'
import MapVue from '@/components/Map.vue'
import CommentsVue from '@/components/Comments.vue'
import ArrowLeftSVG from '@/assets/icon24/arrow-left.svg?component'
import SightingVue from '@/components/post/Sighting.vue'
import VTitleVue from '@/components/VTitle.vue'
import VButton from '@/components/VButton.vue'
import router from '@/router'
import ActionButtons from '@/components/ActionButtons.vue'
import { formatDate, backend, BACKEND_URL } from '@/utils'
import type { AxiosError } from 'axios'
import type { Post } from '@/interfaces/types'

/**
 * Props
 */
const props = defineProps({
  postID: {
    type: String as PropType<string>,
    required: true,
  },
})

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
const post = ref(null as null | Post)

const showMap = computed(() => {
  return (
    post.value != null && post.value.sightings.some((sighting) => sighting.lat)
  )
})

/**
 * Functions
 */
const back = () => router.back()
const setPost = (p: Post) => {
  post.value = p
}

const scrollToComments = () =>
  router.replace(router.currentRoute.value.path + '#comments')

const toggleLike = () => {
  backend.client
    .put(`/api/posts/like/${props.postID}?`, null, {
      params: {
        like: !post.value?.liked,
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

.posts
  margin-bottom: allmende.$size-small
  display: grid
  gap: allmende.$size-small

@include allmende.screen-laptop
  .information
    display: flex
    gap: allmende.$size-small
    > *
      flex: 1
    .text
      display: flex
      flex-direction: column
      .post-text
        flex: 1

.meta
  display: grid
  grid-template-columns: minmax(0, 1fr) auto
  grid-template: 1fr
  padding-inline: allmende.$size-xxsmall
  padding-block-end: allmende.$size-xxsmall
  .author
    display: flex
    align-items: center
    gap: allmende.$size-xxxxsmall
    @include allmende.text-subhead
  .date
    @include allmende.text-footnote
    color: var(--text-secondary)

.userpic
  width: allmende.$size-xsmall
  height: allmende.$size-xsmall
  border-radius: 50%
  overflow: hidden
  display: inline-block
  img
    width: 100%
    height: 100%

.section
  margin-bottom: allmende.$size-small
</style>
