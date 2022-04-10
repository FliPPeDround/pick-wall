import axios from 'axios'

function getConfigRects(range) {
  return axios.post('/api/getConfigRects')
}

export {
  getConfigRects,
}
