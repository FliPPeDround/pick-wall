<script setup lang="ts">

import { useVirtualList } from '@vueuse/core'

const allItems = Array.from({ length: 500 }, (_, y) =>
  Array.from({ length: 500 },
    (_, x) => ({
      x: x * 30,
      y: y * 30,
      width: 30,
      height: 30,
      fill: '#FFF',
      stroke: '#9B9B9B82',
      strokeWidth: 1,
    }),
  ),
)
const { list, containerProps, wrapperProps } = useVirtualList(
  allItems,
  {
    itemHeight: 30,
  },
)
</script>

<template>
  <v-stage
    :config="configKonva= {
      width: 500,
      height: 500,
    }"
  >
    <v-layer>
      <div v-bind="containerProps" style="height: 300px">
        <div v-bind="wrapperProps">
          <div v-for="item in list" :key="item.index" style="height: 30px">
            <v-rect
              v-for="block, indexX in row"
              :key="indexX"
              :config="block"
              @click="init.pickblock(block)"
              @dblclick="init.deleteBlock(block)"
            />
          </div>
        </div>
      </div>
    </v-layer>
  </v-stage>
</template>
