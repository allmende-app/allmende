<template>
  <div>
    <v-title-vue title="">
      <template v-slot:left v-if="!isSelf">
        <v-button :icon="ArrowLeftSVG" tooltip="Back" @click="back" />
      </template>
      <template v-slot:right>
        <v-button type="primary" tooltip="Follow" @click="toggleFollow">
          {{ following ? 'Follow' : 'Following' }}
        </v-button>
      </template>
    </v-title-vue>

    <section class="section">
      <div class="information">
        <div class="profil-image-wrapper">
          <div class="profil-image">
            <!-- TODO: set correct profil image here -->
            <img src="/birds/amsel1.jpg" alt="" srcset="" />
          </div>
        </div>

        <div class="names">
          <span>
            <span class="username">{{user.username}}</span>
          </span>
        </div>

        <div class="activity">
          <div class="posts">
            <!-- TODO no information given about the posts => mabye load in another request -->
            <span class="number">241</span>
            <span class="description">Posts</span>
          </div>
          <div class="followers">
            <span class="number">{{user.followers?.length}}</span>
            <span class="description">Followers</span>
          </div>
          <div class="following">
            <span class="number">{{user.following?.length}}</span>
            <span class="description">Following</span>
          </div>
        </div>
      </div>
    </section>

    <section class="section">
      <v-post></v-post>
    </section>
  </div>
</template>

<script setup lang="ts">
import router from '../../router'
import ArrowLeftSVG from '@/assets/icon24/arrow-left.svg?component'
import VTitleVue from '@/components/VTitle.vue'
import VButton from '@/components/VButton.vue'
import VPost from '@/components/post/VPost.vue'
import { PropType, ref } from '@vue/runtime-core'
import { useAuthStore } from '../../stores/auth'
import { backend } from '../../utils'

const user = ref({})
const following = ref(false)
const self = ref(useAuthStore().user)

const props = defineProps({
  username: {
    type: String as PropType<string>,
    required: false,
    default: ""
  },
})

const isSelf = ref(true)

backend.client.get(`/api/users/${props.username}`)
  .then(response => {
    user.value = response.data.user
    isSelf.value = self?.value.username === response.data.user.username
  })
  .catch(error => {
    router.push("/error")
    console.log(error);
  })

const back = () => {
  router.back()
}

const toggleFollow = () => {
  // TODO: follow user here
  following.value = !following.value
}
</script>

<style lang="sass" scoped>

.information
  background-color: white
  border-radius: allmende.$radius-card

  .profil-image-wrapper
    width: 100%
    height: 100px
    position: relative
    .profil-image
      position: absolute
      left: 50%
      top: -50%
      transform: translateX(-50%)
      height: 128px
      width: 128px
      border-radius: 50%
      overflow: hidden
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
</style>
