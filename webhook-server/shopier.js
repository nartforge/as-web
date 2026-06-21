import { readFileSync, writeFileSync } from 'fs'
import { sendDiscordNotification } from './discord.js'

const PRODUCTS_PATH = process.env.PRODUCTS_PATH || '../frontend/src/data/products.ts'

export async function syncShopierPrices(shopierData) {
  if (!shopierData || !shopierData.products) {
    throw new Error('Invalid Shopier data — expected { products: [...] }')
  }

  const updated = []
  const errors = []

  for (const item of shopierData.products) {
    try {
      const result = updateProductPrice(item.id, item.price)
      if (result.updated) updated.push(result)
    } catch (err) {
      errors.push({ id: item.id, error: err.message })
    }
  }

  if (updated.length > 0) {
    await sendDiscordNotification({
      type: 'deploy',
      title: '💰 Prices Synced from Shopier',
      message: `${updated.length} product(s) updated.`,
      fields: updated.map(p => ({
        name: p.name,
        value: `${p.oldPrice} → ${p.newPrice}`,
        inline: true,
      })),
    })
  }

  return { synced: updated.length, errors: errors.length, details: { updated, errors } }
}

function updateProductPrice(id, newPrice) {
  const content = readFileSync(PRODUCTS_PATH, 'utf-8')
  const priceRegex = new RegExp(`(id:\\s*['"]${id}['"][\\s\\S]*?price:\\s*)['"]([^'"]*)['"]`)
  const match = content.match(priceRegex)

  if (!match) {
    throw new Error(`Product "${id}" not found in products.ts`)
  }

  const oldPrice = match[2]
  if (oldPrice === newPrice) {
    return { id, updated: false }
  }

  const updated = content.replace(priceRegex, `$1'${newPrice}'`)
  writeFileSync(PRODUCTS_PATH, updated, 'utf-8')

  return { id, name: id, updated: true, oldPrice, newPrice }
}

export function getProductPrices() {
  const content = readFileSync(PRODUCTS_PATH, 'utf-8')
  const prices = []
  const regex = /id:\s*['"]([^'"]+)['"][\s\S]*?price:\s*['"]([^'"]+)['"]/g
  let match
  while ((match = regex.exec(content)) !== null) {
    prices.push({ id: match[1], price: match[2] })
  }
  return prices
}
