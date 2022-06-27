<template>
  <div class="comments">
    <div class="add">
      <profil-picture-vue :source="user.avatarUrl"></profil-picture-vue>
      <input
        type="text"
        name="comment"
        id="comment"
        placeholder="Add a comment"
        v-model="commentMessage"
        @keypress.enter="addComment"
      />
    </div>

    <div
      class="comment"
      v-for="comment in comments.sort(orderDesc)"
      :key="comment._id"
    >
      <div class="meta">
        <v-creator-vue
          :name="comment.author.username"
          :user-id="comment.author._id"
          :author="comment.author"
          @click="visitAuthor(comment.author.username)"
        ></v-creator-vue>
        <span class="creation-time">
          {{
            formatDistance(new Date(comment.createdAt), new Date(), {
              addSuffix: true,
            })
          }}
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
import { compareDesc, formatDistance, subDays } from 'date-fns'
import { IUser } from '../../../server/src/models/user'

/**
 * Props
 */
const props = defineProps({
  postId: {
    type: String as PropType<string>,
    required: true,
  },
})

/**
 * Emits
 */
const emit = defineEmits(["comment-added"])

const authStore = useAuthStore()
const user: IUser = authStore.user

const comments: Ref<Array<ICommentDocument>> = ref([])
const commentMessage: Ref<string> = ref('')

/**
 * orders comments desc by creation time
 * @param a
 * @param b
 */
const orderDesc = (a: any, b: any) => {
  return compareDesc(new Date(a.createdAt), new Date(b.createdAt))
}

/**
 * load comments
 */
backend.client
  .get(`/api/comments/${props.postId}`)
  .then((response) => (comments.value = response.data.comments))
  .catch((error) => console.log(error))

/**
 * creats a new comment for the current post
 */
const addComment = () => {
  backend.client
    .post(`/api/comments/${props.postId}`, {
      comment: {
        body: commentMessage.value,
      },
    })
    .then((response) => {
      commentMessage.value = ''
      comments.value.push(response.data.comment)
      emit("comment-added")
    })
    .catch((error) => {
      // TODO: handle error message
      console.log(error)
    })
}

/**
 * visit comment creator
 */
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
