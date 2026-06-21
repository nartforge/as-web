import { Order } from '../types'
import { orderApi } from './orderApi'
import { paymentApi } from './paymentApi'

const STORAGE_KEY = 'nartforge_orders'

function getAll(): Order[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
  } catch {
    return []
  }
}

function saveAll(orders: Order[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(orders))
}

export const orderService = {
  async create(order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>): Promise<Order> {
    try {
      const created = await orderApi.create({
        items: [{ productId: order.productId, quantity: 1 }],
        paymentMethod: order.paymentMethod,
        paymentProvider: order.paymentProvider,
      })
      if (created.paymentProvider === 'shopier') {
        const payment = await paymentApi.createShopierPayment(created.id)
        return { ...created, shopierPaymentUrl: payment.paymentUrl }
      }
      return created
    } catch (error) {
      console.warn('Backend order unavailable, using local fallback', error)
    }

    const newOrder: Order = {
      ...order,
      id: `order_${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    const orders = getAll()
    orders.push(newOrder)
    saveAll(orders)
    return newOrder
  },

  async getByUser(userId: string): Promise<Order[]> {
    try {
      return await orderApi.getMine()
    } catch (error) {
      console.warn('Backend orders unavailable, using local fallback', error)
    }

    return getAll()
      .filter(o => o.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  },

  async getById(id: string): Promise<Order | null> {
    try {
      return await orderApi.getById(id)
    } catch (error) {
      console.warn('Backend order lookup unavailable, using local fallback', error)
    }

    return getAll().find(o => o.id === id) || null
  },

  async updateStatus(id: string, status: Order['status']): Promise<Order | null> {
    const orders = getAll()
    const idx = orders.findIndex(o => o.id === id)
    if (idx === -1) return null
    orders[idx].status = status
    orders[idx].updatedAt = new Date().toISOString()
    saveAll(orders)
    return orders[idx]
  },

  async getAll(): Promise<Order[]> {
    return getAll().sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  },
}
