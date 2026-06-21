import type { Prisma } from '@prisma/client'
import { prisma } from '../prisma/client.js'
import { HttpError } from '../utils/httpError.js'
import { refreshProductRating } from './product.service.js'

type ReviewWithUser = Prisma.ReviewGetPayload<{ include: { user: true } }>

function serializeReview(review: ReviewWithUser) {
  return {
    id: review.id,
    productId: review.productId,
    userId: review.userId,
    userName: review.user.name,
    userAvatar: review.user.discordAvatar ?? undefined,
    rating: review.rating,
    comment: review.comment,
    status: review.status,
    isVerifiedBuyer: false,
    createdAt: review.createdAt.toISOString(),
    updatedAt: review.updatedAt.toISOString(),
  }
}

export async function listProductReviews(productId: string) {
  const reviews = await prisma.review.findMany({
    where: { productId, status: 'approved' },
    include: { user: true },
    orderBy: { createdAt: 'desc' },
  })
  return reviews.map(serializeReview)
}

export async function listUserReviews(userId: string) {
  const reviews = await prisma.review.findMany({
    where: { userId },
    include: { user: true },
    orderBy: { createdAt: 'desc' },
  })
  return reviews.map(serializeReview)
}

export async function createReview(userId: string, productId: string, data: { rating: number; comment: string }) {
  const product = await prisma.product.findUnique({ where: { id: productId } })
  if (!product) throw new HttpError(404, 'Product not found')

  const review = await prisma.review.create({
    data: {
      userId,
      productId,
      rating: data.rating,
      comment: data.comment.trim(),
      status: 'approved',
    },
    include: { user: true },
  })

  await refreshProductRating(productId)
  return serializeReview(review)
}

export async function updateReview(userId: string, reviewId: string, data: { rating?: number; comment?: string }) {
  const existing = await prisma.review.findUnique({ where: { id: reviewId } })
  if (!existing) throw new HttpError(404, 'Review not found')
  if (existing.userId !== userId) throw new HttpError(403, 'You can only update your own review')

  const review = await prisma.review.update({
    where: { id: reviewId },
    data: {
      ...(data.rating ? { rating: data.rating } : {}),
      ...(data.comment ? { comment: data.comment.trim() } : {}),
    },
    include: { user: true },
  })

  await refreshProductRating(review.productId)
  return serializeReview(review)
}

export async function deleteReview(userId: string, reviewId: string, isAdmin = false) {
  const existing = await prisma.review.findUnique({ where: { id: reviewId } })
  if (!existing) throw new HttpError(404, 'Review not found')
  if (!isAdmin && existing.userId !== userId) throw new HttpError(403, 'You can only delete your own review')

  await prisma.review.delete({ where: { id: reviewId } })
  await refreshProductRating(existing.productId)
}
