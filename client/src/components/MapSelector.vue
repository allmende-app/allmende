<template>
  <div ref="mapContainer" class="location-selector"></div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch, type PropType } from 'vue'
import * as L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { reverseLocationSearch } from '../utils'
import type { LocationInfo } from '@/interfaces/types'

const emit = defineEmits(['update:modelValue'])

const props = defineProps({
  modelValue: {
    type: [Object, null] as PropType<LocationInfo | null>,
    required: true,
  },
})

const mapContainer = ref(null)
var marker = ref(null as L.Marker | null)
var map = null as L.Map | null

const customMarker = L.icon({
  iconUrl: '/marker.svg',
  iconSize: [24, 35],
  iconAnchor: [12, 35],
})

const centerLeafletMapOnMarker = (marker: L.Marker) => {
  var latLngs = [marker.getLatLng()]
  var markerBounds = L.latLngBounds(latLngs)
  map.fitBounds(markerBounds)
  map.setZoom(15)
}

const setMarker = async (lat: number, lng: number) => {
  if (marker.value) marker.value.remove()
  marker.value = L.marker([lat, lng], {
    icon: customMarker,
  }).addTo(map)

  return marker.value
}

watch(
  () => props.modelValue,
  async (currentValue) => {
    if (currentValue) {
      const newMarker = await setMarker(currentValue?.lat, currentValue?.lng)
      centerLeafletMapOnMarker(newMarker)
    }
  },
)

onMounted(() => {
  // create map with leaflet
  if (!mapContainer.value) {
    return
  }

  // create map inside of map container
  map = L.map(mapContainer.value).setView([52.52437, 13.41053], 13) //   const markers: Array<L.Marker> = []

  // reposition marker on click
  const onMapClick = async (event) => {
    const newMarker = await setMarker(event.latlng.lat, event.latlng.lng)

    // make reverse location search
    const latlng = newMarker.getLatLng()
    const location = await reverseLocationSearch(latlng.lng, latlng.lat)
    console.log(location)

    emit('update:modelValue', location)
  }
  map.on('click', onMapClick)

  // reference to leaflet
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 17,
    attribution: '© OpenStreetMap',
  }).addTo(map)
})
</script>

<style lang="sass">

.location-selector
  height: 250px
  width: 100%
  border-radius: allmende.$radius-menu
  z-index: 0

  .leaflet-control
    margin-right: 26px
</style>
