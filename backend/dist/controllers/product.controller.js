import { z } from 'zod';
import { asyncHandler } from '../utils/asyncHandler.js';
import { getProductBySlug, listProducts } from '../services/product.service.js';
export const productParamSchema = z.object({
    params: z.object({
        slug: z.string().min(1),
    }),
});
export const getProducts = asyncHandler(async (_req, res) => {
    res.json({ products: await listProducts() });
});
export const getProduct = asyncHandler(async (req, res) => {
    res.json({ product: await getProductBySlug(req.params.slug) });
});
