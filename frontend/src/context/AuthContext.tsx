import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'
import { User } from '../types'
import { authService } from '../services/auth'
import { authApi } from '../services/authApi'

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (data: { name: string; email: string; password: string }) => Promise<void>
  loginWithDiscord: () => void
  logout: () => void
  updateProfile: (updates: Partial<User>) => Promise<void>
  refreshSession: () => Promise<User | null>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    authService.hydrateSession()
      .then(setUser)
      .finally(() => setLoading(false))
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    const u = await authService.login(email, password)
    setUser(u)
  }, [])

  const register = useCallback(async (data: { name: string; email: string; password: string }) => {
    const u = await authService.register(data)
    setUser(u)
  }, [])

  const loginWithDiscord = useCallback(() => {
    window.location.href = authApi.discordUrl()
  }, [])

  const logout = useCallback(() => {
    authService.logout()
    setUser(null)
  }, [])

  const refreshSession = useCallback(async () => {
    const session = await authService.hydrateSession()
    setUser(session)
    return session
  }, [])

  const updateProfile = useCallback(async (updates: Partial<User>) => {
    if (!user) return
    const updated = await authService.updateProfile(user.id, updates)
    setUser(updated)
  }, [user])

  return (
    <AuthContext.Provider value={{ user, loading, login, register, loginWithDiscord, logout, updateProfile, refreshSession }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
