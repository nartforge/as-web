import { Router } from 'express'
import { add, cartItemSchema, clear, list, remove } from '../controllers/cart.controller.js'
import { requireAuth } from '../middleware/auth.middleware.js'
import { validate } from '../middleware/validate.middleware.js'

export const cartRoutes = Router()

cartRoutes.use(requireAuth)
cartRoutes.get('/', list)
cartRoutes.post('/add', validate(cartItemSchema), add)
cartRoutes.post('/remove', validate(cartItemSchema.pick({ body: true })), remove)
cartRoutes.post('/clear', clear)
