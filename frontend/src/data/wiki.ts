export interface WikiSection {
  title: string
  content: string
}

export interface WikiArticle {
  id: string
  productId: string
  title: string
  category: string
  description: string
  sections: WikiSection[]
}

export const wikiArticles: WikiArticle[] = [
  // ═══════════════════════════════════════════════════════════════
  // asKingdomX
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'askingdomx',
    productId: 'askingdomx',
    title: 'asKingdomX',
    category: 'Minecraft Plugin',
    description: 'Premium kingdom & crown-war plugin with territory capture, zone domination, missions, economy, upgrades, boss system, duels, and more. Paper 1.21.3 | Java 21.',
    sections: [
      {
        title: 'Overview',
        content: `**asKingdomX** is a premium Minecraft Paper plugin that brings a full-scale kingdom warfare experience to your server.

**Version:** 1.0.20 | **Server:** Paper 1.21.3 | **Java:** 21 | **Build:** Gradle (Kotlin DSL)

> 💡 asKingdomX is the flagship NartForge product — a complete kingdom, territory, and war system with 20+ integrated modules.

**Core Modules:**
- **Kingdom Management** — Create, disband, invite, kick, promote/demote, transfer ownership. 6 role tiers: KING/QUEEN/GENERAL/OFFICER/KNIGHT/MEMBER/RECRUIT. Up to 3 configurable prefixes with MiniMessage color support.
- **Territory Capture** — Real-time contested territory capture with progress tracking, capture time, and ownership persistence. Territory income (money + XP) every 5 minutes.
- **Zone Domination** — 3 capturable zones (Bloodvale Outpost, Ironfang Stronghold, Ebonspire Altar) with capture points, holding points, defense kill points. Zone-specific kingdom boosts.
- **Crown War** — Weekly scheduled war (Saturday 20:00 Europe/Istanbul). State machine: COUNTDOWN → ACTIVE → ENDING → REWARDING → COOLDOWN. Kill/death scoring, Crown Castle hold scoring, combat tag (15s), combat log punishment.
- **Kingdom War** — Player-initiated kingdom vs kingdom wars with surrender, scoring, and war events.
- **Missions & Leveling** — 4 mission types: BLOCK_BREAK, MOB_KILL, MONEY_DEPOSIT, TERRITORY_CAPTURE. Reset cycles: daily/weekly/once. 22 kingdom levels with XP and money costs.
- **Economy** — Bank (Vault-integrated), salary (auto-pay every 5 min), tax (auto-collect every 5 min), market (player listings), shop.
- **Upgrades Tree** — 6 upgrade paths with 5 levels each: Member Slots, Territory Defense, Holding Points, Money Income, Mission Reward, Zone Capture Speed.
- **Boss System** — 4 boss tiers with respawn scheduler and kingdom rewards. XP boss summon system.
- **Kingdom Titles** — 12 unlockable name tag titles (Warrior, Knight, Guardian, King, Noble, Commander, Conqueror, Veteran, Emperor, Legend, Victorious, Oracle).
- **Kill Effects** — 8 particle + sound effects on PvP kills.
- **Daily Rewards** — Streak system with kingdom-wide zone point boosts at milestone streaks.
- **Relations / Diplomacy** — ALLY / NEUTRAL / ENEMY / TRUCE relations. Ally chat (/kac). Alliance requests and management.
- **Claim System** — Chunk-based land claiming with configurable claim limits.
- **Chest Locking** — Sneak + right-click a chest with a sign to lock it. Only kingdom members can open.
- **Teleport System** — Configurable teleport points with warmup, cooldown, permission support, zone integration.
- **XP Economy** — XP Bank (store levels), XP Exchange (XP to Kingdom Coins), XP Shop, XP Bottles, Rune Forge, Death XP Loss (configurable per-world).
- **Power Forge** — Item forging system with levels, XP costs, and success rates.
- **Farm World** — Farm regions with mob spawning, shard drops, player/mob kill tracking.
- **Duels** — 1v1/2v2/3v3 duel system with arenas, challenge/accept/deny, stats tracking.
- **GUI System** — Animated menus, quest board, market, boss UI, titles & effects, war menu, diplomacy menu, shop, duel arena. ItemsAdder/Nexo/Oraxen custom item support.
- **Discord Integration** — Webhook notifications for kingdom created, territory captured, war events.
- **Dynmap Support** — Live territory and base markers on web map.
- **Combat Tag** — Blocks /spawn, /home, /tpa, /warp, /hub, /lobby, /back, /wild, /rtp during combat. 15s duration.
- **Storage** — SQLite (WAL mode) or MySQL via HikariCP. Async operations via CompletableFuture.`,
      },
      {
        title: 'Commands',
        content: `**/kingdom** (aliases: /k, /kingdoms)

**Kingdom Management:**
| Command | Role | Description |
|---------|------|-------------|
| /kingdom create <name> | Everyone | Create a new kingdom |
| /kingdom disband | LEADER | Disband your kingdom (requires /confirm) |
| /kingdom invite <player> | GENERAL+ | Invite a player |
| /kingdom accept [kingdom] | Non-member | Accept an invite |
| /kingdom deny <kingdom> | Non-member | Deny an invite |
| /kingdom leave | MEMBER+ | Leave your current kingdom |
| /kingdom kick <player> | OFFICER+ | Remove a member |
| /kingdom promote <player> | LEADER | Promote a member |
| /kingdom demote <player> | LEADER | Demote a member |
| /kingdom setrole <player> <role> | LEADER | Set exact role |
| /kingdom transfer <player> | LEADER | Transfer ownership (requires /confirm) |
| /kingdom setprefix <prefix> | LEADER | Set kingdom prefix (max 3 slots) |
| /kingdom useprefix <1-3\|off> | LEADER | Select active prefix |

**Territory & Zone:**
| Command | Role | Description |
|---------|------|-------------|
| /kingdom claim | OFFICER+ | Claim the current chunk |
| /kingdom unclaim | OFFICER+ | Remove claim from current chunk |
| /kingdom setbase | OFFICER+ | Set kingdom base location |
| /kingdom base | All members | Teleport to kingdom base |
| /kingdom zones | All | List domination zones |
| /kingdom zone <id> | All | View zone info |
| /kingdom teleport <id> | All | Teleport to a point |
| /kingdom lock | All | Info about chest locking |

**Economy:**
| Command | Role | Description |
|---------|------|-------------|
| /kingdom bank | All | Open bank menu |
| /kingdom deposit <amount> | All | Deposit money |
| /kingdom withdraw <amount> | GENERAL+ | Withdraw money |
| /kingdom pay <player> <amount> | GENERAL+ | Pay from kingdom bank |
| /kingdom salary [amount] | LEADER | View or set salary |
| /kingdom tax [percent] | LEADER | View or set tax rate |
| /kingdom transactions [page] | All | View bank transactions |
| /kingdom market | All | Open kingdom market GUI |
| /kingdom market sell <price> | All | List held item for sale |
| /kingdom market buy <id> | All | Buy a listed item |
| /kingdom market cancel <id> | All | Cancel your listing |
| /kingdom market mine | All | View your listings |

**Progression:**
| Command | Role | Description |
|---------|------|-------------|
| /kingdom daily | All | Claim daily reward |
| /kingdom missions | All | View active missions |
| /kingdom questboard | All | Open quest board GUI |
| /kingdom level | All | View kingdom level and XP |
| /kingdom upgrade | LEADER | Upgrade kingdom level |
| /kingdom upgrades | All | Open upgrades menu GUI |

**Titles & Effects:**
| Command | Role | Description |
|---------|------|-------------|
| /kingdom title list | All (member) | View all available titles |
| /kingdom title set <key> | All (member) | Set active title |
| /kingdom title info | All | View current active title |
| /kingdom killeffects list | All | View all kill effects |
| /kingdom killeffects set <key> | All | Set active kill effect |
| /kingdom killeffects off | All | Disable kill effect |

**Diplomacy:**
| Command | Role | Description |
|---------|------|-------------|
| /kingdom declare <kingdom> | LEADER | Declare war |
| /kingdom peace <kingdom> | LEADER | Make peace |
| /kingdom ally <kingdom> | LEADER | Request alliance |
| /kingdom ally accept <kingdom> | LEADER | Accept alliance |
| /kingdom ally deny <kingdom> | LEADER | Deny alliance |
| /kingdom ally remove <kingdom> | LEADER | Remove an alliance |
| /kingdom enemy <kingdom> | LEADER | Declare enemy |
| /kingdom enemy remove <kingdom> | LEADER | End hostilities |
| /kingdom relations | All | View diplomatic relations |
| /kingdom diplomacy [kingdom] | All | Diplomacy menu |

**War:**
| Command | Role | Description |
|---------|------|-------------|
| /kingdom war | All | Open Crown War menu |
| /kingdom war join | All | Join the active Crown War |
| /kingdom war score | All | View your war score |
| /kingdom war info | All | View current war leader |
| /kingdom kingdomwar | All | Open Kingdom War menu |
| /kingdom surrender | LEADER | Surrender in active war |
| /kingdom challenge <player> [type] | All | Challenge to a duel |

**Information:**
| Command | Role | Description |
|---------|------|-------------|
| /kingdom info [kingdom] | All | View kingdom information |
| /kingdom top | All | Kingdom leaderboard (by power) |
| /kingdom logs [type] [page] | OFFICER+ | View kingdom activity logs |
| /kingdom territories | All | Open territories menu |
| /kingdom boss | All | View active boss status |
| /kingdom boss summon <type> | All | Summon an XP boss |

**Extra Systems:**
| Command | Role | Description |
|---------|------|-------------|
| /kingdom forge | All | Open Power Forge menu |
| /kingdom xpbank | All | Open XP Bank menu |
| /kingdom xpexchange | All | Exchange XP for Kingdom Coins |
| /kingdom xpshop | All | Open XP Shop menu |
| /kingdom xpbottle <size> | All | Create an XP bottle |
| /kingdom runes | All | Open Rune Forge menu |
| /kingdom farm [region] | All | Open Farm World menu |
| /kingdom shards exchange | All | Exchange shards |
| /kingdom duel | All | Open Duel Arena menu |
| /kingdom duel challenge <player> [type] | All | Challenge a player |
| /kingdom duel accept <player> | All | Accept a duel |
| /kingdom duel deny <player> | All | Deny a duel |

**/askx (Admin Commands):**
| Command | Permission | Description |
|---------|-----------|-------------|
| /askx reload | askingdomx.reload | Reload all configurations |
| /askx status | askingdomx.admin | Plugin status information |
| /askx license status | askingdomx.license.status | View license info |
| /askx license reload | askingdomx.admin | Reload license config |
| /askx kingdom delete <name> | askingdomx.kingdom.admin.delete | Force delete a kingdom |
| /askx kingdom setlevel <name> <level> | askingdomx.admin | Set kingdom level |
| /askx kingdom addxp <name> <amount> | askingdomx.admin | Add XP to kingdom |
| /askx kingdom setbank <name> <amount> | askingdomx.admin | Set bank balance |
| /askx territory create <id> [radius] | askingdomx.admin | Create a territory |
| /askx territory delete <id> | askingdomx.admin | Delete a territory |
| /askx territory setcenter <id> | askingdomx.admin | Set center location |
| /askx territory setradius <id> <radius> | askingdomx.admin | Set capture radius |
| /askx territory reload | askingdomx.admin | Reload territory config |
| /askx territory info [id] | askingdomx.admin | View territory info |
| /askx war start | askingdomx.admin | Start Crown War countdown |
| /askx war stop | askingdomx.admin | Stop Crown War |
| /askx war status | askingdomx.admin | View Crown War status |
| /askx zone create <id> | askingdomx.zone.admin | Create a zone |
| /askx zone delete <id> | askingdomx.zone.admin | Delete a zone |
| /askx zone setowner <zone> <kingdom> | askingdomx.zone.admin | Set zone owner |
| /askx zone reset <zone> | askingdomx.zone.admin | Reset zone to neutral |
| /askx zone info <zone> | askingdomx.zone.admin | View zone info |
| /askx zone reload | askingdomx.zone.admin | Reload zones from config |
| /askx teleport create <id> | askingdomx.teleport.admin | Create a teleport point |
| /askx teleport delete <id> | askingdomx.teleport.admin | Delete a teleport point |
| /askx teleport setlocation <id> | askingdomx.teleport.admin | Set location |
| /askx teleport info <id> | askingdomx.teleport.admin | View teleport info |
| /askx teleport list | askingdomx.teleport.admin | List all teleport points |
| /askx teleport test <id> | askingdomx.teleport.admin | Test teleport |
| /askx teleport reload | askingdomx.teleport.admin | Reload teleport config |
| /askx debug dump | askingdomx.admin | Dump debug info |

**Other Commands:**
| Command | Description |
|---------|-------------|
| /confirm | Confirm a pending action |
| /zones | View all domination zones |
| /kac | Send message to allied kingdoms |`,
      },
      {
        title: 'Permissions',
        content: `| Permission | Default | Description |
|-----------|---------|-------------|
| askingdomx.admin | op | Full admin access |
| askingdomx.reload | op | Reload config |
| askingdomx.license.status | op | View license status |
| askingdomx.kingdom.admin.delete | op | Delete any kingdom |
| askingdomx.kingdom.create | true | Create a kingdom |
| askingdomx.kingdom.menu | true | Open the kingdom menu |
| askingdomx.bypass.campguard | op | Bypass territory camp damage |
| askingdomx.zone.admin | op | Manage domination zones |
| askingdomx.teleport.admin | op | Manage teleport points |
| askingdomx.teleport.bloodvale | true | Teleport to Bloodvale Outpost |
| askingdomx.teleport.ironfang | true | Teleport to Ironfang Stronghold |
| askingdomx.teleport.ebonspire | true | Teleport to Ebonspire Altar |
| askingdomx.bypass.xploss | op | Bypass XP loss on death |
| askingdomx.claim.bypass | op | Bypass claim protections |

**Role Hierarchy:**
| Role | Capabilities |
|------|-------------|
| KING / QUEEN (owner) | Full management, disband, transfer, salary/tax, diplomacy |
| GENERAL | Invite, kick, promote/demote, claim, bank withdraw, base |
| OFFICER | Invite, kick, claim, base, zone commands |
| KNIGHT | Base commands, limited bank access |
| MEMBER | Basic commands, market, quests, daily |
| RECRUIT | View-only |`,
      },
      {
        title: 'Placeholders',
        content: `**Identifier:** askingdomx

**Kingdom Info:**
| Placeholder | Description |
|------------|-------------|
| %askingdomx_kingdom_name% | Player's kingdom name |
| %askingdomx_kingdom_tag% | Kingdom tag |
| %askingdomx_kingdom_role% | Player's role |
| %askingdomx_kingdom_prefix% | Active kingdom prefix |
| %askingdomx_kingdom_level% | Kingdom level |
| %askingdomx_kingdom_xp% | Kingdom experience |
| %askingdomx_kingdom_bank% | Kingdom bank balance |
| %askingdomx_kingdom_power% | Kingdom power score |
| %askingdomx_kingdom_members_online% | Online member count |
| %askingdomx_kingdom_members_total% | Total member count |
| %askingdomx_kingdom_owner% | Kingdom owner name |
| %askingdomx_kingdom_max_members% | Maximum member limit |

**Points & Ranking:**
| Placeholder | Description |
|------------|-------------|
| %askingdomx_kingdom_points% | Total kingdom zone points |
| %askingdomx_kingdom_zone_points% | Sum of all zone points |
| %askingdomx_kingdom_rank_position% | Kingdom rank by zone points |

**Zone:**
| Placeholder | Description |
|------------|-------------|
| %askingdomx_zone_name% | Current zone name |
| %askingdomx_zone_owner% | Current zone owner |
| %askingdomx_zone_capturing% | Active capture progress |
| %askingdomx_zone_boost_type% | Active zone boost type |
| %askingdomx_zone_current_capture_progress% | Capture progress % |
| %askingdomx_zone_current_capture_time_left% | Seconds remaining |

**War:**
| Placeholder | Description |
|------------|-------------|
| %askingdomx_war_state% | Current war state |
| %askingdomx_war_timeleft% | Time remaining in war |
| %askingdomx_war_score% | Current war score |

**Player Stats:**
| Placeholder | Description |
|------------|-------------|
| %askingdomx_player_contribution% | Player's contribution |
| %askingdomx_player_daily_streak% | Daily reward streak |
| %askingdomx_player_active_title% | Active title |

**Duel:**
| Placeholder | Description |
|------------|-------------|
| %askingdomx_duel_wins% | Duel wins |
| %askingdomx_duel_losses% | Duel losses |
| %askingdomx_duel_winrate% | Duel win rate % |

**XP Economy:**
| Placeholder | Description |
|------------|-------------|
| %askingdomx_xp_level% | Player XP level |
| %askingdomx_xp_total% | Player total XP |
| %askingdomx_forge_level% | Forge level of held item |
| %askingdomx_forge_success_rate% | Forge success rate |`,
      },
      {
        title: 'Dependencies',
        content: `| Dependency | Type | Purpose |
|-----------|------|---------|
| Paper API 1.21.3 | Required | Server API |
| Vault | Soft | Economy integration |
| PlaceholderAPI | Soft | Placeholder support |
| ItemsAdder / Nexo / Oraxen | Soft | Custom item textures |
| Dynmap | Soft | Web map markers |
| HikariCP | Shaded | Connection pool |`,
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════
  // asAPI
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'asapi',
    productId: 'asapi',
    title: 'asAPI',
    category: 'Minecraft Plugin',
    description: 'Premium server-external API bridge for Minecraft, Discord, and website integration. Paper 1.21 | Java 21.',
    sections: [
      {
        title: 'Overview',
        content: `**asAPI** is a premium server-external API bridge that connects your Minecraft server with external services including websites and Discord.

**Version:** 1.0.0 | **Server:** Paper 1.21 | **Java:** 21 | **Build:** Gradle

**Features:**
- **Internal HTTP Server** — 13 API endpoints for external services on configurable host:port
- **Website Event Bridge** — Real-time events sent to external website (join/quit, chat, coins, reports)
- **Player Cache** — In-memory + persistent cache (UUID, name, online, group, balance, Discord ID)
- **Discord Integration** — JDA bot for account linking and announcements
- **Coin Bridge** — Currency operations (give/take/set) via Vault and PlayerPoints
- **Chat Bridge** — Forwards chat messages to website
- **Report System** — Player reports stored in DB, forwarded to website
- **Announcement System** — Broadcast via chat, title, or actionbar
- **Integration Manager** — Auto-detects asVerify, asGiveAway, Vault, PlayerPoints, LuckPerms, PlaceholderAPI
- **Node API** — Fastify-based external bridge server (separate process)
- **Security** — API-key auth, IP allowlist, rate limiting, IP hashing, audit logging`,
      },
      {
        title: 'Commands',
        content: `| Command | Permission | Description |
|---------|-----------|-------------|
| /asapi help | None | Show help |
| /asapi reload | asapi.reload | Reload configuration |
| /asapi status | asapi.status | View system status |
| /asapi debug | asapi.debug | View debug information |
| /asapi link | asapi.link | Generate Discord link code |
| /asapi unlink | asapi.unlink | Unlink Discord account |
| /asapi cache <player> | asapi.cache | View player cache |
| /asapi sync <player> | asapi.sync | Sync player data to website |
| /asapi announce <message> | asapi.announce | Send announcement |
| /asapi report <player> <reason> | asapi.report | Report a player |
| /asapi test | asapi.test | Run connection tests |
| /asapi test website | asapi.test | Test website connection |
| /asapi test discord | asapi.test | Test Discord connection |
| /asapi test http | asapi.test | Test HTTP server |`,
      },
      {
        title: 'Permissions',
        content: `| Permission | Default | Description |
|-----------|---------|-------------|
| asapi.admin | op | Full access |
| asapi.reload | op | Reload config |
| asapi.status | op | View status |
| asapi.debug | op | View debug |
| asapi.cache | op | View player cache |
| asapi.sync | op | Sync player data |
| asapi.announce | op | Send announcements |
| asapi.report.view | op | View reports |
| asapi.test | op | Run tests |
| asapi.link | true | Link Discord |
| asapi.unlink | true | Unlink Discord |
| asapi.report | true | Report a player |`,
      },
      {
        title: 'API Endpoints',
        content: `**Internal HTTP Server (port 8088, auth via X-asAPI-Key header):**
| Method | Path | Description |
|--------|------|-------------|
| GET | /health | Health check (public) |
| GET | /status | Plugin status |
| GET | /players/online | List online players |
| GET | /players/{uuid} | Player cache by UUID |
| GET | /players/name/{name} | Player cache by name |
| POST | /announcements/send | Send broadcast |
| POST | /coins/give | Give currency |
| POST | /coins/take | Take currency |
| POST | /coins/set | Set balance |
| POST | /discord/link/start | Generate link code |
| POST | /discord/link/complete | Complete Discord link |
| POST | /giveaway/event | Giveaway event |
| POST | /reports/create | Create report |
| POST | /auth/verify | Check verification |

**Node API (port 3000, auth via Bearer token):**
| Method | Path | Description |
|--------|------|-------------|
| GET | /health | Health check |
| POST | /minecraft/events | Receive events |
| GET | /minecraft/players/:uuid | Get player data |
| POST | /minecraft/coins/give | Give coins |
| POST | /minecraft/coins/take | Take coins |
| POST | /minecraft/announcements/send | Send announcement |
| POST | /discord/link/start | Generate link code |
| POST | /discord/link/complete | Complete link |
| POST | /reports/create | Create report |
| GET | /reports | Get all reports |`,
      },
      {
        title: 'Dependencies',
        content: `| Dependency | Type | Purpose |
|-----------|------|---------|
| Paper API 1.21.1 | Required | Server API |
| JDA 5.0.2 | Shaded | Discord bot |
| HikariCP 5.1.0 | Shaded | Connection pool |
| Gson 2.10.1 | Shaded | JSON |
| OkHttp 4.12.0 | Shaded | HTTP client |
| Vault | Soft | Economy |
| LuckPerms | Soft | Permissions |
| asVerify | Soft | Verification |
| asGiveAway | Soft | Giveaway |`,
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════
  // asGiveAway
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'asgiveaway',
    productId: 'asgiveaway',
    title: 'asGiveAway',
    category: 'Minecraft Plugin',
    description: 'Premium GUI-based giveaway manager with Discord webhook integration and multi-reward support. Paper 1.21 | Java 21.',
    sections: [
      {
        title: 'Overview',
        content: `**asGiveAway** is a premium GUI-based giveaway manager for Minecraft servers with full Discord webhook integration.

**Version:** 1.0.0 | **Server:** Paper 1.21 | **Java:** 21 | **Build:** Gradle

**Features:**
- **Giveaway Lifecycle** — Create, edit, start, pause, finish, delete. Status: PENDING → ACTIVE → PAUSED / FINISHED / CANCELLED
- **GUI Menu** — Interactive inventory with active/history/upcoming views, paginated, click-to-join
- **Multi-Reward** — 7 types: COMMAND, LUCKPERMS_ROLE, CRATE_KEY, ITEM, VAULT, PLAYERPOINTS, CUSTOM
- **Roll System** — Configurable winner count, random shuffle, skips non-Discord-linked players
- **Discord Webhook** — Events: giveaway_started, giveaway_ended, giveaway_winner
- **asAPI Integration** — Discord link enforcement, website event forwarding
- **Animation System** — Title/subtitle animations during active giveaways, customizable sounds
- **Persistence** — SQLite / MySQL, auto-save on every state change
- **Edit Mode** — Admin edit mode with auto-exit on disconnect`,
      },
      {
        title: 'Commands',
        content: `**/asgiveaway** (alias: /aga)
| Subcommand | Permission | Description |
|------------|-----------|-------------|
| help | None | Show help |
| create <name> | asgiveaway.create | Create a giveaway |
| edit <name> | asgiveaway.edit | Enter edit mode |
| addp <type> <name> <value> [amount] [duration] | asgiveaway.addproduct | Add a product |
| start <name> | asgiveaway.start | Start a giveaway |
| pause <name> | asgiveaway.pause | Pause a giveaway |
| finish <name> | asgiveaway.finish | End a giveaway early |
| timeset <name> <hours> | asgiveaway.timeset | Set duration |
| rollset <count> | asgiveaway.rollset | Set roll count |
| reload | asgiveaway.reload | Reload config |

**/giveaway** (alias: /gw)
| Subcommand | Permission | Description |
|------------|-----------|-------------|
| (none) | asgiveaway.use | Open GUI |
| join <name> | asgiveaway.join | Join a giveaway |
| leave <name> | asgiveaway.leave | Leave a giveaway |

**Product Types:**
| Type | Description |
|------|-------------|
| COMMAND | Execute console command with {player} and {uuid} |
| LUCKPERMS_ROLE | Assign LuckPerms group (supports temporary via durationMinutes) |
| CRATE_KEY | Give ExcellentCrates crate key |
| ITEM | Give Minecraft item by Material name |
| VAULT | Give economy money |
| PLAYERPOINTS | Give PlayerPoints |
| CUSTOM | Execute custom console command |`,
      },
      {
        title: 'Permissions',
        content: `| Permission | Default | Description |
|-----------|---------|-------------|
| asgiveaway.admin | op | Full access |
| asgiveaway.create | op | Create giveaways |
| asgiveaway.edit | op | Edit giveaways |
| asgiveaway.start | op | Start giveaways |
| asgiveaway.pause | op | Pause giveaways |
| asgiveaway.finish | op | Finish giveaways |
| asgiveaway.timeset | op | Set time |
| asgiveaway.rollset | op | Set roll count |
| asgiveaway.addproduct | op | Add product |
| asgiveaway.reload | op | Reload |
| asgiveaway.use | true | Use menu |
| asgiveaway.join | true | Join giveaways |
| asgiveaway.leave | true | Leave giveaways |`,
      },
      {
        title: 'Configuration',
        content: '```yaml\nplugin:\n  prefix: "&8[&#FFD700&las&#FFA500&lGiveAway&8] &7»"\n  language: "en_US"\n  debug: false\n  server-id: "survival"\n\nstorage:\n  type: "sqlite"\n  sqlite-file: "giveaways.db"\n  mysql:\n    host: "127.0.0.1"\n    port: 3306\n    database: "asgiveaway"\n    username: "root"\n    password: "CHANGE_ME"\n\ngiveaway:\n  default-duration-hours: 24\n  min-duration-hours: 1\n  max-duration-hours: 720\n  max-active-giveaways: 10\n  require-discord-link: true\n\ndiscord-webhook:\n  enabled: true\n  url: "http://localhost:3099/giveaway/webhook"\n  timeout-ms: 3000\n\nintegrations:\n  asAPI: { enabled: true, required: false }\n  luckperms: { enabled: true, required: false }\n  excellentcrates: { enabled: true, required: false }\n  vault: { enabled: true, required: false }\n\nmenu:\n  title: "&#FFD700Giveaways"\n  active-slot: 11\n  history-slot: 13\n  upcoming-slot: 15\n```',
      },
      {
        title: 'Dependencies',
        content: `| Dependency | Type | Purpose |
|-----------|------|---------|
| Paper API 1.21.1 | Required | Server API |
| LuckPerms | Soft | Role rewards |
| Vault | Soft | Economy |
| ExcellentCrates | Soft | Crate keys |
| asAPI | Soft | Discord linking |
| Gson 2.10.1 | Shaded | JSON |
| HikariCP 5.1.0 | Shaded | MySQL pool |
| OkHttp 4.12.0 | Shaded | Webhook HTTP |`,
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════
  // asVerifyDC
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'asverifydc',
    productId: 'asverifydc',
    title: 'asVerifyDC',
    category: 'Minecraft Plugin',
    description: 'Premium Discord verification bridge — link Discord & Minecraft accounts through secure code-based verification. Paper 1.21 | Java 21.',
    sections: [
      {
        title: 'Overview',
        content: `**asVerifyDC** is a premium Discord verification bridge that securely links Discord and Minecraft accounts through a code-based verification system.

**Version:** 1.0.0 | **Server:** Paper 1.21 | **Java:** 21 | **Build:** Maven

**Features:**
- **Code Verification** — Generate codes in-game, verify via Discord /verify code:<code>
- **Discord Integration** — Full JDA bot with 3 slash commands
- **Role Sync** — Auto-assign Discord role on successful verification
- **LuckPerms Sync** — Grant/revoke permission nodes on verify/unlink
- **Gate Feature** — Block commands for unverified players
- **REST API** — Optional HTTP API for external integrations
- **PlaceholderAPI** — 5 placeholders for verification status and Discord info
- **Multi-Database** — SQLite or MySQL with HikariCP
- **Multi-Language** — Türkçe, English, Русский
- **Audit Logging** — Full audit trail of all verification actions`,
      },
      {
        title: 'Commands',
        content: `**In-Game Commands:**
| Command | Permission | Description | Aliases |
|---------|-----------|-------------|---------|
| /verify | asverifydc.use | Generate code or check status | link |
| /unlink | asverifydc.use | Unlink Discord account | — |
| /asverifydc | asverifydc.admin | Admin management | — |

**/asverifydc Subcommands:**
| Subcommand | Description |
|------------|-------------|
| reload | Reload config and language files |
| info | Plugin status |
| status <player> | Check link status |
| forceverify <player> <discordId> <discordName> | Force-verify |
| unlink <player> | Force-unlink |
| testdiscord <channelId> | Test Discord connection |

**Discord Slash Commands:**
| Command | Options | Description |
|---------|---------|-------------|
| /verify | code (String, required) | Enter 6-digit code |
| /unlink | — | Unlink Discord account |
| /verify-status | — | Check verification status |`,
      },
      {
        title: 'Permissions',
        content: `| Permission | Default | Description |
|-----------|---------|-------------|
| asverifydc.use | true | Use verify/unlink commands |
| asverifydc.admin | op | Admin commands |
| asverifydc.bypass | op | Bypass gate feature |
| asverifydc.verified | (granted on verify) | LuckPerms node |`,
      },
      {
        title: 'Placeholders',
        content: `**Identifier:** asverifydc
| Placeholder | Returns | Description |
|------------|---------|-------------|
| %asverifydc_verified% | yes / no | Verification status |
| %asverifydc_status% | verified / unverified | Human-readable |
| %asverifydc_discord_id% | Discord ID | Linked account ID |
| %asverifydc_discord_name% | Username | Linked account name |
| %asverifydc_verify_date% | Date string | Verification date |`,
      },
      {
        title: 'Configuration',
        content: '```yaml\nlang: tr\ndatabase:\n  type: sqlite\n  sqlite-file: verifydc.db\n  mysql:\n    host: 127.0.0.1\n    port: 3306\n    database: pera_core\n    username: pera_user\n    password: change_me\n\nverify:\n  code-length: 6\n  code-ttl-seconds: 600\n  request-cooldown-seconds: 30\n  max-attempt-per-code: 5\n  relink-allowed: false\n\ndiscord:\n  enabled: true\n  token: "CHANGE_ME"\n  guild-id: "000000000000000000"\n  verified-role-id: "000000000000000000"\n\nluckperms:\n  grant-node-on-verify: "asverifydc.verified"\n  revoke-node-on-unlink: true\n\ngate:\n  enabled: false\n  blocked-commands: [ah, auctionhouse, cekilis]\n  allow-commands: [verify, link, login, register]\n\napi:\n  enabled: false\n  bind: 127.0.0.1\n  port: 19081\n  key: CHANGE_ME\n```',
      },
      {
        title: 'Dependencies',
        content: `| Dependency | Type | Purpose |
|-----------|------|---------|
| Paper API 1.21.1 | Required | Server API |
| JDA 5.1.0 | Shaded | Discord bot |
| HikariCP 5.1.0 | Shaded | Connection pool |
| SQLite JDBC 3.46.1.3 | Shaded | SQLite driver |
| MySQL Connector 8.0.33 | Shaded | MySQL driver |
| LuckPerms API 5.4 | Provided | Permission sync |
| PlaceholderAPI 2.11.6 | Provided | Placeholders |`,
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════
  // asModeration (Discord Bot)
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'asmoderation',
    productId: 'asmoderation',
    title: 'asModeration',
    category: 'Discord Bot',
    description: 'Premium Discord moderation bot with auto-moderation, ticket system, application system, product store, and multilingual support. Discord.js v14 | Node.js.',
    sections: [
      {
        title: 'Overview',
        content: `**asModeration** is a premium Discord moderation bot built with Discord.js v14, featuring auto-moderation, ticket system, applications, product store, and more.

**Runtime:** Node.js (ESM) | **Framework:** Discord.js v14

**Modules:**
- **Moderation** — Ban, kick, mute, warn, clear, slowmode, lock/unlock. Full case management.
- **Auto-Moderation** — 6 modules: antiSpam, antiLink, antiInvite, antiMassMention, antiCaps, antiNewAccount
- **Ticket System** — Category-based ticket creation, staff claim/add/remove/rename/close, transcript logging
- **Application System** — 4-question collector flow, accept/deny with logging
- **Product Store** — Full CRUD for products, references system, embed displays
- **Verification Bridge** — HTTP server (port 3098) for Minecraft account linking
- **Giveaway Bridge** — HTTP server (port 3099) for giveaway webhook events
- **Setup System** — One-command server setup with all roles, channels, permissions
- **Multi-Language** — tr (Türkçe), en (English), ru (Русский) — 111 keys each
- **Logging** — 12 log channels for all server events`,
      },
      {
        title: 'Commands',
        content: `**Setup & Config:**
| Command | Permission | Description |
|---------|-----------|-------------|
| /setup-server | Administrator | Full server setup (roles, channels, permissions) |
| /set-language | Administrator | Change server language |
| /create-panels | Administrator | Create embed panels |
| /create-lang-panel | Administrator | Create language selection panel |

**Moderation:**
| Command | Permission | Description |
|---------|-----------|-------------|
| /ban <user> [reason] | BanMembers | Ban a user |
| /unban <user_id> | BanMembers | Unban a user |
| /kick <user> [reason] | KickMembers | Kick a user |
| /mute <user> [reason] [duration] | ModerateMembers | Mute a user |
| /unmute <user> | ModerateMembers | Unmute |
| /warn <user> [reason] | ModerateMembers | Warn a user |
| /warnings <user> | ModerateMembers | View warnings |
| /clear <count> | ManageMessages | Clear messages (1-100) |
| /slowmode <seconds> | ManageChannels | Set slowmode |
| /lock | ManageChannels | Lock channel |
| /unlock | ManageChannels | Unlock channel |

**Tickets:**
| Command | Permission | Description |
|---------|-----------|-------------|
| /ticket-close | Staff | Close ticket |
| /ticket-add <user> | Staff | Add user to ticket |
| /ticket-remove <user> | Staff | Remove user |
| /ticket-claim | Staff | Claim ticket |
| /ticket-rename <name> | Staff | Rename ticket |

**Information:**
| Command | Permission | Description |
|---------|-----------|-------------|
| /help | Everyone | Help menu |
| /info | Everyone | Server info |
| /services | Everyone | Services list |
| /products | Everyone | Products list |
| /prices | Everyone | Pricing info |
| /contact | Everyone | Contact info |

**Announcements:**
| Command | Permission | Description |
|---------|-----------|-------------|
| /announce | Administrator | Post announcement |
| /update | Administrator | Post update (modal) |
| /product-announce | Administrator | Product announcement |
| /embed | Administrator | Custom embed |

**Applications:**
| Command | Permission | Description |
|---------|-----------|-------------|
| /apply | Everyone | Submit application |
| /applications | Administrator | View applications |
| /application-accept <id> | Administrator | Accept application |
| /application-deny <id> [reason] | Administrator | Deny application |

**Products & References:**
| Command | Permission | Description |
|---------|-----------|-------------|
| /product-add | Administrator | Add product |
| /product-edit <id> | Administrator | Edit product |
| /product-remove <id> | Administrator | Remove product |
| /product-info <id> | Everyone | View product |
| /reference-add | Administrator | Add reference |
| /reference-remove <id> | Administrator | Remove reference |
| /references | Everyone | View references |

**Verification:**
| Command | Permission | Description |
|---------|-----------|-------------|
| /verify <code> | Everyone | Verify Minecraft account |`,
      },
      {
        title: 'Auto-Moderation',
        content: `| Module | Detection | Default Action |
|--------|-----------|---------------|
| antiSpam | >3 messages in 5 seconds | warn |
| antiLink | URLs in messages | delete |
| antiInvite | Discord invite links | delete |
| antiMassMention | >5 @everyone/@here/role/user mentions | delete |
| antiCaps | >70% uppercase (min 10 chars) | warn |
| antiNewAccount | Account age < 7 days | warn |`,
      },
      {
        title: 'Log Channels',
        content: `| Channel | Events Logged |
|---------|---------------|
| girislog | Member join/leave, rules accepted |
| mesajlog | Message log |
| msjsilmelog | Message deleted |
| msjduzenlog | Message edited |
| seslog | Voice state changes |
| rollog | Role added/removed |
| kanallog | Channel created/deleted |
| modlogchan | Ban/kick/mute/warn |
| ticketlog | Ticket created/closed |
| basvurular | Application submitted/accepted/denied |
| botlog | Bot events |
| sistemlog | System events |`,
      },
      {
        title: 'Languages',
        content: `| Language | Code | File |
|----------|------|------|
| Türkçe | tr | src/languages/tr.json |
| English | en | src/languages/en.json |
| Русский | ru | src/languages/ru.json |

111 translatable keys per language covering all moderation messages, ticket system, applications, products, references, roles, and logging.`,
      },
      {
        title: 'Dependencies',
        content: `| Package | Version | Purpose |
|---------|---------|---------|
| discord.js | ^14.18.0 | Discord API |
| better-sqlite3 | ^11.7.0 | Database |
| chalk | ^5.4.1 | Terminal colors |`,
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════
  // Minecraft Server System Pack
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'minecraft-packet',
    productId: 'minecraft-packet',
    title: 'Minecraft Server System Pack',
    category: 'Minecraft Setup',
    description: 'Economy, rank, protection, and game systems installation and management guide.',
    sections: [
      {
        title: 'Installation',
        content: `1. Place all .jar files from the pack into the \`plugins/\` folder.
2. Restart the server.
3. Each plugin will create its own folder.
4. Edit the config.yml files in sequence.
5. Run \`/asadmin setup\` to complete the initial setup.`,
      },
      {
        title: 'Components',
        content: `Plugins included in the pack:

- **asEconomy** — Advanced economy and currency system
- **asRanks** — Rank and permission management
- **asProtect** — Region protection system
- **asGames** — Custom game modes
- **asAntiCheat** — Cheat protection integration

Each plugin has its own config.yml and can be configured independently.`,
      },
      {
        title: 'Commands',
        content: `**asEconomy:**
| Command | Description |
|---------|-------------|
| /money | Shows your balance |
| /pay <player> <amount> | Sends money |
| /bal <player> | Shows player balance |

**asRanks:**
| Command | Description |
|---------|-------------|
| /rank set <player> <rank> | Sets a rank |
| /rank create <name> | Creates a rank |

**asProtect:**
| Command | Description |
|---------|-------------|
| /region create <name> | Creates a region |
| /region addmember <name> <player> | Adds a member |`,
      },
      {
        title: 'Troubleshooting',
        content: `**1. Plugins conflicting**
→ Check compatibility with other plugins. Remove unnecessary plugins.

**2. Database error**
→ Check your MySQL connection credentials.
→ Make sure tables have been created.

**3. Permission system not working**
→ Verify that permission groups are correctly defined in the asRanks config.`,
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════
  // Website Setup Pack
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'web-packet',
    productId: 'web-packet',
    title: 'Website Setup Pack',
    category: 'Design',
    description: 'Website installation, theme management, and panel usage guide.',
    sections: [
      {
        title: 'Installation',
        content: `1. Upload the files to your hosting panel.
2. Edit the .env file.
3. Install dependencies with \`npm install\`.
4. Build the site with \`npm run build\`.
5. Start the site with \`npm start\`.`,
      },
      {
        title: '.env Configuration',
        content: '```env\nDATABASE_URL="mysql://user:password@localhost:3306/nartforge"\nAPI_KEY="YOUR_API_KEY"\nDISCORD_CLIENT_ID="DISCORD_CLIENT_ID"\nSITE_URL="https://YOURSITE.com"\n```\nDiscord client secret and payment secrets must stay in the backend environment only.',
      },
      {
        title: 'Troubleshooting',
        content: `**1. Site not loading**
→ Check port settings and firewall rules.
→ If npm run build fails, inspect the console output.

**2. Database connection error**
→ Check the database credentials in .env.
→ Make sure your hosting provider allows remote connections.

**3. Discord login not working**
→ Set the correct redirect URLs in Discord Developer Portal.
→ Check the Client ID and Secret credentials.`,
      },
    ],
  },
]

export const wikiCategories = [
  'Minecraft Plugin',
  'Discord Bot',
  'Minecraft Setup',
  'Design',
] as const
