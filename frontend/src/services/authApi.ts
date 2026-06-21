import type { User } from '../types'
import { API_BASE_URL, api, clearAuthToken, setAuthToken } from './api'

interface AuthResponse {
  user: User
  token: string
}

export const authApi = {
  async register(data: { name: string; email: string; password: string }) {
    const response = await api.post<AuthResponse>('/auth/register', data)
    setAuthToken(response.token)
    return response.user
  },

  async login(email: string, password: string) {
    const response = await api.post<AuthResponse>('/auth/login', { email, password })
    setAuthToken(response.token)
    return response.user
  },

  async me() {
    const response = await api.get<{ user: User }>('/auth/me')
    return response.user
  },

  async logout() {
    try {
      await api.post('/auth/logout')
    } finally {
      clearAuthToken()
    }
  },

  discordUrl() {
    return `${API_BASE_URL}/auth/discord`
  },
}
