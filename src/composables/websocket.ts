import { config } from './init'

const baseUrl = import.meta.env.VITE_SOCKET_URL

const ws = new WebSocket(`ws:${baseUrl}/websocket`)

ws.onopen = function() {
}

ws.onmessage = function(evt) {
  const received_msg = evt.data
  const block = JSON.parse(received_msg)
  config.configRects[block.y][block.x].fill = block.fill
}

ws.onclose = function() {
  // 关闭 websocket
}

export default ws
