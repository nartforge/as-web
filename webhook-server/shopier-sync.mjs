import { readFileSync, writeFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))

const SHOPIER_API_BASE = 'https://api.shopier.com/v1'
const SHOPIER_TOKEN = process.env.SHOPIER_API_TOKEN || ''
const PRODUCTS_PATH = resolve(__dirname, process.env.PRODUCTS_PATH || '../frontend/src/data/products.ts')
const BOT_NOTIFY_URL = process.env.BOT_NOTIFY_URL || 'http://127.0.0.1:4100'
const BOT_INTERNAL_TOKEN = process.env.BOT_INTERNAL_TOKEN || ''

/* Shopier product ID → local product ID mapping */
const PRODUCT_MAP = {
  '47947089': 'asapi',
  '47946909': 'asgiveaway',
  '47946722': 'asverify',
  '47946285': 'askingdomx',
}

async function fetchShopierProducts() {
  const url = `${SHOPIER_API_BASE}/products?limit=50`
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${SHOPIER_TOKEN}` },
  })
  if (!res.ok) throw new Error(`Shopier API ${res.status}: ${await res.text()}`)
  const body = await res.json()
  return body.data || []
}

function parsePrice(priceStr) {
  if (!priceStr) return null
  const num = parseFloat(priceStr.replace(/[^0-9.,]/g, '').replace(',', '.'))
  return Number.isFinite(num) ? num : null
}

function updateProductPrice(localId, shopierProduct) {
  const content = readFileSync(PRODUCTS_PATH, 'utf-8')
  const priceData = shopierProduct.priceData || {}
  const newPriceEUR = priceData.discountedPrice || priceData.price || '0'
  const currency = priceData.currency || 'EUR'

  const priceRegex = new RegExp(`(id:\\s*['"]${localId}['"][\\s\\S]*?price:\\s*)['"]([^'"]*)['"]`)
  const match = content.match(priceRegex)
  if (!match) return { localId, updated: false, reason: 'not found in products.ts' }

  const oldPriceStr = match[2]
  const oldNum = parsePrice(oldPriceStr)
  const newNum = parsePrice(newEURPrice)

  const formattedPrice = currency === 'TRY'
    ? `₺${parseFloat(newEURPrice).toFixed(2)}`
    : `€${parseFloat(newEURPrice).toFixed(2)}`

  if (oldPriceStr === formattedPrice) return { localId, updated: false, reason: 'no change' }

  const updated = content.replace(priceRegex, `$1'${formattedPrice}'`)
  writeFileSync(PRODUCTS_PATH, updated, 'utf-8')

  return {
    localId,
    updated: true,
    oldPrice: oldPriceStr,
    newPrice: formattedPrice,
    discounted: !!priceData.discount,
  }
}

async function notifyBot(type, data) {
  if (!BOT_INTERNAL_TOKEN) return { sent: false, reason: 'no token' }
  try {
    const res = await fetch(`${BOT_NOTIFY_URL}/webhook/price`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-nartforge-bot-token': BOT_INTERNAL_TOKEN,
      },
      body: JSON.stringify({ type, ...data }),
    })
    return { sent: res.ok }
  } catch (e) {
    return { sent: false, error: e.message }
  }
}

async function main() {
  console.log('Shopier sync başlıyor...')

  let shopierProducts
  try {
    shopierProducts = await fetchShopierProducts()
    console.log(`${shopierProducts.length} ürün Shopier API\'dan alındı`)
  } catch (e) {
    console.error('Shopier API hatası:', e.message)
    process.exit(1)
  }

  const results = []
  for (const sp of shopierProducts) {
    const localId = PRODUCT_MAP[sp.id]
    if (!localId) {
      console.log(`Atlanıyor (eşleşme yok): ${sp.title} (Shopier ID: ${sp.id})`)
      continue
    }
    const r = updateProductPrice(localId, sp)
    results.push(r)
    if (r.updated) {
      console.log(`Güncellendi: ${localId} → ${r.newPrice} (önce: ${r.oldPrice})`)
    }
  }

  const updated = results.filter(r => r.updated)
  if (updated.length > 0) {
    await notifyBot('price_sync', {
      products: updated.map(u => ({
        id: u.localId,
        oldPrice: u.oldPrice,
        newPrice: u.newPrice,
      })),
    })
  }

  console.log(`Senkronizasyon tamam. ${updated.length} ürün güncellendi.`)
}

main().catch(e => { console.error('Sync hatası:', e); process.exit(1) })
