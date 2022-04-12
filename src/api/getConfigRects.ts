import request from '~/composables/request'
import type { BlockState, State } from '~/types'

function getConfigRects(range: State) {
  return request.post<unknown, BlockState[], State>('data/getConfigRects', range)
}

export {
  getConfigRects,
}
