<template>
  <div ref="mapContainer" class="location-selector">
  </div>
</template>

 <script setup lang="ts">
  import { onMounted, PropType, ref } from 'vue'
  import * as L from 'leaflet'
  import 'leaflet/dist/leaflet.css'

  const props = defineProps({
    wayPoints: {
      type: Array as PropType<Array<object>>,
      required: true
    }
  })

  const mapContainer = ref(null)

  onMounted(() => {

    // create map with leaflet
    if (!mapContainer.value) { return }
    let map = L.map(mapContainer.value, { center: [51.505, -0.09] })
    const markers = []
    for (const wayPoint of props.wayPoints) {
      const marker = L.marker([wayPoint.lat, wayPoint.long])
      markers.push(marker)
      marker.addTo(map);
    }

    // set correct zoom at the beginning
    let group = L.featureGroup(markers);
    map.fitBounds(group.getBounds());
    map.zoomOut(0.6)

    // reference to leaflet
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19, attribution: '© OpenStreetMap', }).addTo(map)
  })
</script>

<style lang="sass" scoped>
.map
  width: 100%
  border-radius: allmende.$radius-card

.location-selector
  height: 250px

</style>
