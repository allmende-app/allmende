<template>
  <v-button type="primary" @click="logout()">
    Logout
  </v-button>
</template>

<script setup lang="ts">
import router from '../../router';
import { useAuthStore } from '../../stores/auth';
import VButton from '../VButton.vue';

const authStore = useAuthStore()

const logout = () => {
  authStore.logout()
    .then(response => {
      router.push("/auth/login")
    })
    .catch(error => {
      console.error("Error while logging out!");
    })
}

</script>

<style lang="sass" scoped>

</style>
