<template>
  <div class="comments">
    <div class="add">
      <!-- TODO: set source correctly-->
      <profil-picture-vue :source="user.avatarUrl"></profil-picture-vue>
      <input
        type="text"
        name="comment"
        id="comment"
        placeholder="Add a comment"
        @keypress.enter="addComment"
      />
    </div>

    <div class="comment" v-for="comment in comments" :key="comment._id">
      <div class="meta">
        <v-creator-vue
          :name="comment.author.username"
          :user-id="comment.author._id"
          :author="comment.author"
          @click="visitAuthor(comment.author.username)"
        ></v-creator-vue>
        <span class="creation-time">
          {{ comment.createdAt }}
        </span>
      </div>

      <div class="content">
        {{ comment.body }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PropType, ref } from 'vue'
import type { Ref } from 'vue'
import ProfilPictureVue from './post/ProfilPicture.vue'
import VCreatorVue from './post/VCreator.vue'
import LogoSvg from '@/assets/logo.svg?component'
import { backend } from '../utils'
import {
  Comment,
  type ICommentDocument,
} from '../../../server/src/models/comment'
import { useAuthStore } from '../stores/auth'
import router from '../router'

/**
 * Props
 */
const props = defineProps({
  postId: {
    type: String as PropType<string>,
    required: true,
  },
})

const authStore = useAuthStore()
const user = authStore.user

const comments: Ref<Array<ICommentDocument>> = ref([])

// load comments
console.log("comments");
console.log(props.postId);

backend.client
  .get(`/api/comments/${props.postId}`)
  .then((response) => {
    const receivedComments = response.data.comments
    console.log(receivedComments);
    comments.value = receivedComments

  })
  .catch((error) => {
    console.log(error)
  })

/**
 * creats a new comment for the current post
 */
const addComment = () => {
  backend.client
    .post(`/api/comments/${props.postId}`, {
      comment: {
        body: 'this is a test comment',
      },
    })
    .then((response) => {
      const newComment = response.data.comment
      comments.value.push(newComment) // TODO wait for fix of inconstance using author as an object !
    })
    .catch((error) => {
      // TODO: handle error message
      console.log(error)
    })
}

const visitAuthor = (username: string) => {
  router.push(`/user/${username}`)
}
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
