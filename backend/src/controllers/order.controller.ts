import { z } from 'zod'
import { asyncHandler } from '../utils/asyncHandler.js'
import { cancelOrder, createOrder, getOrder, listMyOrders } from '../services/order.service.js'

export const createOrderSchema = z.object({
  body: z.object({
    items: z.array(z.object({
      productId: z.string().min(1),
      quantity: z.coerce.number().int().min(1).max(50).optional(),
    })).min(1),
    paymentMethod: z.string().min(1).optional(),
    paymentProvider: z.string().min(1).optional(),
  }),
})

export const orderIdSchema = z.object({
  params: z.object({
    id: z.string().min(1),
  }),
})

export const create = asyncHandler(async (req, res) => {
  const order = await createOrder(req.user!.id, req.body)
  res.status(201).json({ order })
})

export const listMine = asyncHandler(async (req, res) => {
  res.json({ orders: await listMyOrders(req.user!.id) })
})

export const getOne = asyncHandler(async (req, res) => {
  res.json({ order: await getOrder(req.user!.id, req.params.id, req.user!.role === 'admin') })
})

export const cancel = asyncHandler(async (req, res) => {
  res.json({ order: await cancelOrder(req.user!.id, req.params.id) })
})
