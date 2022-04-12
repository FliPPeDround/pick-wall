<script setup lang="ts">
import init, { config } from '~/composables/init'

useResizeObserver(document.body, (entries) => {
  const entry = entries[0]
  const { width, height } = entry.contentRect
  init.reset(width, height)
})

let startPoint = {
  x: 0,
  y: 0,
}

let movePoint = {
  x: 0,
  y: 0,
}

const { x, y } = useMouse()
const { pressed } = useMousePressed()

function onDragStart() {
  startPoint = {
    x: x.value,
    y: y.value,
  }
}

function onDragMove() {
  if (!pressed.value)
    return
  movePoint = {
    x: startPoint.x - x.value,
    y: startPoint.y - y.value,
  }
  init.draggable(movePoint)
}
</script>

<template>
  <v-stage
    :config="config.configKonva"
  >
    <v-layer
      @mousedown="onDragStart"
      @mousemove="onDragMove"
    >
      <div
        v-for="row,indexY in config.configRects"
        :key="indexY"
      >
        <v-rect
          v-for="block, indexX in row"
          :key="indexX"
          :config="block"
          @click="init.pickblock(block)"
        />
      </div>
    </v-layer>
  </v-stage>
  <ColorPicker absolute bottom-2 left-0 right-0 m-auto w130 />
</template>
