import { PrismaClient, ProductStatus } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

const products = [
  {
    id: 'asverify',
    name: 'asVerifyDC',
    slug: 'asverifydc',
    shortDescription: 'Discord account linking and verification plugin system for Minecraft servers.',
    longDescription: 'asVerifyDC links Minecraft players with Discord accounts through secure code-based verification, role assignment, audit logs, and optional LuckPerms integration.',
    price: 0,
    currency: 'EUR',
    category: 'Minecraft Plugin',
    status: ProductStatus.active,
    badges: ['Free', 'Verification'],
    logo: '/products/asVerifyDC.png',
    images: [],
    version: '2.1.0',
    compatibility: ['Paper 1.21+', 'Java 21', 'Discord Bot API'],
    features: [
      { title: 'Code Verification', description: 'Players generate a code in-game and verify in Discord.' },
      { title: 'Role Sync', description: 'Assigns verified roles and optional LuckPerms permissions.' },
      { title: 'Audit Log', description: 'Tracks verification, unlink, and staff actions.' }
    ],
    requirements: ['Paper 1.21+', 'Java 21', 'Discord bot token', 'LuckPerms optional'],
    installationSteps: [
      { step: 1, title: 'Upload Plugin', description: 'Place asVerifyDC.jar in plugins/.' },
      { step: 2, title: 'Configure Discord', description: 'Set bot token, guild ID, and verified role ID.' },
      { step: 3, title: 'Restart', description: 'Restart and test /verify.' }
    ],
    commands: [
      { command: '/verify', description: 'Create verification code', permission: 'asverifydc.use', example: '/verify' },
      { command: '/unlink', description: 'Unlink account', permission: 'asverifydc.use', example: '/unlink' },
      { command: '/asverifydc reload', description: 'Reload config', permission: 'asverifydc.admin', example: '/asverifydc reload' }
    ],
    errorSolutions: [
      { id: 'vd-1', title: 'Bot Offline', errorMessage: 'Discord bot failed to connect.', possibleCause: 'Invalid token or intents disabled.', solution: 'Regenerate token and enable required intents.', severity: 'critical' },
      { id: 'vd-2', title: 'Role Not Assigned', errorMessage: 'Verified role was not assigned.', possibleCause: 'Bot role is below target role.', solution: 'Move the bot role above the verified role.', severity: 'common' }
    ],
    isPremium: false,
    isFeatured: true,
  },
  {
    id: 'asgiveaway',
    name: 'asGiveAway',
    slug: 'asgiveaway',
    shortDescription: 'Discord-integrated, fully automated giveaway plugin with GUI menu and multi-reward support.',
    longDescription: 'asGiveAway manages complete giveaway lifecycles with GUI controls, automatic winner selection, Discord notifications, and multiple reward types.',
    price: 0,
    currency: 'EUR',
    category: 'Minecraft Plugin',
    status: ProductStatus.active,
    badges: ['Free', 'Automation'],
    logo: '/products/asGiveAway.png',
    images: [],
    version: '1.5.0',
    compatibility: ['Paper 1.21+', 'Java 21', 'Vault optional', 'LuckPerms optional'],
    features: [
      { title: 'Giveaway Lifecycle', description: 'Create, start, pause, finish, and archive giveaways.' },
      { title: 'Reward Types', description: 'Commands, roles, crate keys, items, money, and points.' },
      { title: 'Discord Webhooks', description: 'Announces events and winners to Discord channels.' }
    ],
    requirements: ['Paper 1.21+', 'Java 21', 'Discord webhook optional'],
    installationSteps: [
      { step: 1, title: 'Upload Plugin', description: 'Place asGiveAway.jar in plugins/.' },
      { step: 2, title: 'Configure Rewards', description: 'Set reward types and default durations.' },
      { step: 3, title: 'Create Giveaway', description: 'Run /asgiveaway create <name>.' }
    ],
    commands: [
      { command: '/asgiveaway create <name>', description: 'Create giveaway', permission: 'asgiveaway.create', example: '/asgiveaway create Summer' },
      { command: '/asgiveaway start <name>', description: 'Start giveaway', permission: 'asgiveaway.start', example: '/asgiveaway start Summer' },
      { command: '/asgiveaway list', description: 'List giveaways', permission: 'asgiveaway.use', example: '/asgiveaway list' }
    ],
    errorSolutions: [
      { id: 'ga-1', title: 'Webhook Not Sending', errorMessage: 'Discord announcement failed.', possibleCause: 'Invalid webhook URL.', solution: 'Create a new webhook and update config.yml.', severity: 'easy-fix' },
      { id: 'ga-2', title: 'Reward Command Failed', errorMessage: 'Winner selected but reward did not run.', possibleCause: 'Command syntax or permission issue.', solution: 'Test command from console and update reward config.', severity: 'common' }
    ],
    isPremium: false,
    isFeatured: false,
  },
  {
    id: 'askingdomx',
    name: 'asKingdomX',
    slug: 'askingdomx',
    shortDescription: 'Flagship kingdom warfare plugin with territory capture, Crown War, economy, missions, bosses, upgrades, and duels.',
    longDescription: 'asKingdomX is NartForge\'s flagship Minecraft plugin for serious PvP and kingdom networks. It combines kingdom management, real-time territory capture, zone domination, weekly Crown War events, mission progression, Vault economy, upgrade trees, boss encounters, duels, diplomacy, Discord webhooks, and Dynmap support in one professional system designed for Paper 1.21.3 and Java 21.',
    price: 49.99,
    currency: 'EUR',
    category: 'Minecraft Plugin',
    status: ProductStatus.development,
    badges: ['Premium', 'Flagship', 'Best Seller'],
    logo: '/products/asKingdomX.png',
    images: [],
    version: '1.0.20',
    compatibility: ['Paper 1.21.3', 'Java 21', 'Vault', 'PlaceholderAPI', 'Dynmap optional'],
    features: [
      { title: 'Kingdom Management', description: 'Six role tiers, invitations, promotions, kingdom bank, base teleports, and configurable limits.' },
      { title: 'Territory Capture', description: 'Real-time contested claims, capture progress, defense bonuses, and periodic kingdom income.' },
      { title: 'Crown War Engine', description: 'Scheduled weekly war lifecycle with countdown, combat tags, scoring, rewards, and cooldown.' },
      { title: 'Zone Domination', description: 'Multiple domination zones with capture points, holding points, kingdom boosts, and PvP scoring.' },
      { title: 'Progression Systems', description: 'Missions, 22 kingdom levels, upgrade trees, titles, kill effects, and boss rewards.' },
      { title: 'Professional Integrations', description: 'Vault economy, PlaceholderAPI placeholders, Discord webhooks, Dynmap markers, and optional custom item hooks.' }
    ],
    requirements: [
      'Paper 1.21.3',
      'Java 21',
      'Vault for economy',
      'PlaceholderAPI optional',
      'Dynmap optional',
      'MySQL recommended for large networks'
    ],
    installationSteps: [
      { step: 1, title: 'Upload JAR', description: 'Place asKingdomX.jar in the plugins directory.' },
      { step: 2, title: 'Start Once', description: 'Restart the server once so configuration, language, and storage files are generated.' },
      { step: 3, title: 'Enter License', description: 'Add your NartForge license key to plugins/asKingdomX/license.yml.' },
      { step: 4, title: 'Configure Storage', description: 'Use SQLite for small servers or MySQL for networks. Verify credentials before launch.' },
      { step: 5, title: 'Set Economy', description: 'Install Vault and configure salary, tax, shop, upgrade, and territory income values.' },
      { step: 6, title: 'Create Zones', description: 'Use admin commands to create territory centers, domination zones, base points, and war arenas.' },
      { step: 7, title: 'Integrate Discord/Dynmap', description: 'Add webhook URLs and enable Dynmap markers if your network uses public maps.' },
      { step: 8, title: 'Verify Launch', description: 'Run /askx reload, /askx status, and test kingdom creation with a staff account.' }
    ],
    commands: [
      { command: '/kingdom create <name>', description: 'Create a new kingdom', permission: 'askingdomx.kingdom.create', example: '/kingdom create Avalon' },
      { command: '/kingdom invite <player>', description: 'Invite a player', permission: 'GENERAL+', example: '/kingdom invite Steve' },
      { command: '/kingdom claim', description: 'Claim current chunk', permission: 'OFFICER+', example: '/kingdom claim' },
      { command: '/kingdom bank', description: 'Open kingdom bank', permission: 'All members', example: '/kingdom bank' },
      { command: '/kingdom missions', description: 'View mission progress', permission: 'All members', example: '/kingdom missions' },
      { command: '/kingdom war join', description: 'Join active Crown War', permission: 'All members', example: '/kingdom war join' },
      { command: '/kingdom duel challenge <player>', description: 'Challenge player to duel', permission: 'All players', example: '/kingdom duel challenge Alex' },
      { command: '/askx reload', description: 'Reload configuration', permission: 'askingdomx.admin', example: '/askx reload' },
      { command: '/askx territory create <id> [radius]', description: 'Create territory', permission: 'askingdomx.admin', example: '/askx territory create mine 45' },
      { command: '/askx zone create <id>', description: 'Create domination zone', permission: 'askingdomx.zone.admin', example: '/askx zone create bloodvale' }
    ],
    errorSolutions: [
      { id: 'kx-1', title: 'Plugin Failed To Load', errorMessage: 'Missing dependency or unsupported server version.', possibleCause: 'Server is not Paper 1.21.3 or Java 21.', solution: 'Update to Paper 1.21.3 and Java 21, then reinstall Vault/PlaceholderAPI if needed.', severity: 'critical' },
      { id: 'kx-2', title: 'Database Connection Failed', errorMessage: 'Cannot connect to storage backend.', possibleCause: 'Wrong MySQL host, credentials, or database privileges.', solution: 'Verify credentials, create the database, and test connectivity from the server host.', severity: 'critical' },
      { id: 'kx-3', title: 'License Invalid', errorMessage: 'License validation failed.', possibleCause: 'License key copied incorrectly or expired.', solution: 'Copy the key exactly from your NartForge order and contact support if it remains invalid.', severity: 'critical' },
      { id: 'kx-4', title: 'Territory Capture Stuck', errorMessage: 'Capture progress is not advancing.', possibleCause: 'Zone center, radius, or capture settings are invalid.', solution: 'Check territory info, increase radius, and recreate the capture point if needed.', severity: 'common' },
      { id: 'kx-5', title: 'Combat Tag Bypass', errorMessage: 'Players teleport during combat.', possibleCause: 'Combat tag disabled or another plugin overrides teleport checks.', solution: 'Enable combat-tag and review teleport plugin priority or bypass permissions.', severity: 'common' },
      { id: 'kx-6', title: 'Dynmap Markers Missing', errorMessage: 'Territories do not appear on Dynmap.', possibleCause: 'Dynmap integration disabled or full render not completed.', solution: 'Enable Dynmap integration and run a full render after reloading asKingdomX.', severity: 'easy-fix' }
    ],
    isPremium: true,
    isFeatured: true,
  },
  {
    id: 'asapi',
    name: 'asAPI',
    slug: 'asapi',
    shortDescription: 'Server-external API bridge for Minecraft, Discord, and website integration.',
    longDescription: 'asAPI connects Minecraft servers with external services through a secure HTTP API bridge, Discord integration, player cache, and coin operations.',
    price: 0,
    currency: 'EUR',
    category: 'Minecraft Plugin',
    status: ProductStatus.active,
    badges: ['Free', 'API'],
    logo: '/products/asAPI.png',
    images: [],
    version: '1.0.0',
    compatibility: ['Paper 1.21+', 'Java 21', 'Node.js 18+ optional'],
    features: [
      { title: 'HTTP API', description: 'Secure endpoints for website and panel integrations.' },
      { title: 'Discord Bridge', description: 'Account linking and announcements.' },
      { title: 'Player Cache', description: 'Fast lookup for player data and balances.' }
    ],
    requirements: ['Paper 1.21+', 'Java 21', 'API key', 'Node.js optional'],
    installationSteps: [
      { step: 1, title: 'Upload Plugin', description: 'Place asAPI.jar in plugins/.' },
      { step: 2, title: 'Set API Key', description: 'Configure a strong API key.' },
      { step: 3, title: 'Reload', description: 'Run /asapi reload and test /asapi status.' }
    ],
    commands: [
      { command: '/asapi status', description: 'Show bridge status', permission: 'asapi.status', example: '/asapi status' },
      { command: '/asapi reload', description: 'Reload config', permission: 'asapi.reload', example: '/asapi reload' },
      { command: '/asapi test', description: 'Run tests', permission: 'asapi.test', example: '/asapi test' }
    ],
    errorSolutions: [
      { id: 'api-1', title: 'Port In Use', errorMessage: 'HTTP server could not bind.', possibleCause: 'Configured port is occupied.', solution: 'Change api.port and reload.', severity: 'common' },
      { id: 'api-2', title: 'API Unauthorized', errorMessage: 'Requests return 401.', possibleCause: 'Wrong API key.', solution: 'Use the configured API key in request headers.', severity: 'easy-fix' }
    ],
    isPremium: false,
    isFeatured: true,
  },
  {
    id: 'asmoderation',
    name: 'asModeration',
    slug: 'asmoderation',
    shortDescription: 'Advanced Discord moderation bot infrastructure and plugin system.',
    longDescription: 'asModeration provides moderation automation, ticket flows, warning systems, logging, appeals, and dashboard-ready infrastructure for Discord communities.',
    price: 24.99,
    currency: 'EUR',
    category: 'Discord Bot',
    status: ProductStatus.beta,
    badges: ['Beta', 'Moderation'],
    logo: '/products/asModeration.png',
    images: [],
    version: '0.9.0',
    compatibility: ['Discord API', 'Node.js 20+', 'PostgreSQL/MySQL optional'],
    features: [
      { title: 'Auto Moderation', description: 'Filters spam, links, repeated messages, and banned words.' },
      { title: 'Warning System', description: 'Escalating actions with logs and staff notes.' },
      { title: 'Tickets', description: 'Ticket panels, claim flows, and transcript-ready structure.' }
    ],
    requirements: ['Discord bot token', 'Node.js 20+', 'Database optional'],
    installationSteps: [
      { step: 1, title: 'Configure Bot', description: 'Create Discord application and copy token.' },
      { step: 2, title: 'Set Env', description: 'Fill token, client ID, guild ID, and database URL.' },
      { step: 3, title: 'Deploy Commands', description: 'Register slash commands and start the bot.' }
    ],
    commands: [
      { command: '/warn <user> <reason>', description: 'Warn user', permission: 'Moderator', example: '/warn @user spam' },
      { command: '/ticket-setup', description: 'Create ticket panel', permission: 'Administrator', example: '/ticket-setup' },
      { command: '/modlogs <user>', description: 'View moderation logs', permission: 'Moderator', example: '/modlogs @user' }
    ],
    errorSolutions: [
      { id: 'mod-1', title: 'Commands Missing', errorMessage: 'Slash commands are not visible.', possibleCause: 'Commands not deployed.', solution: 'Deploy commands again with correct guild/client ID.', severity: 'common' },
      { id: 'mod-2', title: 'No Permission', errorMessage: 'Bot cannot moderate users.', possibleCause: 'Role hierarchy is too low.', solution: 'Move bot role above moderated roles.', severity: 'critical' }
    ],
    isPremium: true,
    isFeatured: false,
  },
]

async function main() {
  const passwordHash = await bcrypt.hash('admin123', 12)

  await prisma.user.upsert({
    where: { email: 'admin@nartforge.local' },
    update: {},
    create: {
      name: 'NartForge Admin',
      email: 'admin@nartforge.local',
      passwordHash,
      role: 'admin',
      provider: 'email',
    },
  })

  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: product,
      create: product,
    })
  }
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (error) => {
    console.error(error)
    await prisma.$disconnect()
    process.exit(1)
  })
