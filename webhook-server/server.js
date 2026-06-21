import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import { handleGitHubWebhook } from './github.js'
import { sendDiscordNotification } from './discord.js'
import { syncShopierPrices } from './shopier.js'

const app = express()
const PORT = process.env.PORT || 4000

app.use(cors())
app.use(express.json())

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

app.post('/webhook/github', async (req, res) => {
  const event = req.headers['x-github-event']
  const signature = req.headers['x-hub-signature-256']

  try {
    const result = await handleGitHubWebhook(event, signature, req.body)
    res.json({ success: true, ...result })
  } catch (err) {
    console.error('GitHub webhook error:', err)
    res.status(400).json({ success: false, error: err.message })
  }
})

app.post('/shopier/sync', async (req, res) => {
  try {
    const result = await syncShopierPrices(req.body)
    res.json({ success: true, ...result })
  } catch (err) {
    console.error('Shopier sync error:', err)
    res.status(400).json({ success: false, error: err.message })
  }
})

app.post('/discord/test', async (req, res) => {
  try {
    await sendDiscordNotification({
      type: 'test',
      message: 'NartForge webhook system is alive!',
    })
    res.json({ success: true })
  } catch (err) {
    console.error('Discord test error:', err)
    res.status(400).json({ success: false, error: err.message })
  }
})

app.listen(PORT, () => {
  console.log(`NartForge webhook server running on port ${PORT}`)
})
