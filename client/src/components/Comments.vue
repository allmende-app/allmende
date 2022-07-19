<template>
  <div class="comments">
    <div class="add">
      <profil-picture-vue :source="user?.avatarUrl"></profil-picture-vue>
      <input
        type="text"
        name="comment"
        id="comment"
        placeholder="Add a comment"
        v-model="commentMessage"
        @keypress.enter="addComment"
      />
      <v-button
        v-if="commentMessage.length > 0"
        class="secondary"
        @click="addComment"
      >
        <SvgArrowLeft />
      </v-button>
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
          {{ formatDate(new Date(comment.createdAt)) }}
        </span>
      </div>

      <div class="content">
        {{ comment.body }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, type Ref, type PropType } from 'vue'
import ProfilPictureVue from './post/ProfilPicture.vue'
import VCreatorVue from './post/VCreator.vue'
import { backend } from '../utils'
import { useAuthStore } from '../stores/auth'
import router from '../router'
import { compareDesc } from 'date-fns'
import VButton from './VButton.vue'
import SvgArrowLeft from '@/assets/icon24/arrow-right.svg?component'
import { formatDate } from '@/utils'
import type { AllmendeComment } from '@/interfaces/types'

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
const emit = defineEmits(['comment-added'])

const authStore = useAuthStore()
const user = authStore.user

const comments: Ref<Array<AllmendeComment>> = ref([])
const commentMessage: Ref<string> = ref('')

/**
 * orders comments desc by creation time
 * @param a
 * @param b
 */
const orderDesc = (a: AllmendeComment, b: AllmendeComment) => {
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
      emit('comment-added')
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
  .comment
    padding-block: allmende.$size-xxxsmall

  .comment, .add
    background-color: white
    padding-inline: allmende.$size-xsmall
    @include allmende.text-footnote

  .add
    display: flex
    flex-direction: row
    justify-content: flex-start
    align-items: center
    gap: allmende.$size-xxxsmall

    input
      width: 100%
      height: fit-content
      height: allmende.$size-xlarge
      padding: allmende.$size-xxxsmall
      font-size: 16px
      border-radius: allmende.$radius-input
      outline: none

      &:focus
        border-color: var(--border-focus)

  .meta
    display: flex
    flex-direction: row
    justify-content: space-between
    margin-bottom: allmende.$size-xxxxsmall


    .creation-time
      color: var(--text-secondary)
</style>
