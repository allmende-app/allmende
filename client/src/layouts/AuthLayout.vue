<script setup lang="ts">
import LogoSvg from '@/assets/logo.svg?component'
</script>

<template>
  <div class="layout" data-theme="dark">
    <h1 class="headline">
      <span>allmende<LogoSvg /></span>
    </h1>
    <div class="content">
      <div class="auth">
        <slot name="default"></slot>
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
  background-repeat: no-repeat
  background-position-x: 40px
  background-position-y: -200px
  // TODO: make logo position responsive
  min-height: 100vh
  height: 100%
  width: 100%

  .headline
    @include allmende.text-navbar
    width: 100%
    padding: 15vh 0
    text-align: center
    overflow: hidden
    span
      position: relative
      z-index: 1
      > svg
        position: absolute
        color: var(--layer-05)
        left: -130px
        top: -370px
        width: 557px
        height: 557px
        z-index: -1

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
