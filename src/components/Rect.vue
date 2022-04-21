<script setup lang="ts">
const emit = defineEmits<{
  (e: 'rclick', evt: MouseEvent): void
  (e: 'lclick', evt: MouseEvent): void
  (e: 'over'): void
}>()

function whichButton(e: { evt: MouseEvent }) {
  const { evt } = e
  if (evt.button === 0)
    emit('lclick', evt)

  if (evt.button === 2)
    emit('rclick', evt)
}

const control = useKeyModifier('Control')
function overOn() {
  if (control.value)
    emit('over')
}
</script>

<template>
  <v-rect
    @mouseup="whichButton"
    @mouseover="overOn"
  />
</template>
