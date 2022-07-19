<template>
  <div>
    <v-title>
      <template v-slot:right>
        <!-- <v-button class="primary" tooltip="Back" @click="logout()">Logout</v-button> -->
      </template>
    </v-title>
    <div class="posts" v-if="posts == null">
      <v-post-placeholder v-for="i in 6" :key="i" />
    </div>
    <div class="posts" v-else>
      <v-post v-for="post in posts" :key="post._id" :prop-post="post" />
    </div>
  </div>
</template>

<script setup lang="ts">
import VPost from '@/components/post/VPost.vue'
import VTitle from '@/components/VTitle.vue'
import type { AxiosError } from 'axios'
import { backend } from '../utils'
import { ref } from 'vue'
import type { Post } from '@/interfaces/types'
import VPostPlaceholder from '../components/VPostPlaceholder.vue'

const posts = ref(null as Post[] | null)

backend.client
  .get('/api/posts')
  .then((response) => {
    console.log(response.data.posts)
    posts.value = response.data.posts
  })
  .catch((error: AxiosError) => {
    console.log(error)
  })
</script>

<style lang="sass" scoped>
.posts
  width: 100%
  display: flex
  flex-direction: column
  align-items: center
  gap: allmende.$size-medium
  @include allmende.screen-laptop
    display: grid
    grid-template-columns: repeat(auto-fit, minmax(400px, 1fr))
    > .post
      margin-inline: auto
</style>
