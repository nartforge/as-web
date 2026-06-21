import { z } from 'zod';
import { asyncHandler } from '../utils/asyncHandler.js';
import { addToCart, clearCart, getCart, removeFromCart } from '../services/cart.service.js';
export const cartItemSchema = z.object({
    body: z.object({
        productId: z.string().min(1),
        quantity: z.coerce.number().int().min(1).max(50).optional(),
    }),
});
export const list = asyncHandler(async (req, res) => {
    res.json({ items: await getCart(req.user.id) });
});
export const add = asyncHandler(async (req, res) => {
    res.json({ items: await addToCart(req.user.id, req.body.productId, req.body.quantity) });
});
export const remove = asyncHandler(async (req, res) => {
    res.json({ items: await removeFromCart(req.user.id, req.body.productId) });
});
export const clear = asyncHandler(async (req, res) => {
    res.json({ items: await clearCart(req.user.id) });
});
