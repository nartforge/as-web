import type { Product } from '../data/products'
import type { ProductDetail } from '../types'
import { api } from './api'

type ApiProduct = Omit<ProductDetail, 'status' | 'price' | 'mainCategory' | 'useCases'> & {
  status: ProductDetail['status']
  price: string
  mainCategory?: ProductDetail['mainCategory']
  useCases?: string[]
}

function formatPrice(price: string, currency: string) {
  const numeric = Number(price)
  if (!Number.isFinite(numeric) || numeric <= 0) return 'Free'
  return `${currency === 'EUR' ? '€' : ''}${numeric.toFixed(2)}`
}

function categoryToMain(category: string): Product['mainCategory'] {
  if (/discord/i.test(category)) return 'discord'
  if (/web/i.test(category)) return 'web'
  if (/design|tasar/i.test(category)) return 'design'
  return 'minecraft'
}

function badgeToCardBadge(badges: string[]): Product['badge'] {
  const normalized = badges.map(b => b.toLowerCase())
  if (normalized.some(b => b.includes('best'))) return 'best-seller'
  if (normalized.some(b => b.includes('premium') || b.includes('flagship'))) return 'popular'
  if (normalized.some(b => b.includes('free') || b.includes('off'))) return 'discount'
  return undefined
}

export function apiProductToDetail(product: ApiProduct): ProductDetail {
  return {
    ...product,
    price: formatPrice(product.price, product.currency),
    mainCategory: product.mainCategory || categoryToMain(product.category),
    useCases: product.useCases || [],
  }
}

export function apiProductToCard(product: ApiProduct): Product {
  const detail = apiProductToDetail(product)
  return {
    id: detail.id,
    name: detail.name,
    description: detail.shortDescription,
    longDescription: detail.longDescription,
    category: detail.category === 'Discord Bot' ? 'discord-bot' : 'minecraft-plugin',
    mainCategory: detail.mainCategory as Product['mainCategory'],
    subCategory: detail.category === 'Discord Bot' ? 'Discord Bot' : 'Plugin',
    price: detail.price,
    status: detail.status,
    features: detail.features.map(feature => feature.title),
    support: true,
    badge: badgeToCardBadge(detail.badges),
    version: detail.version,
    featured: detail.isFeatured,
    updated: new Date(detail.updatedAt).toLocaleDateString(undefined, { month: 'short', year: 'numeric' }),
    requirements: detail.requirements,
    logo: detail.logo,
    accentColor: detail.accentColor,
  }
}

export const productApi = {
  async getProducts() {
    const response = await api.get<{ products: ApiProduct[] }>('/products')
    return response.products.map(apiProductToCard)
  },

  async getProductBySlug(slug: string) {
    const response = await api.get<{ product: ApiProduct }>(`/products/${encodeURIComponent(slug)}`)
    return apiProductToDetail(response.product)
  },
}
