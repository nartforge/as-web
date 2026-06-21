import bcrypt from 'bcrypt';
import { Provider } from '@prisma/client';
import { prisma } from '../prisma/client.js';
import { HttpError } from '../utils/httpError.js';
import { signAuthToken } from './token.service.js';
export function toSafeUser(user) {
    return {
        id: user.id,
        name: user.name,
        email: user.email,
        discordId: user.discordId ?? undefined,
        discordUsername: user.discordUsername ?? undefined,
        discordAvatar: user.discordAvatar ?? undefined,
        provider: user.provider,
        role: user.role,
        createdAt: user.createdAt.toISOString(),
    };
}
export async function registerWithEmail(data) {
    const existing = await prisma.user.findUnique({ where: { email: data.email.toLowerCase() } });
    if (existing)
        throw new HttpError(409, 'Email already registered');
    const passwordHash = await bcrypt.hash(data.password, 12);
    const user = await prisma.user.create({
        data: {
            name: data.name.trim(),
            email: data.email.toLowerCase(),
            passwordHash,
            provider: Provider.email,
        },
    });
    return { user: toSafeUser(user), token: signAuthToken(user) };
}
export async function loginWithEmail(email, password) {
    const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    if (!user?.passwordHash)
        throw new HttpError(401, 'Invalid email or password');
    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid)
        throw new HttpError(401, 'Invalid email or password');
    return { user: toSafeUser(user), token: signAuthToken(user) };
}
export async function getCurrentUser(userId) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user)
        throw new HttpError(404, 'User not found');
    return toSafeUser(user);
}
export async function upsertDiscordUser(data) {
    const email = data.email?.toLowerCase() || `discord_${data.id}@nartforge.local`;
    const existingByDiscord = await prisma.user.findUnique({ where: { discordId: data.id } });
    const user = existingByDiscord
        ? await prisma.user.update({
            where: { id: existingByDiscord.id },
            data: {
                discordUsername: data.username,
                discordAvatar: data.avatar || null,
            },
        })
        : await prisma.user.upsert({
            where: { email },
            update: {
                discordId: data.id,
                discordUsername: data.username,
                discordAvatar: data.avatar || null,
                provider: Provider.discord,
            },
            create: {
                name: data.username,
                email,
                discordId: data.id,
                discordUsername: data.username,
                discordAvatar: data.avatar || null,
                provider: Provider.discord,
            },
        });
    return { user: toSafeUser(user), token: signAuthToken(user) };
}
