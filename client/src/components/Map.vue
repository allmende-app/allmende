<template>
  <div ref="mapContainer" class="location-selector"></div>
</template>

<script setup lang="ts">
import { onMounted, ref, type PropType } from 'vue'
import * as L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import type { Sighting } from '@/interfaces/types'

const props = defineProps({
  sightings: {
    type: Array as PropType<Sighting[]>,
    required: true,
  },
})

const mapContainer = ref(null)

const customMarker = L.icon({
  iconUrl: '/marker.svg',
  iconSize: [24, 35],
  iconAnchor: [12, 35],
})

onMounted(() => {
  // create map with leaflet
  if (!mapContainer.value) {
    return
  }
  let map = L.map(mapContainer.value, { center: [51.505, -0.09] })
  const markers: Array<L.Marker> = []
  for (const sighting of props.sightings) {
    if (sighting.lat && sighting.lng) {
      const marker = L.marker([sighting.lat, sighting.lng], {
        icon: customMarker,
      }).addTo(map)
      if (sighting.alt) {
        marker.bindPopup(sighting.alt)
      }
      markers.push(marker)
    } else {
      console.warn('No coordinates given for that sighting')
    }
  }

  // set correct zoom at the beginning
  if (markers.length > 0) {
    let group = L.featureGroup(markers)
    map.fitBounds(group.getBounds())
    map.zoomOut(0.6)
  }

  // reference to leaflet
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap',
  }).addTo(map)
})
</script>

<style lang="sass">

.location-selector
  height: 250px
  width: 100%
  border-radius: allmende.$radius-card

  .leaflet-control
    margin-right: 26px
</style>
