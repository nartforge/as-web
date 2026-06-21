import jwt from 'jsonwebtoken'
import type { Role } from '@prisma/client'
import { env } from '../config/env.js'

export function signAuthToken(user: { id: string; email: string; role: Role }) {
  return jwt.sign(
    { email: user.email, role: user.role },
    env.JWT_SECRET,
    {
      subject: user.id,
      expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'],
    },
  )
}
