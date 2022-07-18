<template>
  <div class="placeholder">
    <div class="row1"></div>
    <div class="row2"></div>
    <div class="img"></div>
  </div>
</template>

<style lang="sass" scoped>
.placeholder
  width: 100%
  animation: glow 1.5s infinite ease-in-out
  &:nth-child(1)
    animation-delay: 200ms
  &:nth-child(2)
    animation-delay: 400ms
  &:nth-child(3)
    animation-delay: 600ms
  &:nth-child(4)
    animation-delay: 800ms


.row1, .row2
  padding-inline: allmende.$size-xxsmall

.row1::before, .row1::after, .row2::before
  content: ''
  display: inline-block
  width: 25%
  height: 16px
  background: var(--placeholder)
  border-radius: allmende.$radius-card

.row1::before
  width: 16px
  margin-inline-end: allmende.$size-xxxxsmall

.row2::before
  width: 15%

.img
  height: 557px
  background: var(--placeholder)
  border-radius: allmende.$radius-card
  position: relative
  &::after
    content: ''
    display: block
    position: absolute
    left: allmende.$size-xxxsmall
    right: allmende.$size-xxxsmall
    bottom: allmende.$size-xxxsmall
    height: 128px
    border-radius: allmende.$radius-card - allmende.$size-xxxsmall
    background: var(--layer-10)


// glow animation
@keyframes glow
  0%
    opacity: 1
  50%
    opacity: 0.65
  100%
    opacity: 1
</style>
