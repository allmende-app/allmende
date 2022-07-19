<template>
  <div class="error-wrapper">
    <div class="error">
      <span class="error-code">{{ props.errorCode }}</span>
      <h1>{{ props.errorMessage }}</h1>
    </div>
    <p class="getting-back">
      Take me to
      <router-link to="/"> home </router-link>
    </p>
  </div>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'

const props = defineProps({
  errorCode: {
    type: Number as PropType<number>,
    required: true,
  },
  errorMessage: {
    type: String as PropType<string>,
    required: false,
    default: 'Ups there was an Error.',
  },
})
</script>

<style lang="sass" scoped>

.error-wrapper
  position: relative
  .error
    height: 100vh
    display: flex
    flex-direction: column
    justify-content: center
    align-items: center
    gap: 30px

    .error-code
      font-size: 300%

  .getting-back
    position: absolute
    content: ""
    bottom: 20px
    left: 50%
    transform: translateX(-50%)
</style>
