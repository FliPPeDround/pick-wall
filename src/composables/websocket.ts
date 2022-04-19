import init, { config } from './init'

// const baseUrl = import.meta.env.VITE_SOCKET_URL

const ws = new WebSocket('ws://9.135.92.198:8080/api/websocket')

ws.onopen = function() {
}

ws.onmessage = function(evt) {
  const received_msg = evt.data
  const block = JSON.parse(received_msg)
  const moveX = config.value.configRects[0][0].x / init.rectLen
  const moveY = config.value.configRects[0][0].y / init.rectLen

  if (config.value.configRects?.[block.y - moveY]?.[block.x - moveX])
    config.value.configRects[block.y - moveY][block.x - moveX].fill = block.fill
}

ws.onclose = function() {
  // 关闭 websocket
}

export default ws
