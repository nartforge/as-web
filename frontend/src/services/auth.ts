import { User } from '../types'
import { authApi } from './authApi'
import { clearAuthToken, getAuthToken, setAuthToken } from './api'

const STORAGE_KEY = 'nartforge_users'
const SESSION_KEY = 'nartforge_session'

function getUsers(): (User & { passwordHash: string })[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
  } catch {
    return []
  }
}

function saveUsers(users: (User & { passwordHash: string })[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users))
}

async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(password)
  const hash = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('')
}

export const authService = {
  async register(data: { name: string; email: string; password: string }): Promise<User> {
    try {
      const user = await authApi.register(data)
      localStorage.setItem(SESSION_KEY, JSON.stringify(user))
      return user
    } catch (error) {
      if (getAuthToken()) clearAuthToken()
      console.warn('Backend register unavailable, using local fallback', error)
    }

    const users = getUsers()
    if (users.find(u => u.email === data.email)) {
      throw new Error('Email already registered')
    }
    const passwordHash = await hashPassword(data.password)
    const user: User & { passwordHash: string } = {
      id: `user_${Date.now()}`,
      name: data.name,
      email: data.email,
      passwordHash,
      provider: 'email',
      role: 'user',
      createdAt: new Date().toISOString(),
    }
    users.push(user)
    saveUsers(users)
    const { passwordHash: _, ...safe } = user
    localStorage.setItem(SESSION_KEY, JSON.stringify(safe))
    return safe
  },

  async login(email: string, password: string): Promise<User> {
    try {
      const user = await authApi.login(email, password)
      localStorage.setItem(SESSION_KEY, JSON.stringify(user))
      return user
    } catch (error) {
      if (getAuthToken()) clearAuthToken()
      console.warn('Backend login unavailable, using local fallback', error)
    }

    const users = getUsers()
    const passwordHash = await hashPassword(password)
    const found = users.find(u => u.email === email && u.passwordHash === passwordHash)
    if (!found) throw new Error('Invalid email or password')
    const { passwordHash: _, ...safe } = found
    localStorage.setItem(SESSION_KEY, JSON.stringify(safe))
    return safe
  },

  async loginWithDiscord(discordUser: { id: string; username: string; avatar: string | null; email?: string }): Promise<User> {
    const users = getUsers()
    let existing = users.find(u => u.discordId === discordUser.id)
    if (!existing) {
      const user: User & { passwordHash: string } = {
        id: `user_${Date.now()}`,
        name: discordUser.username,
        email: discordUser.email || `discord_${discordUser.id}@nartforge.local`,
        discordId: discordUser.id,
        discordUsername: discordUser.username,
        discordAvatar: discordUser.avatar || undefined,
        passwordHash: '',
        provider: 'discord',
        role: 'user',
        createdAt: new Date().toISOString(),
      }
      users.push(user)
      saveUsers(users)
      existing = user
    }
    const { passwordHash: _, ...safe } = existing
    localStorage.setItem(SESSION_KEY, JSON.stringify(safe))
    return safe
  },

  getSession(): User | null {
    try {
      const data = localStorage.getItem(SESSION_KEY)
      return data ? JSON.parse(data) : null
    } catch {
      return null
    }
  },

  logout() {
    localStorage.removeItem(SESSION_KEY)
    clearAuthToken()
  },

  async hydrateSession(): Promise<User | null> {
    if (!getAuthToken()) return this.getSession()
    try {
      const user = await authApi.me()
      localStorage.setItem(SESSION_KEY, JSON.stringify(user))
      return user
    } catch {
      clearAuthToken()
      return this.getSession()
    }
  },

  saveToken(token: string) {
    setAuthToken(token)
  },

  async updateProfile(userId: string, updates: Partial<User>): Promise<User> {
    const users = getUsers()
    const idx = users.findIndex(u => u.id === userId)
    if (idx === -1) throw new Error('User not found')
    users[idx] = { ...users[idx], ...updates }
    saveUsers(users)
    const { passwordHash: _, ...safe } = users[idx]
    localStorage.setItem(SESSION_KEY, JSON.stringify(safe))
    return safe
  },
}
