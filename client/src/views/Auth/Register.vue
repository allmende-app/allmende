<script setup lang="ts">
  import VInput from '@/components/VInput.vue'
  import VButton from '@/components/VButton.vue'
  import AuthLayout from '@/layouts/AuthLayout.vue'

</script>

<template>
  <auth-layout>
    <template v-slot:inputs>
      <v-input name="username" label="Username" v-model="username"></v-input>
      <v-input name="password" label="Password" type="password" v-model="password"></v-input>
      <v-input name="repeat-password" label="Repeat password" type="password" v-model="password_confirm"></v-input>
    </template>
    <template v-slot:buttons>
      <v-button @click="sendRequest">
        Create account
      </v-button>

      <div class="router-link">
        <router-link to="/auth/login">
          Log in instead
        </router-link>
      </div>
    </template>
  </auth-layout>
</template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";
import { ref } from 'vue';

export default {
  data() {
    return {
      username: "",
      password: "",
      password_confirm: "",
    }
  },
  methods: {
    validateRequest() {
      if ("" == (this.username && this.password && this.password_confirm)) {
        return false // TODO: use server side validation ??
      }
    },

    sendRequest(event: Event) {
      event.preventDefault()

      if (this.validateRequest()) {
        console.error("validation error");
        return;
      }

      // TODO send ajax request to server here...
      console.log("[WIP] sending ajax request");
    }
  },
}
</script>

<style lang="sass" scoped>

</style>
