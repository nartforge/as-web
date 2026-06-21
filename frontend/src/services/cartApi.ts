import type { CartItem } from '../types'
import { api } from './api'

export const cartApi = {
  async get() {
    const response = await api.get<{ items: CartItem[] }>('/cart')
    return response.items
  },

  async add(productId: string, quantity = 1) {
    const response = await api.post<{ items: CartItem[] }>('/cart/add', { productId, quantity })
    return response.items
  },

  async remove(productId: string) {
    const response = await api.post<{ items: CartItem[] }>('/cart/remove', { productId })
    return response.items
  },

  async clear() {
    const response = await api.post<{ items: CartItem[] }>('/cart/clear')
    return response.items
  },
}
