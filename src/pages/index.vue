<script setup lang="ts">
import { Sketch } from '@ckpack/vue-color'
import { vElementHover } from '@vueuse/components'
import axios from 'axios'
import type { BlockState, ResBlock } from '~/types'

const basurl = ''

const configKonva = reactive({
  width: document.body.offsetWidth,
  height: document.body.offsetHeight,
})

const X = Math.ceil(document.body.offsetWidth / 40)
const Y = Math.ceil(document.body.offsetHeight / 40)

useResizeObserver(document.body, (entries) => {
  const entry = entries[0]
  const { width, height } = entry.contentRect
  configKonva.width = width
  configKonva.height = height
})

const configRects = reactive(
  Array.from({ length: Y }, (_, y) =>
    Array.from({ length: X },
      (_, x): BlockState => ({
        x: x * 40,
        y: y * 40,
        width: 40,
        height: 40,
        fill: '#FFF',
        stroke: '#9B9B9B82',
        strokeWidth: 1,
      }),
    ),
  ),
)

const res = (await axios.get(`${basurl}/data`)).data.req as ResBlock[]
res.forEach((block) => {
  configRects[block.y][block.x].fill = block.fill
})

const ws = new WebSocket(`ws:${basurl}websocket`)

ws.onopen = function() {
  // Web Socket 已连接上，使用 send() 方法发送数据
  // ws.send('发送数据')
}

ws.onmessage = function(evt) {
  const received_msg = evt.data
  const block = JSON.parse(received_msg)
  configRects[block.y][block.x] = {
    ...configRects[block.y][block.x],
    fill: block.fill,
  }
}

// ws.onclose = function() {
//   // 关闭 websocket
//   alert('连接已关闭...')
// }

const color = ref({
  hex8: '#000',
})

function handleClick(block: BlockState) {
  if (block.fill === color.value.hex8)
    return
  block.fill = color.value.hex8

  ws.send(JSON.stringify(
    {
      x: block.x / 40,
      y: block.y / 40,
      fill: block.fill,
    },
  ))
}

const isHovered = ref(false)
function onHover(state: boolean) {
  console.log(state)

  isHovered.value = state
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
          v-element-hover="onHover"
          :config="block"
          @click="handleClick(block)"
        />
      </div>
    </v-layer>
  </v-stage>
  <Sketch v-model="color" />
  <button v-element-hover="onHover">
    {{ isHovered ? 'Thank you!' : 'Hover me' }}
  </button>
</template>
