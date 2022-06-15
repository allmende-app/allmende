<template>
  <div>
    <v-title />
    <div class="posts">
      <v-post v-for="post in posts" :key="post._id" :post="post" />
    </div>
  </div>
</template>

<script setup lang="ts">
import VPost from '@/components/post/VPost.vue'
import VTitle from '@/components/VTitle.vue'
import type { AxiosError } from 'axios'
import { useAuthStore } from '../stores/auth'
import router from '@/router'
import { backend } from '../utils'
import { ref } from 'vue'
import type { Post } from '@/interfaces/types'

const authStore = useAuthStore()

const posts = ref([] as Post[])

const logout = () => {
  authStore
    .logout()
    .then(() => {
      router.push('/auth/login')
    })
    .catch((error) => {
      console.log(error)
    })
}

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
