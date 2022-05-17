<template>
  <div>
    <v-button @click="logout" type="primary"> Logout </v-button>
  </div>
</template>

<script setup lang="ts">
import VButton from '@/components/VButton.vue'
import VInput from '@/components/VInput.vue'
import SvgIcon from '@/assets/icon24/bell.svg?component'
import { ref } from 'pinia/node_modules/vue-demi'
import { computed } from '@vue/reactivity'
import axios from 'axios'
import { useAuthStore } from '../stores/auth'
import router from '@/router'

const authStore = useAuthStore()

const logout = () => {
  authStore
    .logout()
    .then((response) => {
      router.push('/auth/login')
    })
    .catch((error) => {
      console.log(error) // TODO hier noch was anderes machen? wäre ja warscheinlich nen no connection error
    })
}

// TODO das funktioniert noch nicht :(
// axios.get("http://127.0.0.1:3000/api/posts?tag=nature", {withCredentials: true})
//   .then(response => {
//     console.log(response);
//   })
//   .catch(error => {
//     console.log(error);
//   })
</script>
