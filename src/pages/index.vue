<script setup lang="ts">
import type { Ref } from 'vue'
import init, { config } from '~/composables/init'
useResizeObserver(document.body, (entries) => {
  const entry = entries[0]
  const { width, height } = entry.contentRect
  init.reset(width, height)
})
interface KonvaStage {
  getStage (): any
}
const stageRef = ref(null) as Ref<KonvaStage|null>

const debouncedFn = useDebounceFn(() => {
  const favicon = stageRef.value!.getStage().toDataURL()
  useFavicon(favicon)
}, 5000, { maxWait: 10000 })

const changeFavicon = async() => {
  debouncedFn()
}

</script>

<script>

</script>

<template>
  <v-stage
    ref="stageRef"
    :config="config.configKonva"
  >
    <v-layer>
      <div
        v-for="row,indexY in config.configRects"
        :key="indexY"
      >
        <Rect
          v-for="block, indexX in row"
          :key="indexX"
          :config="block"
          @lclick="init.pickblock(block)"
          @rclick="init.deleteBlock(block)"
          @over="init.pickblock(block),changeFavicon()"
          @click="changeFavicon"
        />
      </div>
    </v-layer>
  </v-stage>
  <ColorPicker absolute bottom-2 left-0 right-0 m-auto />
</template>
