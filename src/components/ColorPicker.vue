<script setup lang="ts">
import init from '~/composables/init'
const predefineColors = [
  '#ff4500',
  '#ff8c00',
  '#ffd700',
  '#90ee90',
  '#00ced1',
  '#1e90ff',
  '#c71585',
  '#000000',
  '#FFFFFF',
]

</script>

<template>
  <div flex bg-gray-400 justify-center rounded-3xl>
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
    </div>
  </div>
</template>
