import { api } from './api'

export const paymentApi = {
  async createShopierPayment(orderId: string) {
    return api.post<{
      orderId: string
      status: string
      paymentProvider: 'shopier'
      paymentUrl: string
    }>('/payments/shopier/create', { orderId })
  },
}
