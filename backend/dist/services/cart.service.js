import { prisma } from '../prisma/client.js';
function serializeCartItem(item) {
    const product = item.product;
    return {
        id: item.id,
        productId: item.productId,
        name: product?.name ?? '',
        price: product ? `${product.currency === 'EUR' ? '€' : ''}${product.price.toString()}` : '',
        quantity: item.quantity,
        image: product?.logo ?? undefined,
    };
}
export async function getCart(userId) {
    const items = await prisma.cartItem.findMany({
        where: { userId },
        include: { product: true },
        orderBy: { createdAt: 'asc' },
    });
    return items.map(serializeCartItem);
}
export async function addToCart(userId, productId, quantity = 1) {
    await prisma.cartItem.upsert({
        where: { userId_productId: { userId, productId } },
        update: { quantity: { increment: quantity } },
        create: { userId, productId, quantity },
    });
    return getCart(userId);
}
export async function removeFromCart(userId, productId) {
    await prisma.cartItem.deleteMany({ where: { userId, productId } });
    return getCart(userId);
}
export async function clearCart(userId) {
    await prisma.cartItem.deleteMany({ where: { userId } });
    return [];
}
