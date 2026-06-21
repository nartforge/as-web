import { Router } from 'express'
import { createPaymentSchema, shopierCallback, shopierCreate, shopierFail, shopierSuccess } from '../controllers/payment.controller.js'
import { requireAuth } from '../middleware/auth.middleware.js'
import { validate } from '../middleware/validate.middleware.js'

export const paymentRoutes = Router()

paymentRoutes.post('/shopier/create', requireAuth, validate(createPaymentSchema), shopierCreate)
paymentRoutes.post('/shopier/callback', shopierCallback)
paymentRoutes.get('/shopier/success', shopierSuccess)
paymentRoutes.get('/shopier/fail', shopierFail)
