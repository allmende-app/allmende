<template>
  <div>
    <v-title />
    <div class="posts">
      <v-post text="Hallo ich bin ein post"> </v-post>
      <v-post text="Hallo ich bin ein post"> </v-post>
      <v-post text="Hallo ich bin ein post"> </v-post>
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

const authStore = useAuthStore()

const logout = () => {
  authStore
    .logout()
    .then((response) => {
      router.push('/auth/login')
    })
    .catch((error) => {
      console.log(error)
    })
}

// TODO das funktioniert noch nicht :( 401 ERROR! :(
backend.client.defaults.withCredentials = true
console.log(backend.client);

backend.client
  .get('/api/posts?tag=nature&page=1')
  .then((response) => {
    console.log(response)
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
