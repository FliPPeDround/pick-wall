import request from '~/composables/request'
import type { BlockState, Rect } from '~/types'

function getConfigRects(range: Rect) {
  return request.post<unknown, BlockState[], Rect>('data/getConfigRects', range)
}

export {
  getConfigRects,
}
