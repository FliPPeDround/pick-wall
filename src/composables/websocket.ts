import { config } from './init'

const baseUrl = import.meta.env.VITE_SOCKET_URL

const ws = new WebSocket(`ws:${baseUrl}/websocket`)

ws.onopen = function() {
  // Web Socket 已连接上，使用 send() 方法发送数据
}

ws.onmessage = function(evt) {
  const received_msg = evt.data
  const block = JSON.parse(received_msg)
  config.configRects[block.y][block.x].fill = block.fill
}

ws.onclose = function() {
  // 关闭 websocket
  alert('连接已关闭...')
}

export default ws
