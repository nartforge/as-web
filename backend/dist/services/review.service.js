import { prisma } from '../prisma/client.js';
import { HttpError } from '../utils/httpError.js';
import { refreshProductRating } from './product.service.js';
function serializeReview(review) {
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
    };
}
export async function listProductReviews(productId) {
    const reviews = await prisma.review.findMany({
        where: { productId, status: 'approved' },
        include: { user: true },
        orderBy: { createdAt: 'desc' },
    });
    return reviews.map(serializeReview);
}
export async function listUserReviews(userId) {
    const reviews = await prisma.review.findMany({
        where: { userId },
        include: { user: true },
        orderBy: { createdAt: 'desc' },
    });
    return reviews.map(serializeReview);
}
export async function createReview(userId, productId, data) {
    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product)
        throw new HttpError(404, 'Product not found');
    const review = await prisma.review.create({
        data: {
            userId,
            productId,
            rating: data.rating,
            comment: data.comment.trim(),
            status: 'approved',
        },
        include: { user: true },
    });
    await refreshProductRating(productId);
    return serializeReview(review);
}
export async function updateReview(userId, reviewId, data) {
    const existing = await prisma.review.findUnique({ where: { id: reviewId } });
    if (!existing)
        throw new HttpError(404, 'Review not found');
    if (existing.userId !== userId)
        throw new HttpError(403, 'You can only update your own review');
    const review = await prisma.review.update({
        where: { id: reviewId },
        data: {
            ...(data.rating ? { rating: data.rating } : {}),
            ...(data.comment ? { comment: data.comment.trim() } : {}),
        },
        include: { user: true },
    });
    await refreshProductRating(review.productId);
    return serializeReview(review);
}
export async function deleteReview(userId, reviewId, isAdmin = false) {
    const existing = await prisma.review.findUnique({ where: { id: reviewId } });
    if (!existing)
        throw new HttpError(404, 'Review not found');
    if (!isAdmin && existing.userId !== userId)
        throw new HttpError(403, 'You can only delete your own review');
    await prisma.review.delete({ where: { id: reviewId } });
    await refreshProductRating(existing.productId);
}
