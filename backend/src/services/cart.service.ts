import type { Prisma } from '@prisma/client'
import { prisma } from '../prisma/client.js'

type CartItemWithProduct = Prisma.CartItemGetPayload<{ include: { product: true } }>

function serializeCartItem(item: CartItemWithProduct) {
  const product = item.product
  return {
    id: item.id,
    productId: item.productId,
    name: product?.name ?? '',
    price: product ? `${product.currency === 'EUR' ? '€' : ''}${product.price.toString()}` : '',
    quantity: item.quantity,
    image: product?.logo ?? undefined,
  }
}

export async function getCart(userId: string) {
  const items = await prisma.cartItem.findMany({
    where: { userId },
    include: { product: true },
    orderBy: { createdAt: 'asc' },
  })
  return items.map(serializeCartItem)
}

export async function addToCart(userId: string, productId: string, quantity = 1) {
  await prisma.cartItem.upsert({
    where: { userId_productId: { userId, productId } },
    update: { quantity: { increment: quantity } },
    create: { userId, productId, quantity },
  })
  return getCart(userId)
}

export async function removeFromCart(userId: string, productId: string) {
  await prisma.cartItem.deleteMany({ where: { userId, productId } })
  return getCart(userId)
}

export async function clearCart(userId: string) {
  await prisma.cartItem.deleteMany({ where: { userId } })
  return []
}
