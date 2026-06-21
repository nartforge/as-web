import type { Prisma } from '@prisma/client'
import { ProductStatus } from '@prisma/client'
import { prisma } from '../prisma/client.js'
import { HttpError } from '../utils/httpError.js'

function statusToApi(status: ProductStatus) {
  return status === ProductStatus.coming_soon ? 'coming-soon' : status
}

function statusFromApi(status?: string) {
  if (!status) return undefined
  return status === 'coming-soon' ? ProductStatus.coming_soon : status as ProductStatus
}

export function serializeProduct(product: Awaited<ReturnType<typeof prisma.product.findFirstOrThrow>>) {
  return {
    ...product,
    status: statusToApi(product.status),
    price: product.price.toString(),
    createdAt: product.createdAt.toISOString(),
    updatedAt: product.updatedAt.toISOString(),
  }
}

export async function listProducts() {
  const products = await prisma.product.findMany({
    orderBy: [
      { isFeatured: 'desc' },
      { createdAt: 'desc' },
    ],
  })
  return products.map(serializeProduct)
}

export async function getProductBySlug(slug: string) {
  const product = await prisma.product.findUnique({ where: { slug } })
  if (!product) throw new HttpError(404, 'Product not found')
  return serializeProduct(product)
}

export async function createProduct(data: Prisma.ProductCreateInput & { status?: string }) {
  const product = await prisma.product.create({
    data: {
      ...data,
      status: statusFromApi(data.status) ?? ProductStatus.active,
    } as Prisma.ProductCreateInput,
  })
  return serializeProduct(product)
}

export async function updateProduct(id: string, data: Partial<Prisma.ProductCreateInput> & { status?: string }) {
  const product = await prisma.product.update({
    where: { id },
    data: {
      ...data,
      ...(data.status ? { status: statusFromApi(data.status) } : {}),
    } as Prisma.ProductUpdateInput,
  })
  return serializeProduct(product)
}

export async function deleteProduct(id: string) {
  await prisma.product.delete({ where: { id } })
}

export async function refreshProductRating(productId: string) {
  const result = await prisma.review.aggregate({
    where: { productId, status: 'approved' },
    _avg: { rating: true },
    _count: { rating: true },
  })

  await prisma.product.update({
    where: { id: productId },
    data: {
      ratingAverage: Math.round((result._avg.rating ?? 0) * 10) / 10,
      reviewCount: result._count.rating,
    },
  })
}
