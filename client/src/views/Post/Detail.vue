<template>
  <div>

    <v-title-vue title="post">
      <template v-slot:left>
        <v-button :icon="ArrowLeftSVG" tooltip="Back" @click="back" />
      </template>
    </v-title-vue>

    <section class="section">
      <h2>
        Text, likes and comments (already existing)
      </h2>
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

    <section class="section">
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
import SightingVue from '@/components/post/Sighting.vue';
import VTitleVue from '@/components/VTitle.vue';
import VButton from '@/components/VButton.vue';
import router from '@/router';

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

const back = () => {
  router.back()
}
</script>

<style lang="sass" scoped>
.headline
  margin-bottom: allmende.$size-xxxsmall

.section
  margin-bottom: allmende.$size-small

</style>
