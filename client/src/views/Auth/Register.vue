<script setup lang="ts">
  import VInput from '@/components/VInput.vue'
  import VButton from '@/components/VButton.vue'
  import AuthLayout from '@/layouts/AuthLayout.vue'

</script>

<template>
  <auth-layout>
    <template v-slot:inputs>
      <v-input name="username" label="Username"></v-input>
      <v-input name="password" label="Password"></v-input>
      <v-input name="repeat-password" label="Repeat password"></v-input>
    </template>
    <template v-slot:buttons>
      <v-button>
        Create account
      </v-button>

      <div class="router-link">
        <RouterLink to="/auth/login">
          Log in instead
        </RouterLink>
      </div>
    </template>
  </auth-layout>
</template>

<style lang="sass" scoped>

</style>
