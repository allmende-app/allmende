<script setup lang="ts">
import VInput from '@/components/VInput.vue'
import VButton from '@/components/VButton.vue'
import AuthLayout from '@/layouts/AuthLayout.vue'
import { RouterLink } from 'vue-router'
</script>

<template>
  <div class="layout">
    <h1 class="headline">allmende</h1>
    <div class="content">
      <div class="auth">
        <form action="/" method="post">
          <div class="input-wrapper">
            <slot name="inputs"></slot>
          </div>

          <div class="button-wrapper">
            <slot name="buttons"></slot>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style lang="sass">
.layout
  background-color: var(--layer-20)
  background-image: url("/images/logo.svg")
  background-repeat: no-repeat
  background-position-x: 40px
  background-position-y: -200px
  // TODO: make logo position responsible
  min-height: 100vh
  height: 100%
  width: 100%

  .headline
    width: 100%
    padding: 15vh 0
    text-align: center

  .content
    width: 100%

    .auth
      display: flex
      flex-direction: column
      align-items: center
      justify-content: center

      padding: 20px
      form
        .input-wrapper
          display: flex
          flex-direction: column
          align-items: center

          & > div
            margin-bottom: 20px

        .button-wrapper
          align-self: flex-end

          display: flex
          flex-direction: row-reverse
          justify-content: flex-start

          .router-link
            display: flex
            justify-content: center
            align-items: center

            & > a
              padding: 8px
              color: var(--text-primary)
              @include allmende.text-action
              text-decoration-line: none

          & > *
            margin-left: 16px
</style>
