<script setup lang="ts">
  import VInput from '@/components/VInput.vue'
  import VButton from '@/components/VButton.vue'
  import AuthLayout from '@/layouts/AuthLayout.vue'
  import { RouterLink } from 'vue-router'

</script>

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

export default defineComponent({
  data() {
    return {
      username: "",
      password: "",
    }
  },

  methods: {
    login: function(event: Event) {
      event.preventDefault()

      console.log("login")
    }
  },
})
</script>

<style lang="sass" scoped>
@import "../../assets/sass/config.sass"


</style>
