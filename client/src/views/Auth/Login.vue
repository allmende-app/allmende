<script setup lang="ts">
  import VInput from '@/components/VInput.vue'
  import VButton from '@/components/VButton.vue'
  import AuthLayout from '@/layouts/AuthLayout.vue'
  import { RouterLink } from 'vue-router'

</script>

<template>
  <auth-layout>
    <template v-slot:inputs>
      <v-input name="username" label="Username"></v-input>
      <v-input name="password" label="Password"></v-input>
    </template>
    <template v-slot:buttons>
      <v-button>
        Log in
      </v-button>

      <div class="router-link">
        <RouterLink to="/auth/register">
          Create Acount
        </RouterLink>
      </div>
    </template>
  </auth-layout>
</template>

<style lang="sass" scoped>
@import "../../assets/sass/config.sass"


</style>
