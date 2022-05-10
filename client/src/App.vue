<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import VButton from './components/VButton.vue'
import VInput from './components/VInput.vue'

</script>

<template>
  <!-- <header>
    <img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="125" height="125" />

    <div class="wrapper">
      <HelloWorld msg="You did it!" />
      <div>
        <VButton type="primary">
          Label
        </VButton>
        <VButton type="primary" :disabled="true">
          Label
        </VButton>
      </div>
      <div>
        <VButton type="secondary">
          Label
        </VButton>
        <VButton type="secondary" :disabled="true">
          Label
        </VButton>
      </div>

      <VInput :error="error" helper-text="This is a helper text" label="Label" name="name" v-model="value"></VInput>

      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
      </nav>
    </div>
  </header> -->

  <RouterView />
</template>

<style lang="sass">
@import "./assets/sass/app"
</style>

<script lang="ts">

import { defineComponent } from "@vue/runtime-core";

export default defineComponent({
  data() {
    return {
      value: "test",
      error: true
    }
  },
  methods: {
    axios: () => {
      console.log("test");

    }
  },
  created() {
    // TODO catching 401 unauthorized errors
    // axios.interceptors.response.use(undefined, function (err) {
    //   return new Promise(function (resolve, reject) {
    //     if (err.status === 401 && err.config && !err.config.__isRetryRequest) {
    //     // if you ever get an unauthorized, logout the user
    //       this.$store.dispatch(AUTH_LOGOUT)
    //     // you can also redirect to /login if needed !
    //     }
    //     throw err;
    //   });
  // });
  },
})

</script>
