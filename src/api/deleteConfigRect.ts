import request from '~/composables/request'

function deleteConfigRect(id: number) {
  return request.delete<unknown, null, number>(`${id}`)
}

export {
  deleteConfigRect,
}
