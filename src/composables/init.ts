import { PickWallInit } from './logic'

const init = new PickWallInit(document.body.offsetWidth, document.body.offsetHeight, 30)

export const config = computed(() => init.config.value)

export default init
