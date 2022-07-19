<template>
  <auth-layout>
    <template v-slot:default>
      {{ globalError }}
    </template>
    <template v-slot:inputs>
      <v-input
        name="username"
        label="Username"
        v-model="username.value"
        :error="username.error"
        autocomplete="username"
      ></v-input>
      <v-input
        name="password"
        label="Password"
        type="password"
        autocomplete="current-password"
        v-model="password.value"
        :error="password.error"
      ></v-input>
    </template>
    <template v-slot:buttons>
      <v-button @click="login"> Log in </v-button>

      <div class="router-link">
        <router-link to="/auth/register"> Create Account </router-link>
      </div>
    </template>
  </auth-layout>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import VInput from '@/components/VInput.vue'
import VButton from '@/components/VButton.vue'
import AuthLayout from '@/layouts/AuthLayout.vue'
import { useAuthStore } from '../../stores/auth'
import router from '@/router'

import { RouterLink } from 'vue-router'
import type { LoginInput } from '@/interfaces/inputs'

const username = reactive({ value: '', error: '' })
const password = reactive({ value: '', error: '' })
const globalError = ref('')

const authStore = useAuthStore()

const login = (event: Event) => {
  event.preventDefault()

  const credentials: LoginInput = {
    username: username.value,
    password: password.value,
  }
  username.error = ''
  password.error = ''

  let everythingIsFine = true
  if (!credentials.username) {
    username.error = 'Username is required'
    everythingIsFine = false
  }
  if (!credentials.password) {
    password.error = 'Password is required'
    everythingIsFine = false
  }
  if (!everythingIsFine) {
    return
  }

  authStore
    .login(credentials)
    .then(() => {
      router.push('/')
    })
    .catch((error) => {
      if (error.message === 'Network Error') {
        username.error = 'Network Error, please try again later.'
      }

      const errorMessage = error.response.data
      console.log(errorMessage.loginErr)
      if (errorMessage.loginErr) {
        const loginErr = errorMessage.loginErr
        username.error = loginErr.username || loginErr.email
        password.error = loginErr.password
      }
      if (errorMessage.includes('Email not found')) {
        username.error = '???'
      }
    })
}
</script>
