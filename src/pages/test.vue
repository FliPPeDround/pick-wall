<script setup lang="ts">
const el = ref(null)
const text = ref('')

useResizeObserver(document.body, (entries) => {
  const entry = entries[0]
  const { width, height } = entry.contentRect
  text.value = `width: ${width}, height: ${height}`
})

console.log(import.meta.env)

</script>

<template>
  <div ref="el">
    {{ text }}
  </div>
</template>
