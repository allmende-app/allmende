<template>
  <div class="container">
    <div class="post-container">
      <v-title title="allmende">
        <template v-slot:left>
          <component :is="BackIcon"></component>
        </template>
        <template v-slot:right>
          <component :is="CloseIcon"></component>
        </template>
      </v-title>
      <v-post text="Hallo ich bin ein post"> </v-post>
      <v-post text="Hallo ich bin ein post"> </v-post>
    </div>
    <v-button @click="logout" type="primary"> Logout </v-button>
  </div>
</template>

<script setup lang="ts">
import VButton from '@/components/VButton.vue'
import VInput from '@/components/VInput.vue'
import BackIcon from '@/assets/icon24/back.svg?component'
import CloseIcon from '@/assets/icon24/close.svg?component'
import { ref } from 'pinia/node_modules/vue-demi'
import { computed } from '@vue/reactivity'
import axios, { AxiosError } from 'axios'
import { useAuthStore } from '../stores/auth'
import router from '@/router'
import VPost from '../components/post/VPost.vue'
import VTitle from '../components/VTitle.vue'
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
backend.client.get("http://127.0.0.1:3000/api/posts?tag=nature&page=1")
  .then(response => {
    console.log(response);
  })
  .catch((error: AxiosError) => {
    console.log(error);
  })
</script>

<style lang="sass" scoped>
.container
  width: 100%
  display: flex
  flex-direction: column
  align-items: center
  gap: allmende.$size-medium

  .post-container
    display: flex
    flex-direction: column
    align-items: center
    gap: allmende.$size-medium
</style>
