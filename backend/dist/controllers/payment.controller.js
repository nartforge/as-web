import { z } from 'zod';
import { asyncHandler } from '../utils/asyncHandler.js';
import { env } from '../config/env.js';
import { createShopierPayment, markShopierCallback } from '../services/payment.service.js';
export const createPaymentSchema = z.object({
    body: z.object({
        orderId: z.string().min(1),
    }),
});
export const shopierCreate = asyncHandler(async (req, res) => {
    res.json(await createShopierPayment(req.user.id, req.body.orderId));
});
export const shopierCallback = asyncHandler(async (req, res) => {
    const orderId = String(req.body.orderId || req.query.orderId || '');
    const rawStatus = String(req.body.status || req.query.status || 'paid');
    const status = rawStatus === 'failed' ? 'failed' : 'paid';
    const paymentReference = String(req.body.paymentReference || req.query.paymentReference || '');
    if (orderId) {
        await markShopierCallback(orderId, status, paymentReference || undefined);
    }
    res.json({ ok: true, status });
});
export const shopierSuccess = asyncHandler(async (_req, res) => {
    res.redirect(env.SHOPIER_SUCCESS_URL || `${env.FRONTEND_URL}/#/payment/success`);
});
export const shopierFail = asyncHandler(async (_req, res) => {
    res.redirect(env.SHOPIER_FAIL_URL || `${env.FRONTEND_URL}/#/payment/fail`);
});
