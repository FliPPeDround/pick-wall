<script setup lang="ts">
import type { BlockState } from '~/types'

const configKonva = {
  width: document.body.offsetWidth,
  height: document.body.offsetHeight,
}

const X = Math.ceil(document.body.offsetWidth / 40)
const Y = Math.ceil(document.body.offsetHeight / 40)

const configRects = reactive(
  Array.from({ length: Y }, (_, y) =>
    Array.from({ length: X },
      (_, x): BlockState => ({
        x: x * 40,
        y: y * 40,
        width: 40,
        height: 40,
        fill: '#FFF',
        stroke: '#000',
        strokeWidth: 1,
      }),
    ),
  ),
)

const ws = new WebSocket('ws://9.135.92.198:8080/websocket')

ws.onopen = function() {
  // Web Socket 已连接上，使用 send() 方法发送数据
  ws.send('发送数据')
}

ws.onmessage = function(evt) {
  const received_msg = evt.data
  console.log(received_msg)
}

// ws.onclose = function() {
//   // 关闭 websocket
//   alert('连接已关闭...')
// }

function handleClick(block: BlockState) {
  console.log(block)
  block.fill = '#000'
  ws.send(JSON.stringify(block))
}

</script>

<template>
  <v-stage :config="configKonva">
    <v-layer>
      <div
        v-for="row,y in configRects"
        :key="y"
      >
        <v-rect
          v-for="block, x in row"
          :key="x"
          :config="block"
          @click="handleClick(block)"
        />
      </div>
    </v-layer>
  </v-stage>
</template>
