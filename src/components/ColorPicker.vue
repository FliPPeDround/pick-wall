<script setup lang="ts">
import { Sketch } from '@ckpack/vue-color'
// @ts-expect-error is right code
import { ClickOutside as vClickOutside } from 'element-plus'
import init from '~/composables/init'

// 自定义颜色
const buttonRef = ref()
const popoverRef = ref()
const onClickOutside = () => {
  unref(popoverRef).popperRef?.delayHide?.()
}
const colors = ref({
  hex8: '#000',
})
watch(colors, (newColor, _Color) => {
  init.pickColor(newColor.hex8)
}, { deep: true })

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

</script>

<template>
  <div flex bg="gray-400/80" justify-center rounded-3xl w130>
    <div flex="~ row">
      <div
        v-for="(color, index) in predefineColors"
        :key="index"
        :style="{backgroundColor: color}"
        m2
        w10 h10
        cursor-pointer
        rounded-full
        shadow-2xl transition-shadow
        hover:shadow-inner
        @click="init.pickColor(color)"
      />
      <div
        ref="buttonRef"
        v-click-outside="onClickOutside"
        m2
        w10 h10
        cursor-pointer
        rounded-full shadow-2xl
        transition-shadow hover:shadow-inner
        class="colorfull-picker"
      />
      <el-popover
        ref="popoverRef"
        placement="top"
        :virtual-ref="buttonRef"
        trigger="click"
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
