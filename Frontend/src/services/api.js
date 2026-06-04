import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_BASE_URL || (import.meta.env.DEV ? 'http://localhost:5000/api' : undefined)

if (!API_BASE) {
  throw new Error('Missing VITE_API_BASE_URL. Set this environment variable to your backend API base URL in production.')
}

console.info('[API] baseURL:', API_BASE)

const apiClient = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

const request = async (path, method = 'GET', data, token) => {
  const endpoint = path.startsWith('/') ? path : `/${path}`
  const url = `${API_BASE}${endpoint}`

  try {
    const config = {
      method,
      url: endpoint,
      data,
      headers: {},
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    const response = await apiClient(config)
    return response.data
  } catch (error) {
    const message = error?.response?.data?.message || error.message || 'API error'
    const detail = error?.response
      ? `${message} (url: ${url}, status: ${error.response.status})`
      : `${message} (url: ${url})`
    throw new Error(detail, { cause: error })
  }
}

export const authApi = {
  register: (payload) => request('/auth/register', 'POST', payload),
  login: (payload) => request('/auth/login', 'POST', payload),
  logout: () => request('/auth/logout', 'POST', null),
}

export const profileApi = {
  getProfile: (token) => request('/profile', 'GET', null, token),
  updateProfile: (payload, token) => request('/profile', 'PUT', payload, token),
  deleteImage: (token) => request('/profile/image', 'DELETE', null, token),
}

export const jobApi = {
  scrape: (payload, token) => request('/jobs/scrape', 'POST', payload, token),
}

export const applicationApi = {
  add: (payload, token) => request('/applications', 'POST', payload, token),
  getAll: (token) => request('/applications', 'GET', null, token),
}
