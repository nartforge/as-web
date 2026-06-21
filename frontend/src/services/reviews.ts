import { Review } from '../types'
import { reviewApi } from './reviewApi'

const STORAGE_KEY = 'nartforge_reviews'

function getAll(): Review[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
  } catch {
    return []
  }
}

function saveAll(reviews: Review[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(reviews))
}

export const reviewService = {
  async getByProduct(productId: string): Promise<Review[]> {
    try {
      return await reviewApi.getByProduct(productId)
    } catch (error) {
      console.warn('Backend reviews unavailable, using local fallback', error)
    }

    const reviews = getAll().filter(r => r.productId === productId && r.status === 'approved')
    return reviews.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  },

  async add(review: { productId: string; userId: string; userName: string; userAvatar?: string; rating: number; comment: string }): Promise<Review> {
    try {
      return await reviewApi.add(review.productId, {
        rating: review.rating,
        comment: review.comment,
      })
    } catch (error) {
      console.warn('Backend review create unavailable, using local fallback', error)
    }

    const newReview: Review = {
      id: `review_${Date.now()}`,
      productId: review.productId,
      userId: review.userId,
      userName: review.userName,
      userAvatar: review.userAvatar,
      rating: review.rating,
      comment: review.comment,
      status: 'approved',
      isVerifiedBuyer: false,
      createdAt: new Date().toISOString(),
    }
    const reviews = getAll()
    reviews.push(newReview)
    saveAll(reviews)
    return newReview
  },

  async getByUser(userId: string): Promise<Review[]> {
    try {
      return await reviewApi.getMine()
    } catch (error) {
      console.warn('Backend user reviews unavailable, using local fallback', error)
    }

    return getAll()
      .filter(r => r.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  },

  async getAverageRating(productId: string): Promise<{ average: number; total: number }> {
    const reviews = await this.getByProduct(productId)
    if (reviews.length === 0) return { average: 0, total: 0 }
    const sum = reviews.reduce((acc, r) => acc + r.rating, 0)
    return { average: Math.round((sum / reviews.length) * 10) / 10, total: reviews.length }
  },

  async getPending(): Promise<Review[]> {
    return getAll().filter(r => r.status === 'pending')
  },

  async moderate(id: string, status: 'approved' | 'rejected'): Promise<void> {
    const reviews = getAll()
    const idx = reviews.findIndex(r => r.id === id)
    if (idx !== -1) {
      reviews[idx].status = status
      saveAll(reviews)
    }
  },
}
