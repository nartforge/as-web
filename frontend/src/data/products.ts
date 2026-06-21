export interface Product {
  id: string
  name: string
  description: string
  longDescription: string
  category: 'minecraft-plugin' | 'minecraft-setup' | 'tasarim' | 'discord-bot' | 'minecraft-addon'
  mainCategory: 'minecraft' | 'discord' | 'web' | 'design'
  subCategory: string
  price: string
  status: 'active' | 'beta' | 'coming-soon' | 'development'
  features: string[]
  support: boolean
  badge?: 'popular' | 'new' | 'best-seller' | 'recommended' | 'discount'
  version?: string
  featured?: boolean
  updated?: string
  requirements?: string[]
  useCases?: string[]
  logo?: string
  accentColor?: string
}

export const products: Product[] = [
  {
    id: 'askingdomx',
    name: 'asKingdomX',
    description: 'Premium kingdom & crown-war plugin with territory capture, zone domination, and economy.',
    longDescription: 'asKingdomX is the flagship NartForge plugin — a complete kingdom warfare experience with 20+ integrated modules including territory capture, zone domination, Crown War, missions, economy, upgrades, boss system, duels, and more.',
    category: 'minecraft-plugin',
    mainCategory: 'minecraft',
    subCategory: 'Plugin',
    price: '€29.99',
    status: 'development',
    features: [
      'Kingdom management with 6 role tiers',
      'Real-time territory capture system',
      '3 zone domination with kingdom boosts',
      'Weekly Crown War event',
      'Missions & 22-level kingdom progression',
      'Economy, upgrades, titles, duels & more'
    ],
    support: true,
    badge: 'popular',
    version: 'v1.0.20',
    featured: true,
    updated: 'June 2026',
    logo: '/products/asKingdomX.webp',
    accentColor: '#DBA253',
  },
  {
    id: 'asapi',
    name: 'asAPI',
    description: 'Server-external API bridge for Minecraft, Discord, and website integration.',
    longDescription: 'asAPI connects your Minecraft server with external services via a powerful HTTP API bridge. Features Discord integration, player cache, coin bridge, report system, and a separate Node.js API server.',
    category: 'minecraft-plugin',
    mainCategory: 'minecraft',
    subCategory: 'Plugin',
    price: 'Free',
    status: 'active',
    features: [
      'Internal HTTP server with 13+ API endpoints',
      'Discord JDA bot integration',
      'Real-time website event bridge',
      'Player cache and coin operations',
      'Report and announcement system',
      'Node.js external API bridge'
    ],
    support: true,
    badge: 'discount',
    version: 'v1.0.0',
    featured: true,
    updated: 'June 2026',
    logo: '/products/asAPI.webp',
    accentColor: '#1A7DC6',
  },
  {
    id: 'asverify',
    name: 'asVerifyDC',
    description: 'Discord account linking and verification plugin system.',
    longDescription: 'asVerifyDC is a powerful linking system that allows players to verify their Discord accounts on your Minecraft server. Fully customizable and user-friendly, it can be set up in minutes.',
    category: 'minecraft-plugin',
    mainCategory: 'minecraft',
    subCategory: 'Plugin',
    price: 'Free',
    status: 'active',
    features: [
      'Automatic Discord-Minecraft linking',
      'Code-based verification system',
      'Customizable messages',
      'Multi-server support',
      'Advanced logging system',
      'API support'
    ],
    support: true,
    badge: 'discount',
    version: 'v2.1.0',
    featured: true,
    updated: 'June 2026',
    logo: '/products/asVerifyDC.webp',
    accentColor: '#2E31C4',
  },
  {
    id: 'asgiveaway',
    name: 'asGiveAway',
    description: 'Discord-integrated, fully automated giveaway plugin system.',
    longDescription: 'asGiveAway lets you run fully integrated giveaways on your Minecraft server with Discord. Participants, winner selection, and prize distribution are all automated.',
    category: 'minecraft-plugin',
    mainCategory: 'minecraft',
    subCategory: 'Plugin',
    price: 'Free',
    status: 'active',
    features: [
      'Full Discord integration',
      'Automatic winner selection',
      'Customizable giveaway durations',
      'Entry conditions',
      'Multiple prize support',
      'Detailed statistics'
    ],
    support: true,
    badge: 'discount',
    version: 'v1.5.0',
    updated: 'May 2026',
    logo: '/products/asGiveAway.webp',
    accentColor: '#E8890F',
  },
  {
    id: 'custom-discord-bot',
    name: 'Custom Discord Bot',
    description: 'Fully custom, from-scratch Discord bot solution built for you.',
    longDescription: 'Scalable and modular Discord bot infrastructure designed for your needs. We develop bots for moderation, fun, utility, or any custom scenario.',
    category: 'discord-bot',
    mainCategory: 'discord',
    subCategory: 'Discord Bot',
    price: 'Get a Quote',
    status: 'active',
    features: [
      'Custom development from scratch',
      'Modular code structure',
      'Database integration',
      'Dashboard interface',
      '24/7 support',
      'Continuous updates'
    ],
    support: true,
    badge: 'best-seller',
    accentColor: '#4B56B3',
  },
  {
    id: 'minecraft-packet',
    name: 'Minecraft Server System Pack',
    description: 'Premium Minecraft server systems, plugins, and infrastructure package.',
    longDescription: 'Comprehensive Minecraft server solutions package. Economy, ranks, protection, game systems, and more in a single pack. With its modular structure, choose what you need.',
    category: 'minecraft-setup',
    mainCategory: 'minecraft',
    subCategory: 'Server Setup',
    price: '€39.99',
    status: 'active',
    features: [
      'Advanced economy system',
      'Rank and permission management',
      'Region protection system',
      'Custom game modes',
      'Anti-cheat integration',
      'Discord connection'
    ],
    support: true,
    accentColor: '#22C55E',
  },
  {
    id: 'web-packet',
    name: 'Website Setup Pack',
    description: 'Professional website setup, theme, and infrastructure solutions.',
    longDescription: 'Modern and responsive website for your server. Player statistics, store, application system, and more — available with ready templates or custom-built from scratch.',
    category: 'tasarim',
    mainCategory: 'web',
    subCategory: 'Site Templates',
    price: 'Get a Quote',
    status: 'active',
    features: [
      'Responsive design',
      'Server statistics',
      'Online store integration',
      'Player profiles',
      'Admin panel',
      'SEO optimization'
    ],
    support: true,
    accentColor: '#F97316',
  },
  {
    id: 'asmoderation',
    name: 'asModeration',
    description: 'Advanced Discord moderation bot infrastructure and plugin system.',
    longDescription: 'asModeration provides comprehensive moderation tools to keep your server safe. Equipped with automatic filtering, warning system, and detailed logging features.',
    category: 'discord-bot',
    mainCategory: 'discord',
    subCategory: 'Discord Bot',
    price: '€24.99',
    status: 'beta',
    features: [
      'Advanced automatic moderation',
      'Custom filtering rules',
      'Warning and penalty system',
      'Detailed logging',
      'Appeal system',
      'Dashboard management'
    ],
    support: true,
    logo: '/products/asModeration.webp',
    accentColor: '#393AC5',
  },
  {
    id: 'aslevels',
    name: 'asLevels',
    description: 'Level up your server with a ranking and XP system.',
    longDescription: 'asLevels offers a leveling and reward system for your players. Reward active players, create leaderboards, and grow your community.',
    category: 'minecraft-addon',
    mainCategory: 'minecraft',
    subCategory: 'Plugin',
    price: '€12.99',
    status: 'coming-soon',
    features: [
      'Level and XP system',
      'Leaderboards',
      'Custom rewards',
      'Discord integration',
      'Customizable settings'
    ],
    support: false,
    accentColor: '#8B5CF6',
  },
  {
    id: 'custom-webapp',
    name: 'Custom Web Application',
    description: 'Tailored web application and infrastructure solutions for your needs.',
    longDescription: 'We develop custom web applications, panel systems, or API infrastructures. We deliver scalable and secure solutions using modern technologies.',
    category: 'tasarim',
    mainCategory: 'web',
    subCategory: 'Site Templates',
    price: 'Get a Quote',
    status: 'active',
    features: [
      'Custom development',
      'Modern tech stack',
      'API development',
      'Panel management systems',
      'Database design',
      'Performance optimization'
    ],
    support: true,
    accentColor: '#3B82F6',
  },
]

