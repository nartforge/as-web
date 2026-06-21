import type { Prisma } from '@prisma/client'
import { prisma } from '../prisma/client.js'
import { HttpError } from '../utils/httpError.js'

type OrderWithItems = Prisma.OrderGetPayload<{ include: { items: true } }>

function serializeOrder(order: OrderWithItems) {
  const items = order.items
  const firstItem = items[0]
  return {
    id: order.id,
    userId: order.userId,
    productId: firstItem?.productId,
    productName: firstItem?.productName ?? 'Order',
    price: `${order.currency === 'EUR' ? '€' : ''}${order.totalPrice.toString()}`,
    totalPrice: order.totalPrice.toString(),
    currency: order.currency,
    paymentMethod: order.paymentMethod,
    paymentProvider: order.paymentProvider,
    paymentReference: order.paymentReference,
    status: order.status,
    items: items.map(item => ({
      id: item.id,
      productId: item.productId,
      productName: item.productName,
      price: item.price.toString(),
      quantity: item.quantity,
    })),
    createdAt: order.createdAt.toISOString(),
    updatedAt: order.updatedAt.toISOString(),
  }
}

export async function createOrder(userId: string, data: {
  items: { productId: string; quantity?: number }[]
  paymentMethod?: string
  paymentProvider?: string
}) {
  if (!data.items.length) throw new HttpError(400, 'Order must contain at least one item')

  const productIds = data.items.map(item => item.productId)
  const products = await prisma.product.findMany({ where: { id: { in: productIds } } })
  if (products.length !== productIds.length) throw new HttpError(400, 'One or more products were not found')

  const productMap = new Map(products.map(product => [product.id, product]))
  const items = data.items.map(item => {
    const product = productMap.get(item.productId)
    if (!product) throw new HttpError(400, 'Product not found')
    const quantity = item.quantity && item.quantity > 0 ? item.quantity : 1
    return {
      product,
      quantity,
      lineTotal: product.price.mul(quantity),
    }
  })

  const total = items.reduce((sum, item) => sum.add(item.lineTotal), items[0]!.lineTotal.sub(items[0]!.lineTotal))
  const currency = products[0]?.currency ?? 'EUR'

  const order = await prisma.order.create({
    data: {
      userId,
      totalPrice: total,
      currency,
      paymentMethod: data.paymentMethod ?? 'shopier',
      paymentProvider: data.paymentProvider ?? 'shopier',
      status: 'pending',
      items: {
        create: items.map(item => ({
          productId: item.product.id,
          productName: item.product.name,
          price: item.product.price,
          quantity: item.quantity,
        })),
      },
    },
    include: { items: true },
  })

  return serializeOrder(order)
}

export async function listMyOrders(userId: string) {
  const orders = await prisma.order.findMany({
    where: { userId },
    include: { items: true },
    orderBy: { createdAt: 'desc' },
  })
  return orders.map(serializeOrder)
}

export async function getOrder(userId: string, orderId: string, isAdmin = false) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: true },
  })
  if (!order) throw new HttpError(404, 'Order not found')
  if (!isAdmin && order.userId !== userId) throw new HttpError(403, 'You cannot view this order')
  return serializeOrder(order)
}

export async function cancelOrder(userId: string, orderId: string) {
  const order = await prisma.order.findUnique({ where: { id: orderId }, include: { items: true } })
  if (!order) throw new HttpError(404, 'Order not found')
  if (order.userId !== userId) throw new HttpError(403, 'You cannot cancel this order')
  if (order.status !== 'pending') throw new HttpError(400, 'Only pending orders can be cancelled')

  const updated = await prisma.order.update({
    where: { id: orderId },
    data: { status: 'cancelled' },
    include: { items: true },
  })
  return serializeOrder(updated)
}

export async function listAllOrders() {
  const orders = await prisma.order.findMany({
    include: { items: true },
    orderBy: { createdAt: 'desc' },
  })
  return orders.map(serializeOrder)
}
