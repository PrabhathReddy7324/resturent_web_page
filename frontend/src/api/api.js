import axios from 'axios'

const baseURL = import.meta.env.VITE_API_URL || ''

const api = axios.create({
  baseURL: baseURL,
  headers: { 'Content-Type': 'application/json' },
})

// Attach JWT token to admin requests automatically
api.interceptors.request.use((config) => {
  // Ensure the URL starts with /api
  if (config.url && !config.url.startsWith('/api')) {
    config.url = '/api' + (config.url.startsWith('/') ? config.url : '/' + config.url)
  }

  const token = sessionStorage.getItem('admin_token')
  if (token && config.url.includes('/admin')) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default api
