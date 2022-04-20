<script setup lang="ts">
const emit = defineEmits<{
  (e: 'rclick', evt: MouseEvent): void
  (e: 'lclick', evt: MouseEvent): void
}>()

function whichButton(e: { evt: MouseEvent }) {
  const { evt } = e
  if (evt.button === 0)
    emit('lclick', evt)

  if (evt.button === 2)
    emit('rclick', evt)
}
</script>

<template>
  <v-rect
    @mouseup="whichButton"
  />
</template>
