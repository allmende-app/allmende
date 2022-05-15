<template>
  <auth-layout>
    <template v-slot:default>
      <p style="color: red">
        {{ error_message }}
      </p>
    </template>
    <template v-slot:inputs>
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
        autocomplete="current-password"
        v-model="password"
      ></v-input>
    </template>
    <template v-slot:buttons>
      <v-button @click="login"> Log in </v-button>

      <div class="router-link">
        <router-link to="/auth/register"> Create Acount </router-link>
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
import type { LoginInput } from '../../../server/src/interfaces/inputs'
import router from '@/router'
import { log } from 'console';

const email = ref('')
const password = ref('')
const error_message = ref('')

const authStore = useAuthStore()

const login = (event: Event) => {
  event.preventDefault()

  const credentials: LoginInput = {
    email: email.value,
    password: password.value,
  }
  authStore
    .login(credentials)
    .then(response => {
      router.push('/') // TODO backend does not check if password is correct !!!
    })
    .catch(error => {
      console.log(error);
      // TODO better error message system
      error_message.value = error.response.data
    })
}

const logout = (event: Event) => {
  event.preventDefault()
  authStore.logout()
    .then(response => {

      router.push('/auth/login')
    })
    .catch(error => {
      console.log(error);

    })
}
</script>
