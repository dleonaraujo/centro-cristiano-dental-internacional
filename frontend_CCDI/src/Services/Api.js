import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api/',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Attach auth token if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// ── Patients ──────────────────────────────────────────────
export const patientService = {
  getAll:   (params) => api.get('patients/', { params }),
  getById:  (id)     => api.get(`patients/${id}/`),
  create:   (data)   => api.post('patients/', data),
  update:   (id, data) => api.put(`patients/${id}/`, data),
  patch:    (id, data) => api.patch(`patients/${id}/`, data),
  remove:   (id)     => api.delete(`patients/${id}/`),
}

// ── Workers ───────────────────────────────────────────────
export const workerService = {
  getAll:   (params) => api.get('workers/', { params }),
  getById:  (id)     => api.get(`workers/${id}/`),
  create:   (data)   => api.post('workers/', data),
  update:   (id, data) => api.put(`workers/${id}/`, data),
  patch:    (id, data) => api.patch(`workers/${id}/`, data),
  remove:   (id)     => api.delete(`workers/${id}/`),
}

// ── Stats ─────────────────────────────────────────────────
export const statsService = {
  get: () => api.get('stats/'),
}

export default api