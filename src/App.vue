<script lang="ts" setup>
import init from '~/composables/init'
const cursorStyle = $computed(() => init.cursorStyle)

document.oncontextmenu = (e) => {
  e.preventDefault()
}
</script>

<template>
  <main font-sans text="center gray-700 dark:gray-200" class="rect-box">
    <router-view />
  </main>
</template>

<style scoped>
.rect-box{
  cursor: v-bind(cursorStyle)
}
</style>
