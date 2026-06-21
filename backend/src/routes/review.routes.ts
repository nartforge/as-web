import { Router } from 'express'
import { addReview, createReviewSchema, editReview, getReviews, myReviews, removeReview, reviewListSchema, updateReviewSchema } from '../controllers/review.controller.js'
import { requireAuth } from '../middleware/auth.middleware.js'
import { validate } from '../middleware/validate.middleware.js'

export const reviewRoutes = Router()

reviewRoutes.get('/products/:productId/reviews', validate(reviewListSchema), getReviews)
reviewRoutes.post('/products/:productId/reviews', requireAuth, validate(createReviewSchema), addReview)
reviewRoutes.get('/reviews/me', requireAuth, myReviews)
reviewRoutes.put('/reviews/:id', requireAuth, validate(updateReviewSchema), editReview)
reviewRoutes.delete('/reviews/:id', requireAuth, validate(updateReviewSchema.pick({ params: true })), removeReview)
