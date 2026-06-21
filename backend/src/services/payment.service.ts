import { prisma } from '../prisma/client.js'
import { env } from '../config/env.js'
import { HttpError } from '../utils/httpError.js'

export async function createShopierPayment(userId: string, orderId: string) {
  const order = await prisma.order.findUnique({ where: { id: orderId }, include: { items: true } })
  if (!order) throw new HttpError(404, 'Order not found')
  if (order.userId !== userId) throw new HttpError(403, 'You cannot pay this order')

  const paymentUrl = env.SHOPIER_PAYMENT_URL
    ? `${env.SHOPIER_PAYMENT_URL}${env.SHOPIER_PAYMENT_URL.includes('?') ? '&' : '?'}orderId=${encodeURIComponent(order.id)}`
    : `${env.FRONTEND_URL}/#/payment-placeholder?orderId=${encodeURIComponent(order.id)}`

  return {
    orderId: order.id,
    status: order.status,
    paymentProvider: 'shopier',
    paymentUrl,
  }
}

export async function markShopierCallback(orderId: string, status: 'paid' | 'failed', paymentReference?: string) {
  return prisma.order.update({
    where: { id: orderId },
    data: {
      status,
      paymentReference,
    },
  })
}
