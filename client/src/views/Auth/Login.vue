<template>
  <auth-layout>
    <template v-slot:inputs>
      <v-input name="username" label="Username" v-model="username"></v-input>
      <v-input name="password" label="Password" type="password" v-model="password"></v-input>
    </template>
    <template v-slot:buttons>
      <v-button @click="login">
        Log in
      </v-button>

      <div class="router-link">
        <router-link to="/auth/register">
          Create Acount
        </router-link>
      </div>
    </template>
  </auth-layout>
</template>


<script lang="ts">
import { defineComponent } from "@vue/runtime-core";
import {ref} from 'vue'
import VInput from '@/components/VInput.vue'
import VButton from '@/components/VButton.vue'
import AuthLayout from '@/layouts/AuthLayout.vue'
import { RouterLink } from 'vue-router'
import { useAuthStore } from '../../stores/auth';
import { Credentials } from '../../interfaces/auth';
import router from "@/router";

export default defineComponent({

  components: {
    VInput,
    VButton,
    AuthLayout
  },

  setup() {

    const username = ref("")
    const password = ref("")

    const authStore = useAuthStore()

    const login = (event: Event) => {
      event.preventDefault()
      console.log("[WIP] login");

      const credentials : Credentials = {username: username.value, password: password.value}
      authStore.login(credentials)
        .then(() => {
          router.push("/")
        })
        .catch(() => {
          // TODO: show errors in form
        });
    }

    const logout = (event: Event) => {
      event.preventDefault()
      authStore.logout()
        .then(() => {
          router.push("/auth/login")
        })
    }

    return {authStore, login, username, password}
  },
})
</script>
