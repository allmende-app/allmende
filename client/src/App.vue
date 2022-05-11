<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import HelloWorld from '@/components/HelloWorld.vue'
import Button from '@/components/inputs/Button.vue'

import IconSvg from '@/assets/icon24/back.svg'

</script>

<template>
  <header>
    <img alt="Vue logo" class="logo" src="@/assets/logo.svg?url" width="125" height="125" />

    <div class="wrapper">
      <HelloWorld msg="You did it!" />

      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
      </nav>
    </div>
  </header>

  <div class="playground">
    <Button>Hello</Button>
    <Button><IconSvg /></Button>
  </div>

  <RouterView />
</template>

<style scoped lang="sass">
.playground
  display: inline-flex
  background: white
  flex-direction: column
  gap: 16px
  padding: 16px
</style>
