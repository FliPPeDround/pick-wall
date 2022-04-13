import request from '~/composables/request'
import type { Point } from '~/types'

function deleteConfigRect(point: Point) {
  return request.post<unknown, null, Point>('/api/deleteConfigRect', point)
}

export {
  deleteConfigRect,
}
