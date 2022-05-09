<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import VButton from './components/VButton.vue'
import VInput from './components/VInput.vue'

</script>

<template>
  <header>
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

      <VInput error="I am the Error Message" helper-text="This is a helper text" label="Label" name="name" value="value"></VInput>

      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
      </nav>
    </div>
  </header>

  <RouterView />
</template>

<style lang="sass">
@import "./assets/sass/app"
</style>
