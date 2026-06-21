import type { Review } from '../types'
import { api } from './api'

export const reviewApi = {
  async getByProduct(productId: string) {
    const response = await api.get<{ reviews: Review[] }>(`/products/${encodeURIComponent(productId)}/reviews`)
    return response.reviews
  },

  async add(productId: string, data: { rating: number; comment: string }) {
    const response = await api.post<{ review: Review }>(`/products/${encodeURIComponent(productId)}/reviews`, data)
    return response.review
  },

  async getMine() {
    const response = await api.get<{ reviews: Review[] }>('/reviews/me')
    return response.reviews
  },

  async update(id: string, data: { rating?: number; comment?: string }) {
    const response = await api.put<{ review: Review }>(`/reviews/${encodeURIComponent(id)}`, data)
    return response.review
  },

  async delete(id: string) {
    await api.delete(`/reviews/${encodeURIComponent(id)}`)
  },
}
