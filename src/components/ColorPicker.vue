<script setup lang="ts">
import { Sketch } from '@ckpack/vue-color'
import init from '~/composables/init'
const color = $computed(() => init.color.value)
</script>

<template>
  <div>
    <Sketch v-model="color" />
  </div>
</template>
