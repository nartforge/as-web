import { z } from 'zod';
import { asyncHandler } from '../utils/asyncHandler.js';
import { env } from '../config/env.js';
import { HttpError } from '../utils/httpError.js';
import { getCurrentUser, loginWithEmail, registerWithEmail, upsertDiscordUser } from '../services/auth.service.js';
export const registerSchema = z.object({
    body: z.object({
        name: z.string().trim().min(2).max(80),
        email: z.string().email().max(160),
        password: z.string().min(6).max(128),
    }),
});
export const loginSchema = z.object({
    body: z.object({
        email: z.string().email(),
        password: z.string().min(1),
    }),
});
export const register = asyncHandler(async (req, res) => {
    const result = await registerWithEmail(req.body);
    res.status(201).json(result);
});
export const login = asyncHandler(async (req, res) => {
    const result = await loginWithEmail(req.body.email, req.body.password);
    res.json(result);
});
export const logout = asyncHandler(async (_req, res) => {
    res.json({ message: 'Logged out' });
});
export const me = asyncHandler(async (req, res) => {
    res.json({ user: await getCurrentUser(req.user.id) });
});
export const discordRedirect = asyncHandler(async (_req, res) => {
    if (!env.DISCORD_CLIENT_ID || !env.DISCORD_REDIRECT_URI) {
        throw new HttpError(501, 'Discord OAuth is not configured');
    }
    const params = new URLSearchParams({
        client_id: env.DISCORD_CLIENT_ID,
        redirect_uri: env.DISCORD_REDIRECT_URI,
        response_type: 'code',
        scope: env.DISCORD_SCOPES,
    });
    res.redirect(`https://discord.com/api/oauth2/authorize?${params.toString()}`);
});
export const discordCallback = asyncHandler(async (req, res) => {
    const code = typeof req.query.code === 'string' ? req.query.code : '';
    if (!code)
        throw new HttpError(400, 'Missing Discord authorization code');
    if (!env.DISCORD_CLIENT_ID || !env.DISCORD_CLIENT_SECRET || !env.DISCORD_REDIRECT_URI) {
        throw new HttpError(501, 'Discord OAuth is not configured');
    }
    const tokenResponse = await fetch('https://discord.com/api/oauth2/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
            client_id: env.DISCORD_CLIENT_ID,
            client_secret: env.DISCORD_CLIENT_SECRET,
            grant_type: 'authorization_code',
            code,
            redirect_uri: env.DISCORD_REDIRECT_URI,
        }),
    });
    if (!tokenResponse.ok)
        throw new HttpError(401, 'Discord token exchange failed');
    const tokenData = await tokenResponse.json();
    const profileResponse = await fetch('https://discord.com/api/users/@me', {
        headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });
    if (!profileResponse.ok)
        throw new HttpError(401, 'Discord profile fetch failed');
    const profile = await profileResponse.json();
    const avatar = profile.avatar
        ? `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.png`
        : null;
    const { token } = await upsertDiscordUser({
        id: profile.id,
        username: profile.username,
        avatar,
        email: profile.email,
    });
    res.redirect(`${env.FRONTEND_URL}/#/auth/callback?token=${encodeURIComponent(token)}`);
});
