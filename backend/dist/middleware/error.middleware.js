import { ZodError } from 'zod';
import { HttpError } from '../utils/httpError.js';
import { env } from '../config/env.js';
export const notFoundHandler = (req, _res, next) => {
    next(new HttpError(404, `Route not found: ${req.method} ${req.originalUrl}`));
};
export const errorHandler = (err, _req, res, _next) => {
    if (err instanceof ZodError) {
        res.status(400).json({
            message: 'Validation failed',
            issues: err.flatten(),
        });
        return;
    }
    const statusCode = err instanceof HttpError ? err.statusCode : 500;
    const message = statusCode >= 500 ? 'Internal server error' : err.message;
    res.status(statusCode).json({
        message,
        ...(env.NODE_ENV !== 'production' && statusCode >= 500 ? { detail: err.message } : {}),
    });
};
