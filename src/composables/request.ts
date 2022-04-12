import axios from 'axios'

const request = axios.create({
  baseURL: 'http://162.14.124.211:8020/api/',
  withCredentials: true,
})

request.interceptors.request.use((config) => {
  return config
})

request.interceptors.response.use(
  (response) => {
    if (response.status !== 200)
      alert(`response.status: ${response.status}`)

    return response.data.data
  },
  (error) => {
    if (error.response.status === 401)
      window.location.reload()
  },
)

export default request
