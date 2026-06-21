const WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL || ''

function buildEmbed(data) {
  const colorMap = {
    deploy: 0xFF6D00,
    release: 0x22C55E,
    'new-repo': 0x3B82F6,
    'new-product': 0x22C55E,
    discount: 0xF59E0B,
    test: 0x8B5CF6,
  }

  const embed = {
    title: data.title || 'NartForge Update',
    description: data.message || '',
    color: colorMap[data.type] || 0xFF6D00,
    timestamp: new Date().toISOString(),
    footer: { text: 'NartForge Webhook System' },
  }

  if (data.url) embed.url = data.url
  if (data.fields) embed.fields = data.fields
  if (data.thumbnail) embed.thumbnail = { url: data.thumbnail }

  return { embeds: [embed] }
}

export async function sendDiscordNotification(data) {
  if (!WEBHOOK_URL) {
    console.warn('No DISCORD_WEBHOOK_URL configured — skipping notification')
    return { sent: false, reason: 'no webhook url' }
  }

  try {
    const payload = buildEmbed(data)
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      throw new Error(`Discord webhook responded with ${response.status}`)
    }

    return { sent: true }
  } catch (err) {
    console.error('Discord notification failed:', err.message)
    return { sent: false, error: err.message }
  }
}

export async function sendProductNotification(product, type = 'new-product') {
  return sendDiscordNotification({
    type,
    title: type === 'new-product' ? '🆕 New Product Added' : '💰 Price Drop!',
    message: `**${product.name}** — ${product.price}`,
    url: `https://nartforge.com/#/magaza`,
    thumbnail: product.logo || null,
    fields: [
      { name: 'Category', value: product.category || 'N/A', inline: true },
      { name: 'Price', value: product.price || 'N/A', inline: true },
      { name: 'Status', value: product.status || 'active', inline: true },
      ...(product.description ? [{ name: 'Description', value: product.description.slice(0, 200) }] : []),
    ],
  })
}
