<template>
  <div class="comments">
    <div class="add">
      <profil-picture-vue source="TODO"></profil-picture-vue>
      <input type="text" name="comment" id="comment" placeholder="Add a comment" @keypress.enter="addComment">
    </div>

    <div class="comment" v-for="comment in comments" :key="comment.id">
      <div class="meta">
        <v-creator-vue :name="comment.author" :user-id="comment.authorID"></v-creator-vue>
        <span class="creation-time">
          {{ comment.creationTime }}
        </span>
      </div>

      <div class="content">
        {{ comment.content }}
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'
import ProfilPictureVue from './post/ProfilPicture.vue';
import VCreatorVue from './post/VCreator.vue';

import LogoSvg from '@/assets/logo.svg?component'

const comments = [
  {
    id: 0,
    author: "David",
    authorID: 3,
    creationTime: "5min",
    content: "Once the city used to pulse with energy. Dirty and dangerous, but alive and wonderful."
  },
  {
    id: 1,
    author: "Jonas",
    authorID: 6,
    creationTime: "1h",
    content: "Now it's something else. 😍😍😍"
  },
  {
    id: 2,
    author: "Minh",
    authorID: 4,
    creationTime: "4h",
    content: "The changes came slowly at first. Most didn't realize, or didn't care, and accepted them."
  },

]

const addComment = () => {
  console.log("submit comment here");

}


// defineProps({
//   title: {
//     type: String as PropType<string>,
//     default: 'allmende',
//   },
// })
</script>

<style lang="sass" scoped>

.comments
  display: flex
  flex-direction: column
  gap: 4px

  border-radius: allmende.$radius-card
  overflow: hidden

  .comment, .add
    background-color: white
    padding: allmende.$size-xsmall
    @include allmende.text-footnote

  .add
    display: flex
    flex-direction: row
    justify-content: flex-start
    gap: allmende.$size-xxxsmall

    input
      width: 100%

  .meta
    display: flex
    flex-direction: row
    justify-content: space-between
    margin-bottom: allmende.$size-xxxsmall


    .creation-time
      color: var(--text-secondary)
</style>
