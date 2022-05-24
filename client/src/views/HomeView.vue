<template>
  <div>
    <v-title />
    <div class="posts">
      <v-post text="Hallo ich bin ein post"> </v-post>
      <v-post text="Hallo ich bin ein post"> </v-post>
      <v-post text="Hallo ich bin ein post"> </v-post>
    </div>
  </div>
</template>

<script setup lang="ts">
import VPost from '@/components/post/VPost.vue'
import VTitle from '@/components/VTitle.vue'
</script>

<style lang="sass" scoped>
.posts
  width: 100%
  display: flex
  flex-direction: column
  align-items: center
  gap: allmende.$size-medium
  @include allmende.screen-laptop
    display: grid
    grid-template-columns: repeat(auto-fit, minmax(400px, 1fr))
    > .post
      margin-inline: auto
</style>
