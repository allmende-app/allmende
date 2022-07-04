<template>
  <div>
    <v-title>
      <template v-slot:right>
        <!-- <v-button class="primary" tooltip="Back" @click="logout()">Logout</v-button> -->
      </template>
    </v-title>
    <div class="posts">
      <v-post
        v-for="post in posts"
        :key="post._id"
        :post="post"
        @post-updated="updatePost($event, post._id)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import VPost from '@/components/post/VPost.vue'
import VButton from '@/components/VButton.vue'
import VTitle from '@/components/VTitle.vue'
import type { AxiosError } from 'axios'
import { useAuthStore } from '../stores/auth'
import router from '@/router'
import { backend } from '../utils'
import { ref } from 'vue'
import type { Post } from '@/interfaces/types'
import { ObjectId } from 'mongoose'
import FooterVue from '@/components/Footer.vue'

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

const updatePost = (updatedPost: Post, postID: string) => {
  const post = posts.value.find((post) => {
    return post._id == postID
  })

  post.likes = updatedPost.likes
  // TODO: updae the whole post here or use storage to do that
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

<style lang="sass" scoped></style>
