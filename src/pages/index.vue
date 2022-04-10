<script setup lang="ts">
// import { Sketch } from '@ckpack/vue-color'
// import axios from 'axios'
// import type { BlockState, ResBlock } from '~/types'
import { PickWallInit } from '~/composables/logic'

const init = new PickWallInit(document.body.offsetWidth, document.body.offsetHeight, 30)
const config = $computed(() => init.config.value)

// const basurl = '//localhost:8080'
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

// const ws = new WebSocket(`ws:${basurl}/websocket`)

// ws.onmessage = function(evt) {
//   const received_msg = evt.data
//   const block = JSON.parse(received_msg)
//   configRects[block.y][block.x].fill = block.fill
// }

// // ws.onclose = function() {
// //   // 关闭 websocket
// //   alert('连接已关闭...')
// // }

// const color = ref({
//   hex8: '#000',
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
  <!-- <Sketch v-model="color" /> -->
</template>
