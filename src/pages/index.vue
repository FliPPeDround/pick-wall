<script setup lang="ts">
import init, { config } from '~/composables/init'

useResizeObserver(document.body, (entries) => {
  const entry = entries[0]
  const { width, height } = entry.contentRect
  init.reset(width, height)
})

// onMounted(async() => {
//   const res = (await axios.get(`${basurl}/data`)).data.data as ResBlock[]
//   res.forEach((block) => {
//     configRects[block.y][block.x].fill = block.fill
//   })
// })

</script>

<template>
  <v-stage :config="config.configKonva">
    <v-layer>
      <div
        v-for="row,y in config.configRects"
        :key="y"
      >
        <v-rect
          v-for="block, x in row"
          :key="x"
          :config="block"
          @click="init.pickblock(block)"
        />
      </div>
    </v-layer>
  </v-stage>
</template>
