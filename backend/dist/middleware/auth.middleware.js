import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { HttpError } from '../utils/httpError.js';
export function requireAuth(req, _res, next) {
    const header = req.headers.authorization;
    const token = header?.startsWith('Bearer ') ? header.slice(7) : null;
    if (!token) {
        next(new HttpError(401, 'Authentication required'));
        return;
    }
    try {
        const payload = jwt.verify(token, env.JWT_SECRET);
        req.user = {
            id: payload.sub,
            email: payload.email,
            role: payload.role,
        };
        next();
    }
    catch {
        next(new HttpError(401, 'Invalid or expired token'));
    }
}
export function requireAdmin(req, _res, next) {
    if (req.user?.role !== 'admin') {
        next(new HttpError(403, 'Admin access required'));
        return;
    }
    next();
}
