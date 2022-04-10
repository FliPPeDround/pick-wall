import { config } from './init'

const baseUrl = import.meta.env.VITE_SOCKET_URL

const ws = new WebSocket(`ws:${baseUrl}/websocket`)

ws.onmessage = function(evt) {
  const received_msg = evt.data
  const block = JSON.parse(received_msg)
  config.configRects[block.y][block.x].fill = block.fill
}

// ws.onclose = function() {
//   // 关闭 websocket
//   alert('连接已关闭...')
// }

export default ws
