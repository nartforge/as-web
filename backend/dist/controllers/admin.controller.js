import { z } from 'zod';
import { prisma } from '../prisma/client.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { createProduct, deleteProduct, updateProduct } from '../services/product.service.js';
import { deleteReview } from '../services/review.service.js';
import { listAllOrders } from '../services/order.service.js';
const jsonField = z.unknown().optional();
export const adminProductSchema = z.object({
    body: z.object({
        name: z.string().min(1),
        slug: z.string().min(1),
        shortDescription: z.string().min(1),
        longDescription: z.string().min(1),
        price: z.coerce.number().min(0),
        currency: z.string().default('EUR'),
        category: z.string().min(1),
        status: z.string().optional(),
        badges: jsonField.default([]),
        logo: z.string().optional().nullable(),
        images: jsonField.default([]),
        version: z.string().optional().nullable(),
        compatibility: jsonField.default([]),
        features: jsonField.default([]),
        requirements: jsonField.default([]),
        installationSteps: jsonField.default([]),
        commands: jsonField.default([]),
        errorSolutions: jsonField.default([]),
        isPremium: z.boolean().optional().default(false),
        isFeatured: z.boolean().optional().default(false),
    }),
});
export const adminProductUpdateSchema = adminProductSchema.deepPartial().extend({
    params: z.object({ id: z.string().min(1) }),
});
export const reviewStatusSchema = z.object({
    params: z.object({ id: z.string().min(1) }),
    body: z.object({ status: z.enum(['pending', 'approved', 'rejected']) }),
});
export const createAdminProduct = asyncHandler(async (req, res) => {
    res.status(201).json({ product: await createProduct(req.body) });
});
export const updateAdminProduct = asyncHandler(async (req, res) => {
    res.json({ product: await updateProduct(req.params.id, req.body) });
});
export const deleteAdminProduct = asyncHandler(async (req, res) => {
    await deleteProduct(req.params.id);
    res.status(204).send();
});
export const adminOrders = asyncHandler(async (_req, res) => {
    res.json({ orders: await listAllOrders() });
});
export const adminReviews = asyncHandler(async (_req, res) => {
    const reviews = await prisma.review.findMany({
        include: { user: true, product: true },
        orderBy: { createdAt: 'desc' },
    });
    res.json({
        reviews: reviews.map(review => ({
            id: review.id,
            productId: review.productId,
            productName: review.product.name,
            userId: review.userId,
            userName: review.user.name,
            rating: review.rating,
            comment: review.comment,
            status: review.status,
            createdAt: review.createdAt.toISOString(),
            updatedAt: review.updatedAt.toISOString(),
        })),
    });
});
export const updateReviewStatus = asyncHandler(async (req, res) => {
    const review = await prisma.review.update({
        where: { id: req.params.id },
        data: { status: req.body.status },
        include: { product: true },
    });
    res.json({ review });
});
export const adminUsers = asyncHandler(async (_req, res) => {
    const users = await prisma.user.findMany({ orderBy: { createdAt: 'desc' } });
    res.json({
        users: users.map(user => ({
            id: user.id,
            name: user.name,
            email: user.email,
            discordId: user.discordId,
            discordUsername: user.discordUsername,
            provider: user.provider,
            role: user.role,
            createdAt: user.createdAt.toISOString(),
            updatedAt: user.updatedAt.toISOString(),
        })),
    });
});
export const removeAdminReview = asyncHandler(async (req, res) => {
    await deleteReview(req.user.id, req.params.id, true);
    res.status(204).send();
});
