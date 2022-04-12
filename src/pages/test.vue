<script setup lang="ts">
const { x, y } = useMouse({})

</script>

<template>
  {{ x }}
  {{ y }}
  <ColorPicker absolute bottom-0 left-0 right-0 m-auto w115 />
</template>
