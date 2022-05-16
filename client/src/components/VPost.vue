<template>
  <div>

    <div id="header">
      <p id="creator">
        David
      </p>
      <p>
        5d
      </p>
      <div id="location">

      </div>
    </div>

    <!-- TODO: hier diesen image slider einbauen -->
    <image-slider>

    </image-slider>

    <div id="postbody">
      <p>
        post body text
      </p>
      <p>
        likes
      </p>
      <p>
        comment toggle
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PropType } from '@vue/runtime-core';
import ImageSlider from './ImageSlider.vue';

const props = defineProps({
  // TODO: use IPost here
  text: {
    type: String as PropType<string>,
    required: true
  },
  sightings: {
    type: Array,
    required: true
  },
  author: {
  },
  likes: {

  },
  comments: {

  },
  tags: {

  }

})

</script>

<style lang="sass" scoped>


</style>
