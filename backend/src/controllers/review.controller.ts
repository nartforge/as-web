import { z } from 'zod'
import { asyncHandler } from '../utils/asyncHandler.js'
import { createReview, deleteReview, listProductReviews, listUserReviews, updateReview } from '../services/review.service.js'

export const reviewListSchema = z.object({
  params: z.object({
    productId: z.string().min(1),
  }),
})

export const createReviewSchema = z.object({
  params: z.object({
    productId: z.string().min(1),
  }),
  body: z.object({
    rating: z.coerce.number().int().min(1).max(5),
    comment: z.string().trim().min(1).max(1000),
  }),
})

export const updateReviewSchema = z.object({
  params: z.object({
    id: z.string().min(1),
  }),
  body: z.object({
    rating: z.coerce.number().int().min(1).max(5).optional(),
    comment: z.string().trim().min(1).max(1000).optional(),
  }),
})

export const getReviews = asyncHandler(async (req, res) => {
  res.json({ reviews: await listProductReviews(req.params.productId) })
})

export const addReview = asyncHandler(async (req, res) => {
  const review = await createReview(req.user!.id, req.params.productId, req.body)
  res.status(201).json({ review })
})

export const editReview = asyncHandler(async (req, res) => {
  res.json({ review: await updateReview(req.user!.id, req.params.id, req.body) })
})

export const removeReview = asyncHandler(async (req, res) => {
  await deleteReview(req.user!.id, req.params.id)
  res.status(204).send()
})

export const myReviews = asyncHandler(async (req, res) => {
  res.json({ reviews: await listUserReviews(req.user!.id) })
})
