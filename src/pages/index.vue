<script setup lang="ts">
import init, { config } from '~/composables/init'
useResizeObserver(document.body, (entries) => {
  const entry = entries[0]
  const { width, height } = entry.contentRect
  init.reset(width, height)
})

</script>

<template>
  <v-stage
    :config="config.configKonva"
  >
    <v-layer>
      <div
        v-for="row,indexY in config.configRects"
        :key="indexY"
      >
        <v-rect
          v-for="block, indexX in row"
          :key="indexX"
          :config="block"
          @click="init.pickblock(block)"
          @dblclick="init.deleteBlock(block)"
        />
      </div>
    </v-layer>
  </v-stage>
  <ColorPicker absolute bottom-2 left-0 right-0 m-auto />
</template>
