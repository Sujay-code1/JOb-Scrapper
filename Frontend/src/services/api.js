import axios from 'axios'

const API_BASE =  'https://job-scrapper-kfq0.onrender.com/api'

const apiClient = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

const request = async (path, method = 'GET', data, token) => {
  try {
    const config = {
      method,
      url: path,
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
    throw new Error(message, { cause: error })
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
