<template>
  <auth-layout>
    <template v-slot:default>
      <p style="color: red">
        {{ globalError }}
      </p>
    </template>
    <template v-slot:inputs>
      <v-input
        name="email"
        label="Email"
        v-model="email.value"
        :error="email.error"
        autocomplete="email"
      />
      <v-input
        name="username"
        label="Username"
        v-model="username.value"
        :error="username.error"
        autocomplete="username"
      />
      <v-input
        name="password"
        label="Password"
        type="password"
        autocomplete="new-password"
        v-model="password.value"
        :error="password.error"
      />
      <v-input
        name="repeat-password"
        label="Repeat password"
        type="password"
        autocomplete="new-password"
        v-model="confirmPassword.value"
        :error="confirmPassword.error"
      />
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
import { reactive, ref } from 'vue'
import VInput from '@/components/VInput.vue'
import VButton from '@/components/VButton.vue'
import AuthLayout from '@/layouts/AuthLayout.vue'
import { useAuthStore } from '../../stores/auth'
import router from '@/router'
import type { RegisterInput } from '@/interfaces/inputs'

const username = reactive({ value: '', error: '' })
const password = reactive({ value: '', error: '' })
const email = reactive({ value: '', error: '' })
const confirmPassword = reactive({ value: '', error: '' })
const globalError = ref('')

const authStore = useAuthStore()

const sendRequest = (event: Event) => {
  event.preventDefault()
  const registerData: RegisterInput = {
    username: username.value,
    email: email.value,
    password: password.value,
    confirmPassword: confirmPassword.value,
  }

  username.error = ''
  password.error = ''
  email.error = ''
  confirmPassword.error = ''
  globalError.value = ''

  let everythingIsFine = true
  if (!registerData.username) {
    username.error = 'Username is required'
    everythingIsFine = false
  }
  if (!registerData.email) {
    email.error = 'Email is required'
    everythingIsFine = false
  }
  if (!registerData.password) {
    password.error = 'Password is required'
    everythingIsFine = false
  }
  if (!registerData.confirmPassword) {
    confirmPassword.error = 'Confirm password is required'
    everythingIsFine = false
  }
  if (registerData.password !== registerData.confirmPassword) {
    confirmPassword.error = 'Passwords do not match'
    everythingIsFine = false
  }
  if (!everythingIsFine) {
    return
  }

  authStore
    .register(registerData)
    .then(() => {
      router.push('/')
    })
    .catch((error) => {
      const errorMessage = error.response.data
      if (errorMessage instanceof Object) {
        if (errorMessage.message.includes('username')) {
          username.error = 'Username is required'
        } else {
          globalError.value = errorMessage.message
        }
      } else if (errorMessage.includes('EmailError')) {
        email.error = 'Email address is not valid'
      } else if (errorMessage.includes('Email address already exists')) {
        email.error = 'Email address is already in use'
      } else if (errorMessage.includes('Username already exists')) {
        username.error = 'Username is already in use'
      } else if (errorMessage.includes('confirm password')) {
        confirmPassword.error = "Passwords don't match"
      } else if (errorMessage.includes('Password')) {
        password.error = errorMessage
      } else {
        globalError.value = errorMessage
      }
    })
}
</script>

<style lang="sass" scoped></style>
