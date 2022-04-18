<script setup lang="ts">

import { useVirtualList } from '@vueuse/core'

const allItems = Array.from({ length: 500 })
const { list, containerProps, wrapperProps } = useVirtualList(
  allItems,
  {
    itemHeight: 30,
  },
)
</script>

<template>
  <div v-bind="containerProps" style="height: 300px">
    <div v-bind="wrapperProps">
      <div v-for="item in list" :key="item.index" style="height: 30px">
        {{ item.index }}
      </div>
    </div>
  </div>
</template>
