import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import { env } from './config/env.js'
import { authRoutes } from './routes/auth.routes.js'
import { productRoutes } from './routes/product.routes.js'
import { reviewRoutes } from './routes/review.routes.js'
import { orderRoutes } from './routes/order.routes.js'
import { cartRoutes } from './routes/cart.routes.js'
import { paymentRoutes } from './routes/payment.routes.js'
import { adminRoutes } from './routes/admin.routes.js'
import { errorHandler, notFoundHandler } from './middleware/error.middleware.js'

export function createApp() {
  const app = express()

  app.use(helmet())
  app.use(cors({
    origin: env.FRONTEND_URL,
    credentials: true,
  }))
  app.use(express.json({ limit: '1mb' }))
  app.use(express.urlencoded({ extended: true }))
  app.use(morgan(env.NODE_ENV === 'production' ? 'combined' : 'dev'))

  app.get('/health', (_req, res) => {
    res.json({ status: 'ok', service: 'nartforge-backend' })
  })

  app.use('/api/auth', authRoutes)
  app.use('/api/products', productRoutes)
  app.use('/api', reviewRoutes)
  app.use('/api/orders', orderRoutes)
  app.use('/api/cart', cartRoutes)
  app.use('/api/payments', paymentRoutes)
  app.use('/api/admin', adminRoutes)

  app.use(notFoundHandler)
  app.use(errorHandler)

  return app
}