export const categoryStructure = [
  {
    id: 'minecraft',
    label: 'Minecraft',
    icon: '/icons/minecraft.png',
    subCategories: ['Plugin', 'Plugin Config', 'Server Setup', 'GUI'],
  },
  {
    id: 'discord',
    label: 'Discord',
    icon: '/icons/discord.png',
    subCategories: ['Discord Bot'],
  },
  {
    id: 'web',
    label: 'Web',
    icon: '/icons/web.png',
    subCategories: [],
  },
  {
    id: 'design',
    label: 'Design',
    icon: '/icons/design.png',
    subCategories: [],
  },
] as const

export const categories = [
  { id: 'all', label: 'All' },
  { id: 'minecraft-plugin', label: 'Minecraft Plugin' },
  { id: 'minecraft-setup', label: 'Minecraft Setup' },
  { id: 'tasarim', label: 'Design' },
  { id: 'discord-bot', label: 'Discord Bot' },
  { id: 'minecraft-addon', label: 'Minecraft Addon' },
] as const

export const storeProducts = products.filter(p => p.status !== 'coming-soon')

// Wiki categories mapped to store icon paths
export const wikiCategoryIcons: Record<string, string> = {
  'Minecraft Plugin': '/icons/minecraft.png',
  'Minecraft Setup': '/icons/minecraft.png',
  'Design': '/icons/design.png',
  'Discord Bot': '/icons/discord.png',
}
