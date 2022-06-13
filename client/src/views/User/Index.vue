<template>
  <div>
    <v-title-vue title="">
      <template v-slot:left>
        <v-button :icon="ArrowLeftSVG" tooltip="Back" @click="back" />
      </template>
      <template v-slot:right>
        <v-button type="primary" tooltip="Follow" @click="toggleFollow">
          {{ following ? "Follow": "Following"}}
        </v-button>
      </template>
    </v-title-vue>

    <section class="section">

      <div class="information">
        <div class="profil-image-wrapper">
          <div class="profil-image">
            <img  src="/birds/amsel1.jpg" alt="" srcset="">
          </div>
        </div>

        <div class="names">
          <span>
            <span class="name">David</span>
            <span>&nbsp;</span>
            <span class="username">david</span>
          </span>
        </div>

        <div class="activity">
          <div class="posts">
            <span class="number">241</span>
            <span class="description">Posts</span>
          </div>
          <div class="followers">
            <span class="number">26</span>
            <span class="description">Followers</span>
          </div>
          <div class="following">
            <span class="number">8</span>
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
import router from "../../router"
import ArrowLeftSVG from '@/assets/icon24/arrow-left.svg?component';
import VTitleVue from '@/components/VTitle.vue'
import VButton from "@/components/VButton.vue"
import VPost from "@/components/post/VPost.vue";
import { PropType, ref } from "@vue/runtime-core";


const props = defineProps({
  userId: {
    type: String as PropType<string>,
    required: true,
  },
})

const following = ref(true)
// TODO: fetch data that belongs to the given user

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

    .name
      @include allmende.text-headline
      font-size: 24px
      font-weight: bold
      color: var(--text-primary)

    .username
      @include allmende.text-headline
      color: var(--text-secondary)
      font-weight: 400

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
