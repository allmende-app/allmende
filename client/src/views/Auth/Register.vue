<template>
  <auth-layout>
    <template v-slot:inputs>
      <v-input name="username" label="Username" v-model="username"></v-input>
      <v-input
        name="password"
        label="Password"
        type="password"
        v-model="password"
      ></v-input>
      <v-input
        name="repeat-password"
        label="Repeat password"
        type="password"
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

<script lang="ts">
import { defineComponent } from '@vue/runtime-core'
import { ref } from 'vue'
import VInput from '@/components/VInput.vue'
import VButton from '@/components/VButton.vue'
import AuthLayout from '@/layouts/AuthLayout.vue'

export default defineComponent({
  components: {
    VInput,
    VButton,
    AuthLayout,
  },

  setup(props) {
    const username = ref('')
    const password = ref('')
    const password_confirm = ref('')

    const sendRequest = (event: Event) => {
      event.preventDefault()

      // TODO send ajax request to server here...
      console.log('[WIP] sending ajax request')
    }

    return { username, password, password_confirm, sendRequest }
  },
})
</script>

<style lang="sass" scoped></style>
