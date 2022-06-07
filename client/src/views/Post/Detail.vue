<template>
  <div>

    <v-title-vue title="post">
      <template v-slot:left>
        <v-button :icon="ArrowLeftSVG" tooltip="Back" @click="back" />
      </template>
    </v-title-vue>

    <section class="section">
      <div class="post-text">
        {{ text }}
      </div>
      <action-buttons
        :likes="likes"
        :liked="false"
        @likesClicked="toggleLike"
        :comments="comments.length"
        @commentsClicked="scrollToComments"
      ></action-buttons>
    </section>

    <section class="section">
      <h2 class="headline">
        Map
      </h2>
      <map-vue></map-vue>
    </section>

    <section
      class="section"
      v-for="sighting in sightings"
      :key="sighting.id"
    >
      <sighting-vue
        :location="sighting.location"
        :name="sighting.name"
        :specie="sighting.specie"
        :source="sighting.source"
      ></sighting-vue>
    </section>

    <section class="section" id="comments">
      <h2 class="headline">
        Comments
      </h2>
      <comments-vue>

      </comments-vue>
    </section>
  </div>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'
import MapVue from '@/components/Map.vue';
import CommentsVue from '@/components/Comments.vue';
import ArrowLeftSVG from '@/assets/icon24/arrow-left.svg?component'
import SvgLike from '@/assets/icon24/like.svg?component'
import SvgComment from '@/assets/icon24/comment.svg?component'
import SightingVue from '@/components/post/Sighting.vue';
import VTitleVue from '@/components/VTitle.vue';
import VButton from '@/components/VButton.vue';
import router from '@/router';
import ActionButtons from '@/components/ActionButtons.vue';
import { log } from 'console';

const props = defineProps({
  postID: {
    type: String as PropType<string>,
    required: true,
  }
})

// TODO: request post data from server if not already loaded ...
console.log(props.postID);

const sightings = [
  {
    id: 1,
    source: "/geese.JPG",
    location: "Schlosspark Charlottenburg Berlin",
    name: "Domestic European geese",
    specie: "Anser anser domesticus"
  },
  {
    id: 2,
    source: "/common_snipe.JPG",
    location: "Schlosspark Charlottenburg Berlin",
    name: "Common snipe",
    specie: "Gallinago gallinago"
  }
]

const text = `Once the city used to pulse with energy. Dirty and dangerous, but
            alive and wonderful. Now it's something else. The changes came
            slowly at first. Most didn't realize, or didn't care, and accepted
            them. They chose a comfortable life. Some didn't. And those who
            refused to conform were pushed to the sidelines, criminalized. They
            became our clients. We call ourselves Runners. We exist on the edge
            between the gloss and the reality: the mirror's edge. We keep out of
            trouble, out of sight, and the cops don't bother us. Runners see the
            city in a different way. We see the flow. Rooftops become pathways
            and conduits, possibilities and routes of escape. The flow is what
            keeps us running, keeps us alive.`

const back = () => {
  router.back()
}

const toggleLike = () => {
  // TODO: toggle like here
}

const scrollToComments = () => {
  // TODO: scroll to comment does not work on mobil yet
  router.replace("/detail#comments")
}

const comments = [1, 2, 3, 4]
const likes = 12

</script>

<style lang="sass" scoped>
.headline
  margin-bottom: allmende.$size-xxxsmall

.section
  margin-bottom: allmende.$size-small

.post-text
  @include allmende.text-body
  padding: allmende.$size-medium
  background-color: white
  border-radius: allmende.$radius-card
  margin-bottom: allmende.$size-xxxsmall

</style>
