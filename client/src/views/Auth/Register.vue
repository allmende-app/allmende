<template>
  <auth-layout>
    <template v-slot:inputs>
      <v-input
        name="username"
        label="Username"
        v-model="username"
        autocomplete="username"
      ></v-input>
      <v-input
        name="password"
        label="Password"
        type="password"
        autocomplete="new-password"
        v-model="password"
      ></v-input>
      <v-input
        name="repeat-password"
        label="Repeat password"
        type="password"
        autocomplete="new-password"
        v-model="password_confirm"
      ></v-input>
    </template>
    <template v-slot:buttons>
      <v-button @click="sendRequest"> Create account </v-button>

      <div class="router-link">
        <router-link to="/auth/login"> Log in instead </router-link>
      </div>
    </template>
  </auth-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import VInput from '@/components/VInput.vue'
import VButton from '@/components/VButton.vue'
import AuthLayout from '@/layouts/AuthLayout.vue'

const username = ref('')
const password = ref('')
const password_confirm = ref('')

const sendRequest = (event: Event) => {
  event.preventDefault()
  // TODO send ajax request to server here...
  console.log('[WIP] sending ajax request')
}
</script>

<style lang="sass" scoped></style>
