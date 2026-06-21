import type { Order } from '../types'
import { api } from './api'

export const orderApi = {
  async create(data: { items: { productId: string; quantity?: number }[]; paymentMethod?: string; paymentProvider?: string }) {
    const response = await api.post<{ order: Order }>('/orders', data)
    return response.order
  },

  async getMine() {
    const response = await api.get<{ orders: Order[] }>('/orders/me')
    return response.orders
  },

  async getById(id: string) {
    const response = await api.get<{ order: Order }>(`/orders/${encodeURIComponent(id)}`)
    return response.order
  },

  async cancel(id: string) {
    const response = await api.post<{ order: Order }>(`/orders/${encodeURIComponent(id)}/cancel`)
    return response.order
  },
}
