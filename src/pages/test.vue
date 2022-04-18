<script setup lang="ts">

import { Sketch } from '@ckpack/vue-color'
const colors = ref({
  hex: '#ff0000',
})
</script>

<template>
  <Sketch v-model="colors" />
  <!-- <div class="demo-color-block">
    <span class="demonstration">With default value</span>
    <el-color-picker v-model="color1" />
  </div> -->
  <!-- <ColorPicker absolute bottom-0 left-0 right-0 m-auto w115 /> -->
</template>
