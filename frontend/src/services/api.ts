const TOKEN_KEY = 'nartforge_token'

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api'

export class ApiError extends Error {
  status: number

  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

export function getAuthToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function setAuthToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token)
}

export function clearAuthToken() {
  localStorage.removeItem(TOKEN_KEY)
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers)
  const token = getAuthToken()

  if (!headers.has('Content-Type') && options.body) {
    headers.set('Content-Type', 'application/json')
  }
  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  })

  if (!response.ok) {
    const data = await response.json().catch(() => null)
    throw new ApiError(response.status, data?.message || 'API request failed')
  }

  if (response.status === 204) return undefined as T
  return response.json() as Promise<T>
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, data?: unknown) => request<T>(path, {
    method: 'POST',
    body: data === undefined ? undefined : JSON.stringify(data),
  }),
  put: <T>(path: string, data?: unknown) => request<T>(path, {
    method: 'PUT',
    body: data === undefined ? undefined : JSON.stringify(data),
  }),
  delete: <T>(path: string) => request<T>(path, { method: 'DELETE' }),
}
