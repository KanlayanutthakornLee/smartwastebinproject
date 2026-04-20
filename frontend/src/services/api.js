import axios from 'axios'

const api = axios.create({ baseURL: '/api' })

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.clear()
      window.location.href = '/'
    }
    return Promise.reject(err)
  }
)

export const login = (data) => api.post('/auth/login', data)
export const getLocations = () => api.get('/bins/locations')
export const getBinHistory = (binId) => api.get(`/bins/${binId}`)
export const recordBin = (binId, data) => api.post(`/bins/${binId}/record`, data)
export const getUsers = () => api.get('/users')
export const assignLocation = (userId, location_id) =>
  api.patch(`/users/${userId}/location`, { location_id })