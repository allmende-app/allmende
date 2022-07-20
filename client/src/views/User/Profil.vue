<template>
  <div>
    <v-title-vue title="">
      <template v-slot:left v-if="!isSelf">
        <v-button :icon="ArrowLeftSVG" tooltip="Back" @click="back" />
      </template>
    </v-title-vue>

    <section class="section">
      <div class="information">
        <div class="profile-image-wrapper">
          <div class="profile-image">
            <img
              :src="`${BACKEND_URL}api/image/${user?.avatarUrl}`"
              alt=""
              srcset=""
            />
          </div>
        </div>

        <div class="names">
          <span>
            <span class="username">{{ user?.username || '' }}</span>
          </span>
        </div>

        <div class="activity">
          <div class="post-count">
            <span class="number">{{ posts?.length || 0 }}</span>
            <span class="description">Posts</span>
          </div>
          <div class="followers">
            <span class="number">{{ user?.followers?.length || 0 }}</span>
            <span class="description">Followers</span>
          </div>
          <div class="following">
            <span class="number">{{ user?.following?.length || 0 }}</span>
            <span class="description">Following</span>
          </div>
        </div>
      </div>
    </section>

    <div class="posts" v-if="posts == null">
      <v-post-placeholder v-for="i in 6" :key="i" />
    </div>
    <div class="posts" v-else>
      <v-post v-for="post in posts" :key="post._id" :prop-post="post" />
    </div>
  </div>
</template>

<script setup lang="ts">
import router from '@/router'
import ArrowLeftSVG from '@/assets/icon24/arrow-left.svg?component'
import VTitleVue from '@/components/VTitle.vue'
import VButton from '@/components/VButton.vue'
import VPost from '@/components/post/VPost.vue'
import { useAuthStore } from '@/stores/auth'
import { backend } from '@/utils'
import { ref, type PropType } from 'vue'
import type { Post, User } from '@/interfaces/types'
import { BACKEND_URL } from '@/utils'
import VPostPlaceholder from '@/components/VPostPlaceholder.vue'

const user = ref(null as User | null)
const posts = ref(null as Post[] | null)
const self = ref(useAuthStore().user)

const props = defineProps({
  username: {
    required: false,
    default: () => {
      return ''
    },
  },
})

const isSelf = ref(true)

const username = props.username[0] || props.username

backend.client
  .get(`/api/users/${username}`)
  .then((response) => {
    user.value = response.data.user

    if (self.value !== null) {
      isSelf.value = self.value.username === response.data.user.username
    }
  })
  .catch((error) => {
    router.push('/error')
    console.log(error)
  })

const realUsername = username || self.value?.username
backend.client
  .get(`/api/posts/profile/${realUsername}`)
  .then((response) => {
    posts.value = response.data.posts
  })
  .catch((error) => {
    console.log(error)
  })

const back = () => {
  router.back()
}
</script>

<style lang="sass" scoped>

.information
  background-color: white
  border-radius: allmende.$radius-card

  .profile-image-wrapper
    width: 100%
    height: 100px
    position: relative
    .profile-image
      position: absolute
      left: 50%
      top: -50%
      transform: translateX(-50%)
      height: 128px
      width: 128px
      border-radius: 50%
      overflow: hidden
      background-color: var(--layer-05)
      img
        height: inherit

  .names
    display: flex
    justify-content: center
    align-items: flex-start

    .username
      @include allmende.text-headline
      font-size: 24px
      font-weight: bold
      color: var(--text-primary)

  .activity
    display: flex
    flex-direction: row
    justify-content: space-around
    padding: allmende.$size-xsmall
    & > div
      display: flex
      flex-direction: column
      justify-content: center
      align-items: center
      .number
        font-size: 15px
        font-weight: 400
      .description
        color: var(--text-secondary)
        font-size: 12px
        font-weight: 400

.posts
  width: 100%
  display: flex
  flex-direction: column
  align-items: center
  gap: allmende.$size-medium
  margin-block-start: allmende.$size-small
  @include allmende.screen-laptop
    display: grid
    grid-template-columns: repeat(auto-fit, minmax(400px, 1fr))
    > .post
      margin-inline: auto
</style>
