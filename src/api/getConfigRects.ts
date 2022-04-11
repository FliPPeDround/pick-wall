import axios from 'axios'
import type { BlockState, State } from '~/types'

function getConfigRects(range: State) {
  return axios.post<unknown, BlockState[], State>('/api/getConfigRects', range)
}

export {
  getConfigRects,
}
