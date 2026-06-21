import { useState } from 'react'
import { useLanguage } from '../context/LanguageContext'
import ScrollReveal from '../components/ScrollReveal'
import DiscordCTA from '../components/DiscordCTA'
import { wikiArticles, wikiCategories } from '../data/wiki'
import { getWikiDetail } from '../data/wikiDetail'
import { tReplace } from '../data/translations'
import { products, wikiCategoryIcons } from '../data/products'

export default function Wiki() {
  const { t } = useLanguage()
  const severityConfig: Record<string, { label: string; color: string }> = {
    'common': { label: t('wiki.commonIssue'), color: '#F59E0B' },
    'critical': { label: t('wiki.critical'), color: '#EF4444' },
    'easy-fix': { label: t('wiki.easyFix'), color: '#22C55E' },
  }
  const [activeCategory, setActiveCategory] = useState<string>(wikiCategories[0])
  const [activeArticle, setActiveArticle] = useState<string | null>(null)
  const [activeSection, setActiveSection] = useState(0)
  const [search, setSearch] = useState('')
  const [expandedError, setExpandedError] = useState<string | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const categoryArticles = wikiArticles.filter(a => a.category === activeCategory)
  const currentArticle = activeArticle
    ? wikiArticles.find(a => a.id === activeArticle) || null
    : null
  const wikiDetail = currentArticle ? getWikiDetail(currentArticle.productId) : null
  const currentSection = currentArticle?.sections[activeSection] || null

  const searchedArticles = search.trim()
    ? wikiArticles.filter(a =>
        a.title.toLowerCase().includes(search.toLowerCase()) ||
        a.description.toLowerCase().includes(search.toLowerCase()) ||
        a.category.toLowerCase().includes(search.toLowerCase())
      )
    : null

  const handleSelectArticle = (id: string) => {
    setActiveArticle(id)
    setActiveSection(0)
    setExpandedError(null)
  }

  const handleSelectCategory = (cat: string) => {
    setActiveCategory(cat)
    setActiveArticle(null)
    setActiveSection(0)
  }

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedId(id)
      setTimeout(() => setCopiedId(null), 2000)
    } catch {}
  }

  const CopyButton = ({ text, id }: { text: string; id: string }) => (
    <button
      onClick={() => copyToClipboard(text, id)}
      className="wiki-copy-btn"
      title={t('wiki.copyClipboard')}
    >
      {copiedId === id ? (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
      ) : (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
      )}
    </button>
  )

  const renderContent = (text: string) => {
    return text.split('\n').map((line, i) => {
      if (line.match(/^\*\*(.*)\*\*$/)) {
        return <h4 key={i} style={{ fontSize: '1rem', fontWeight: 700, marginTop: 24, marginBottom: 8, color: 'var(--text)' }}>{line.replace(/^\*\*(.*)\*\*$/, '$1')}</h4>
      }
      if (line.startsWith('> ')) {
        const isTip = line.startsWith('> 💡')
        return (
          <div key={i} className={`wiki-callout ${isTip ? 'wiki-callout-tip' : 'wiki-callout-info'}`}>
            <span>{isTip ? '💡' : 'ℹ️'}</span>
            <span>{line.replace(/^> (💡 )?/, '')}</span>
          </div>
        )
      }
      if (line.startsWith('| ') && line.endsWith(' |')) {
        const cells = line.split('|').filter(Boolean).map(c => c.trim())
        if (cells.every(c => c.includes('---'))) return null
        return (
          <div key={i} className="wiki-table-row">
            {cells.map((cell, j) => (
              <span key={j} className={`wiki-table-cell ${i <= 1 ? 'header' : ''}`}
                style={{
                  fontFamily: cell.startsWith('/') ? 'var(--font-mono)' : 'inherit',
                  fontSize: cell.startsWith('/') ? '0.82rem' : 'inherit',
                }}
              >{cell}</span>
            ))}
          </div>
        )
      }
      if (line.startsWith('- ')) {
        return <div key={i} className="wiki-list-item">{renderInline(line.replace('- ', ''))}</div>
      }
      if (line.startsWith('```')) return null
      if (line.trim() === '') return <div key={i} style={{ height: 8 }} />
      if (line.startsWith('  ') || line.startsWith('    ')) {
        return (
          <div key={i} className="wiki-code-block" style={{ position: 'relative' }}>
            <code style={{ whiteSpace: 'pre-wrap', lineHeight: 1.5 }}>{line}</code>
          </div>
        )
      }
      return <p key={i} style={{ color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: 8, fontSize: '0.9rem' }}>{renderInline(line)}</p>
    })
  }

  const renderInline = (text: string): React.ReactNode => {
    const parts: React.ReactNode[] = []
    let remaining = text
    let key = 0
    const regex = /(\*\*(.*?)\*\*)|`(.*?)`/g
    let lastIndex = 0
    let match: RegExpExecArray | null
    while ((match = regex.exec(remaining)) !== null) {
      if (match.index > lastIndex) parts.push(remaining.slice(lastIndex, match.index))
      if (match[1]) {
        parts.push(<strong key={key++} style={{ color: 'var(--text)' }}>{match[2]}</strong>)
      } else if (match[3]) {
        parts.push(<code key={key++} className="wiki-inline-code">{match[3]}</code>)
      }
      lastIndex = match.index + match[0].length
    }
    if (lastIndex < remaining.length) parts.push(remaining.slice(lastIndex))
    return parts.length > 0 ? <>{parts}</> : text
  }

  return (
    <div className="page-enter" style={{ paddingTop: 'calc(var(--nav-height) + 40px)' }}>
      <section className="section" style={{ paddingTop: 40, paddingBottom: 100 }}>
        <div className="container">
          {/* Hero */}
          <ScrollReveal className="text-center" style={{ marginBottom: 40 }}>
            <span className="section-label">{t('wiki.heroLabel')}</span>
            <h1 className="section-title">{t('wiki.title')}</h1>
            <p className="section-subtitle" style={{ maxWidth: 560, margin: '0 auto 28px' }}>
              {t('wiki.subtitle')}
            </p>
            {/* Search */}
            <div className="wiki-search-wrap" style={{ maxWidth: 480, margin: '0 auto' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              <input
                type="text" placeholder={t('wiki.searchPlaceholder')}
                value={search} onChange={e => setSearch(e.target.value)}
                className="wiki-search"
              />
              {search && (
                <button onClick={() => setSearch('')} className="wiki-search-clear">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
              )}
            </div>
          </ScrollReveal>

          {/* Search Results */}
          {searchedArticles && (
            <ScrollReveal style={{ marginBottom: 40 }}>
              <div className="wiki-search-results">
                <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 12 }}>
                  {tReplace(t('wiki.searchResults'), { count: searchedArticles.length })}
                </h3>
                {searchedArticles.length === 0 ? (
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{t('wiki.noGuides')}</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {searchedArticles.map(a => (
                      <button
                        key={a.id}
                        onClick={() => { setSearch(''); setActiveCategory(a.category); setActiveArticle(a.id); setActiveSection(0) }}
                        className="wiki-search-result-item"
                      >
                          <img src={wikiCategoryIcons[a.category] || '/icons/minecraft.png'} alt="" style={{width:20,height:20,borderRadius:4,flexShrink:0}} />
                          <div style={{ textAlign: 'left' }}>
                            <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{a.title}</div>
                            <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{a.category}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </ScrollReveal>
          )}

          {/* Layout */}
          {!searchedArticles && (
            <div style={{ display: 'flex', gap: 32, alignItems: 'flex-start' }} className="wiki-layout">
              {/* Sidebar */}
              <aside className="wiki-sidebar" style={{
                flexShrink: 0, width: 260,
                position: 'sticky', top: 'calc(var(--nav-height) + 40px)',
                maxHeight: 'calc(100vh - var(--nav-height) - 80px)',
                overflowY: 'auto',
              }}>
                <nav style={{
                  background: 'var(--bg-card)', border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-lg)', padding: 12,
                }}>
                  {wikiCategories.map(cat => {
                    const isActive = activeCategory === cat
                    const catArticles = wikiArticles.filter(a => a.category === cat)
                    return (
                      <div key={cat} style={{ marginBottom: 6 }}>
                        <button
                          onClick={() => handleSelectCategory(cat)}
                          style={{
                            width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                            padding: '12px 16px', borderRadius: 'var(--radius-sm)',
                            fontWeight: isActive ? 700 : 500,
                            color: isActive ? 'var(--primary)' : 'var(--text-secondary)',
                            background: isActive ? 'rgba(230,81,0,0.1)' : 'transparent',
                            fontSize: '0.9rem', transition: 'all var(--transition)',
                            textAlign: 'left', cursor: 'pointer',
                          }}
                        >
                          <img src={wikiCategoryIcons[cat] || '/icons/minecraft.png'} alt="" style={{width:22,height:22,borderRadius:5,flexShrink:0}} />
                          <span style={{ flex: 1, textAlign: 'left' }}>{t(`wiki.cat${cat.replace(/\s+/g, '')}`)}</span>
                          <span style={{
                            fontSize: '0.75rem', color: 'var(--text-muted)',
                            background: 'var(--bg-alt)', padding: '2px 8px', borderRadius: 'var(--radius-sm)',
                          }}>{catArticles.length}</span>
                        </button>
                        {isActive && catArticles.length > 0 && (
                          <div style={{ paddingLeft: 8, marginTop: 4, marginBottom: 4, display: 'flex', flexDirection: 'column', gap: 2 }}>
                            {catArticles.map(a => (
                              <button
                                key={a.id}
                                onClick={() => handleSelectArticle(a.id)}
                                style={{
                                  width: '100%', textAlign: 'left',
                                  padding: '8px 16px 8px 20px', borderRadius: 'var(--radius-sm)',
                                  fontSize: '0.84rem', fontWeight: activeArticle === a.id ? 600 : 400,
                                  color: activeArticle === a.id ? 'var(--text)' : 'var(--text-muted)',
                                  background: activeArticle === a.id ? 'var(--bg-alt)' : 'transparent',
                                  transition: 'all var(--transition)', cursor: 'pointer',
                                }}
                              >{a.title}</button>
                            ))}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </nav>
              </aside>

              {/* Content */}
              <main className="wiki-content" style={{ flex: 1, minWidth: 0 }}>
                {currentArticle && wikiDetail ? (
                  <>
                    {/* Article Header */}
                    <ScrollReveal>
                      <div className="wiki-detail-header">
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                          <img src={wikiCategoryIcons[currentArticle.category] || '/icons/minecraft.png'} alt="" style={{width:26,height:26,borderRadius:6,flexShrink:0}} />
                          <span className="wiki-cat-badge">{currentArticle.category}</span>
                          <span className="wiki-version-badge">v{wikiDetail.version}</span>
                        </div>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: '4px 0 6px' }}>{currentArticle.title}</h2>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>{currentArticle.description}</p>
                        <div className="wiki-detail-meta">
                          <span>{tReplace(t('wiki.supported'), { versions: wikiDetail.supportedVersions.join(', ') })}</span>
                          {wikiDetail.requirements.length > 0 && <span>{tReplace(t('wiki.dependencies'), { count: wikiDetail.requirements.length })}</span>}
                        </div>
                      </div>
                    </ScrollReveal>

                    {/* 3-Panel Layout */}
                    <div className="wiki-panels">
                      {/* Panel 1: Installation */}
                      <div className="wiki-panel">
                        <div className="wiki-panel-header">
                          <div className="wiki-panel-icon">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                          </div>
                          <div>
                            <h3 className="wiki-panel-title">{t('wiki.installation')}</h3>
                            <p className="wiki-panel-desc">{t('wiki.stepGuide')}</p>
                          </div>
                        </div>
                        <div className="wiki-panel-body">
                          <div className="wiki-req-box">
                            <strong>{t('wiki.requirements')}</strong>
                            <ul>
                              {wikiDetail.requirements.map((r, i) => <li key={i}>{r}</li>)}
                            </ul>
                          </div>
                          {wikiDetail.installationSteps.map(step => (
                            <div key={step.step} className={`wiki-step wiki-step-${step.type || 'info'}`}>
                              <div className="wiki-step-number">{step.step}</div>
                              <div style={{ flex: 1 }}>
                                <h4 className="wiki-step-title">{step.title}</h4>
                                <p className="wiki-step-desc">{step.content}</p>
                                {step.code && (
                                  <div className="wiki-code-block" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                                    <code style={{ whiteSpace: 'pre-wrap' }}>{step.code}</code>
                                    <CopyButton text={step.code} id={`install-${currentArticle.id}-${step.step}`} />
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Panel 2: Commands */}
                      <div className="wiki-panel">
                        <div className="wiki-panel-header">
                          <div className="wiki-panel-icon">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
                          </div>
                          <div>
                            <h3 className="wiki-panel-title">{t('wiki.commands')}</h3>
                            <p className="wiki-panel-desc">{tReplace(t('wiki.availableCommands'), { count: wikiDetail.commands.length })}</p>
                          </div>
                        </div>
                        <div className="wiki-panel-body">
                          <div className="wiki-cmd-grid">
                            {wikiDetail.commands.map((cmd, i) => (
                              <div key={i} className="wiki-cmd-card">
                                <div className="wiki-cmd-header">
                                  <code className="wiki-cmd-code">{cmd.command}</code>
                                  <CopyButton text={cmd.command} id={`cmd-${currentArticle.id}-${i}`} />
                                </div>
                                <p className="wiki-cmd-desc">{cmd.description}</p>
                                <div className="wiki-cmd-footer">
                                  <span className="wiki-perm-badge">{cmd.permission}</span>
                                  {cmd.example && (
                                    <span className="wiki-cmd-example" onClick={() => copyToClipboard(cmd.example!, `example-${currentArticle.id}-${i}`)}>
                                      Example: {cmd.example}
                                    </span>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Panel 3: Errors & Solutions */}
                      <div className="wiki-panel">
                        <div className="wiki-panel-header">
                          <div className="wiki-panel-icon">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                          </div>
                          <div>
                            <h3 className="wiki-panel-title">{t('wiki.errors')}</h3>
                            <p className="wiki-panel-desc">{tReplace(t('wiki.troubleshooting'), { count: wikiDetail.errors.length })}</p>
                          </div>
                        </div>
                        <div className="wiki-panel-body">
                          {wikiDetail.errors.map(err => {
                            const severity = severityConfig[err.severity]
                            const isOpen = expandedError === err.id
                            return (
                              <div key={err.id} className={`wiki-error-card ${isOpen ? 'open' : ''}`}>
                                <button
                                  className="wiki-error-header"
                                  onClick={() => setExpandedError(isOpen ? null : err.id)}
                                >
                                  <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 2 }}>
                                      <span className="wiki-error-title">{err.title}</span>
                                      <span className="wiki-severity-badge" style={{
                                        background: `${severity.color}15`,
                                        color: severity.color,
                                      }}>
                                        {severity.label}
                                      </span>
                                    </div>
                                    <span className="wiki-error-msg">{err.errorMessage}</span>
                                  </div>
                                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                                    style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s', flexShrink: 0 }}>
                                    <polyline points="6 9 12 15 18 9"/>
                                  </svg>
                                </button>
                                {isOpen && (
                                  <div className="wiki-error-body">
                                    <div className="wiki-error-section">
                                      <strong>{t('wiki.possibleCause')}</strong>
                                      <p>{err.possibleCause}</p>
                                    </div>
                                    <div className="wiki-error-section">
                                      <strong>{t('wiki.solution')}</strong>
                                      <p>{err.solution}</p>
                                    </div>
                                    <button className="wiki-error-support" onClick={() => window.open('https://discord.gg/6N8B4aMJkw', '_blank')}>
                                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                                      {t('wiki.stillStuck')}
                                    </button>
                                  </div>
                                )}
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Section content from WikiArticle */}
                    {currentSection && (
                      <ScrollReveal style={{ marginTop: 32 }}>
                        <div className="wiki-extra-content">
                          <div className="wiki-section-tabs">
                            {currentArticle.sections.map((section, i) => (
                              <button
                                key={i}
                                onClick={() => setActiveSection(i)}
                                className={`wiki-section-tab ${activeSection === i ? 'active' : ''}`}
                              >
                                {section.title}
                              </button>
                            ))}
                          </div>
                          <div style={{ padding: '24px 28px' }}>
                            {renderContent(currentSection.content)}
                          </div>
                        </div>
                      </ScrollReveal>
                    )}

                    {/* Support CTA */}
                    <ScrollReveal style={{ marginTop: 32 }}>
                      <div className="wiki-cta-card">
                        <h3 style={{ fontWeight: 800, marginBottom: 8, fontSize: '1.2rem', color: '#fff' }}>{t('wiki.needHelp')}</h3>
                        <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: 20, lineHeight: 1.7, maxWidth: 480, fontSize: '0.9rem' }}>
                          {t('wiki.needHelpDesc')}
                        </p>
                        <div className="wiki-cta-actions">
                          <DiscordCTA title={t('wiki.contactSupport')} variant="hero" style={{ padding: '12px 24px', fontSize: '0.9rem' }} />
                          <a href="https://discord.gg/6N8B4aMJkw" target="_blank" rel="noopener noreferrer" className="btn btn-secondary" style={{
                            padding: '12px 24px', fontSize: '0.9rem',
                            background: 'rgba(255,255,255,0.08)', color: '#fff',
                            border: '1px solid rgba(255,255,255,0.15)',
                          }}>
                            {t('wiki.joinDiscord')}
                          </a>
                          <a href="https://github.com/nartforge/plugin-wiki" target="_blank" rel="noopener noreferrer" className="btn btn-secondary" style={{
                            padding: '12px 24px', fontSize: '0.9rem',
                            background: 'rgba(255,255,255,0.08)', color: '#fff',
                            border: '1px solid rgba(255,255,255,0.15)',
                          }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: 6 }}><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>
                            {t('wiki.githubWiki')}
                          </a>
                        </div>
                      </div>
                    </ScrollReveal>
                  </>
                ) : (
                  <>
                    {/* Article Grid */}
                    <div style={{ marginBottom: 24 }}>
                      <h2 style={{ fontSize: '1.3rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                        <img src={wikiCategoryIcons[activeCategory] || '/icons/minecraft.png'} alt="" style={{width:22,height:22,borderRadius:5,flexShrink:0}} />
                        {t(`wiki.cat${activeCategory.replace(/\s+/g, '')}`)}
                      </h2>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', margin: 0 }}>
                        {tReplace(t('wiki.pages'), { count: categoryArticles.length, plural: categoryArticles.length === 1 ? t('wiki.page_one') : t('wiki.page_other') })}
                      </p>
                    </div>
                    <div className="grid-3">
                      {categoryArticles.map((article, i) => {
                        const detail = getWikiDetail(article.productId)
                        return (
                          <ScrollReveal key={article.id} delay={((i % 3) + 1) as 1|2|3}>
                            <button
                              onClick={() => handleSelectArticle(article.id)}
                              className="card wiki-card-hover"
                              style={{ padding: '28px 24px', textAlign: 'left', cursor: 'pointer', width: '100%', height: '100%' }}
                            >
                              <div style={{
                                width: 48, height: 48, borderRadius: 'var(--radius-md)',
                                background: products.find(p => p.id === article.productId)?.logo
                                  ? `linear-gradient(135deg, ${products.find(p => p.id === article.productId)?.accentColor || 'var(--primary)'}20, ${products.find(p => p.id === article.productId)?.accentColor || 'var(--primary)'}40)`
                                  : 'var(--gradient-primary)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                marginBottom: 14, overflow: 'hidden',
                              }}>
                                {(() => {
                                  const prod = products.find(p => p.id === article.productId)
                                  if (prod?.logo) {
                                    return <img src={prod.logo} alt={prod.name} style={{width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'var(--radius-md)'}} />
                                  }
                                  return <img src={wikiCategoryIcons[article.category] || '/icons/minecraft.png'} alt="" style={{width: 24, height: 24, borderRadius: 4}} />
                                })()}
                              </div>
                              <h3 style={{ fontWeight: 700, marginBottom: 6, fontSize: '0.95rem' }}>{article.title}</h3>
                              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: '0.85rem', marginBottom: 12 }}>
                                {article.description.length > 100 ? article.description.slice(0, 100) + '...' : article.description}
                              </p>
                              <div className="wiki-card-tags">
                                {detail && <span className="wiki-tag">v{detail.version}</span>}
                                {detail && <span className="wiki-tag">{tReplace(t('wiki.commandsCount'), { count: detail.commands.length })}</span>}
                                <span className="wiki-tag">{tReplace(t('wiki.sections'), { count: article.sections.length })}</span>
                              </div>
                            </button>
                          </ScrollReveal>
                        )
                      })}
                    </div>

                    {/* Bottom CTA */}
                    <ScrollReveal style={{ marginTop: 60 }}>
                      <div className="card" style={{
                        textAlign: 'center', padding: '48px 32px',
                        background: 'linear-gradient(135deg, rgba(88,101,242,0.05), rgba(88,101,242,0.02))',
                        border: '1px solid rgba(88,101,242,0.2)',
                      }}>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: 12 }}>{t('wiki.ctaTitle')}</h2>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: 28, maxWidth: 500, margin: '0 auto 28px', lineHeight: 1.7 }}>
                          {t('wiki.ctaDesc')}
                        </p>
                        <DiscordCTA variant="hero" title={t('wiki.ctaJoin')} />
                      </div>
                    </ScrollReveal>
                  </>
                )}
              </main>
            </div>
          )}

          <style>{`
            @media (max-width: 1024px) {
              .wiki-panels { grid-template-columns: 1fr 1fr !important; }
            }
            @media (max-width: 768px) {
              .wiki-layout { flex-direction: column; }
              .wiki-sidebar {
                width: 100% !important;
                position: static !important;
                max-height: none !important;
                margin-bottom: 24px;
              }
              .wiki-panels { grid-template-columns: 1fr !important; }
            }
          `}</style>
        </div>
      </section>
    </div>
  )
}
