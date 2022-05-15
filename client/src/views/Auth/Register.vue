<template>
  <auth-layout>
    <template v-slot:default>
      <p style="color: red">
        {{ error_message }}
      </p>
    </template>
    <template v-slot:inputs>
      <v-input
        name="username"
        label="Username"
        v-model="username"
        autocomplete="username"
      ></v-input>
      <v-input
        name="email"
        label="Email"
        v-model="email"
        autocomplete="email"
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
import { useAuthStore } from '../../stores/auth'
import type { RegisterInput } from '../../../../server/src/interfaces/inputs'
import axios from 'axios';
import router from '@/router'
import { log } from 'console'

const username = ref('')
const password = ref('')
const email = ref('')
const password_confirm = ref('')
const error_message = ref('')

const authStore = useAuthStore()

const sendRequest = (event: Event) => {
  event.preventDefault()
  const registerData : RegisterInput = {
    username: username.value,
    email: email.value,
    password: password.value,
    confirmPassword: password_confirm.value
  }

  authStore.register(registerData)
    .then(response => {
      router.push("/")
    })
    .catch(error  => {
      // TODO display error here
      console.log(error);
      error_message.value = error.response.data
    })
}
</script>

<style lang="sass" scoped></style>
