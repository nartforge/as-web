import { execSync } from 'child_process'
import crypto from 'crypto'
import { sendDiscordNotification } from './discord.js'

const SECRET = process.env.WEBHOOK_SECRET || ''
const DEPLOY_PATH = process.env.DEPLOY_PATH || '/var/www/nartforge'
const DEPLOY_BRANCH = process.env.DEPLOY_BRANCH || 'main'

function verifySignature(payload, signature) {
  if (!SECRET || !signature) return true
  const sig = 'sha256=' + crypto.createHmac('sha256', SECRET).update(JSON.stringify(payload)).digest('hex')
  return crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(signature))
}

function triggerDeploy() {
  try {
    const cmd = process.env.DEPLOY_COMMAND ||
      `cd ${DEPLOY_PATH} && git pull origin ${DEPLOY_BRANCH} && npm install && npm run build && pm2 restart nartforge`
    const output = execSync(cmd, { timeout: 120000 }).toString()
    console.log('Deploy output:', output)
    return { success: true, output: output.slice(0, 500) }
  } catch (err) {
    console.error('Deploy failed:', err.message)
    return { success: false, error: err.message }
  }
}

export async function handleGitHubWebhook(event, signature, body) {
  if (!verifySignature(body, signature)) {
    throw new Error('Invalid signature')
  }

  const result = { event, action: null, deploy: null, notification: null }

  switch (event) {
    case 'push': {
      const branch = body.ref?.replace('refs/heads/', '')
      if (branch === DEPLOY_BRANCH) {
        result.action = 'deploy'
        result.deploy = triggerDeploy()
        result.notification = await sendDiscordNotification({
          type: 'deploy',
          title: '🚀 New Deployment',
          message: `Branch \`${branch}\` updated — deploying...`,
          fields: [
            { name: 'Commit', value: body.head_commit?.message?.slice(0, 100) || 'N/A' },
            { name: 'Author', value: body.pusher?.name || 'Unknown' },
          ],
        })
      }
      break
    }

    case 'release': {
      const release = body.release
      result.action = 'release'
      result.deploy = triggerDeploy()
      result.notification = await sendDiscordNotification({
        type: 'release',
        title: `🎉 New Release: ${release?.tag_name || 'N/A'}`,
        message: release?.name || release?.tag_name || 'New release published!',
        url: release?.html_url,
        fields: [
          { name: 'Repository', value: body.repository?.full_name || 'N/A' },
          { name: 'Description', value: (release?.body || '').slice(0, 200) || 'No description' },
        ],
      })
      break
    }

    case 'repository': {
      const repo = body.repository
      result.action = 'repository'
      if (body.action === 'created') {
        result.notification = await sendDiscordNotification({
          type: 'new-repo',
          title: '📦 New Repository',
          message: `New repository created: **${repo?.full_name}**`,
          url: repo?.html_url,
          fields: [
            { name: 'Description', value: repo?.description || 'No description' },
            { name: 'Visibility', value: repo?.visibility || 'N/A' },
          ],
        })
      }
      break
    }

    default:
      result.action = 'ignored'
  }

  return result
}
