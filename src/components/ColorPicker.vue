<script setup lang="ts">
import { Sketch } from '@ckpack/vue-color'
import { ClickOutside as vClickOutside } from 'element-plus'
import chroma from 'chroma-js'

// 自定义颜色
const buttonRef = ref()
const popoverRef = ref()
function onClickOutside() {
  unref(popoverRef).popperRef?.delayHide?.()
}
const colors = ref({
  hex8: '#000',
})

const predefineColors = [
  '#ff4500',
  '#ff8c00',
  '#ffd700',
  '#90ee90',
  '#00ced1',
  '#1e90ff',
  '#c71585',
  '#000000',
]

function generateGradientCSS(primaryColor: string) {
  // 你可以根据需要调整这些颜色值
  const color1 = chroma(primaryColor)
  const color2 = color1.saturate(3) // 调亮
  const color3 = color1.desaturate(4) // 调暗

  const css = `linear-gradient(225deg, ${color1} 0%, ${color2} 46%, ${color3} 100%)`

  return {
    background: css,
  }
}
</script>

<template>
  <div bg="gray-400/80" w130 flex justify-center rounded-3xl>
    <div flex="~ row">
      <div
        v-for="(color, index) in predefineColors"
        :key="index"
        :style="{ backgroundColor: color }"
        m2 h10 w10 cursor-pointer rounded-full shadow-2xl transition-shadow hover:shadow-inner
      />
      <div
        ref="buttonRef"
        v-click-outside="onClickOutside"
        m2 h10 w10 cursor-pointer rounded-full shadow-2xl transition-shadow hover:shadow-inner
        :style="generateGradientCSS(colors.hex8)"
      />
      <el-popover
        ref="popoverRef"
        placement="top"
        :virtual-ref="buttonRef"
        trigger="hover"
        virtual-triggering
        :show-arrow="false"
      >
        <template #default>
          <Sketch v-model="colors" />
        </template>
      </el-popover>
    </div>
  </div>
</template>

<style scoped>
.colorfull-picker {
  background: linear-gradient(225deg, #4158D0 0%, #C850C0 46%, #FFCC70 100%);
}
</style>

<style>
.el-popover {
  padding: 0 !important;
  margin: 0 !important;
  width: 0 !important;
}
</style>
