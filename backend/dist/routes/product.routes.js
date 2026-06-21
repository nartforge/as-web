import { Router } from 'express';
import { getProduct, getProducts, productParamSchema } from '../controllers/product.controller.js';
import { validate } from '../middleware/validate.middleware.js';
export const productRoutes = Router();
productRoutes.get('/', getProducts);
productRoutes.get('/:slug', validate(productParamSchema), getProduct);
