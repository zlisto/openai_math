import { useCallback, useEffect, useMemo, useState } from 'react'
import type { Catalog, Family, Paper, ViewerTarget } from './types'
import { PdfPane } from './components/PdfPane'
import { FamilyList } from './components/FamilyList'
import { ChatBuddy } from './components/ChatBuddy'
import { Labubu } from './components/Labubu'
import { assetUrl } from './urls'
import './App.css'

type Page = 'welcome' | 'collection'

function matchesQuery(family: Family, q: string): boolean {
  if (!q) return true
  const hay = [
    family.id,
    family.title,
    family.summary,
    ...family.papers.flatMap((p) => [p.title, p.abstract, p.pdf]),
  ]
    .join(' ')
    .toLowerCase()
  return q
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .every((term) => hay.includes(term))
}

export default function App() {
  const [page, setPage] = useState<Page>('welcome')
  const [catalog, setCatalog] = useState<Catalog | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [query, setQuery] = useState('')
  const [viewer, setViewer] = useState<ViewerTarget>(null)
  const [expanded, setExpanded] = useState<Set<string>>(() => new Set())
  const [showTracesOnly, setShowTracesOnly] = useState(false)

  useEffect(() => {
    fetch(assetUrl('catalog.json'))
      .then((r) => {
        if (!r.ok) throw new Error(`catalog.json ${r.status}`)
        return r.json()
      })
      .then((data: Catalog) => setCatalog(data))
      .catch((e: Error) => setError(e.message))
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setViewer(null)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const filtered = useMemo(() => {
    if (!catalog) return []
    let list = catalog.families.filter((f) => matchesQuery(f, query))
    if (showTracesOnly) {
      const ids = new Set(catalog.reasoningTraces.map((t) => t.familyId))
      list = list.filter((f) => ids.has(f.id))
    }
    return list
  }, [catalog, query, showTracesOnly])

  const toggleExpand = useCallback((id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }, [])

  const openPaper = useCallback((familyId: string, paper: Paper) => {
    setViewer({
      kind: 'paper',
      familyId,
      pdf: paper.pdf,
      title: paper.title,
    })
  }, [])

  const expandAllFiltered = () => {
    setExpanded(new Set(filtered.map((f) => f.id)))
  }

  const collapseAll = () => setExpanded(new Set())

  const goWelcome = () => {
    setPage('welcome')
    setViewer(null)
    window.scrollTo(0, 0)
  }

  const goCollection = () => {
    setPage('collection')
    setViewer(null)
    setQuery('')
    setShowTracesOnly(false)
    setExpanded(new Set())
    window.scrollTo(0, 0)
  }

  if (error) {
    return (
      <div className="boot-error">
        <h1>Couldn’t load catalog</h1>
        <p>{error}</p>
        <p className="hint">
          Run <code>npm run catalog</code> then <code>npm run dev</code>.
        </p>
      </div>
    )
  }

  if (!catalog) {
    return (
      <div className="boot-loading">
        <div className="pulse" />
        <p>Loading manuscript map…</p>
      </div>
    )
  }

  const viewing = page === 'collection' && viewer != null

  return (
    <div
      className={`app ${viewing ? 'is-viewing' : ''} ${page === 'welcome' ? 'is-welcome' : ''}`}
    >
      <header className="topbar">
        <div className="topbar__row">
          <button type="button" className="brand-block" onClick={goWelcome}>
            <p className="eyebrow">OpenAI · Math collection</p>
            <div className="brand-line">
              <h1 className="brand">OpenAI Math Results Navigator</h1>
              <Labubu size={52} className="brand-labubu" title="Labubu" />
            </div>
          </button>
          <nav className="nav" aria-label="Main">
            <button
              type="button"
              className={`nav__link ${page === 'welcome' ? 'is-active' : ''}`}
              onClick={goWelcome}
            >
              Home
            </button>
            <button
              type="button"
              className={`nav__link ${page === 'collection' && !viewing ? 'is-active' : ''}`}
              onClick={goCollection}
            >
              Collection
            </button>
          </nav>
        </div>
        {page === 'collection' && !viewing && (
          <div className="stats">
            <span>
              <strong>{catalog.familyCount}</strong> families
            </span>
            <span>
              <strong>{catalog.manuscriptCount}</strong> papers
            </span>
            <span>
              <strong>{filtered.length}</strong> shown
            </span>
          </div>
        )}
      </header>

      {page === 'welcome' ? (
        <main className="welcome">
          <div className="welcome__copy">
            <h2 className="welcome__title">OpenAI Math Results Navigator</h2>
            <p className="welcome__voice">
              Okay so like… this page is your cute little map to OpenAI’s math papers.
              All the manuscript families, the PDFs, the search — right here. No digging
              through random folders like you’re lost in a warehouse. Soft life only.
            </p>
            <p className="welcome__voice">
              When you’re ready, tap <strong>Collection</strong>. Open a paper, skim around,
              check the reasoning traces if you want the tea. I’m not grading you. Just go
              have fun with it, okay?
            </p>
            <button type="button" className="welcome__cta" onClick={goCollection}>
              Enter the Collection
            </button>
          </div>
          <figure className="welcome__labubu">
            <Labubu size={300} float />
            <figcaption>my lab buddy · teeth included</figcaption>
          </figure>
        </main>
      ) : viewing ? (
        <section className="viewer-pane">
          <PdfPane target={viewer} onClose={() => setViewer(null)} />
        </section>
      ) : (
        <>
          <div className="toolbar">
            <div className="search-wrap">
              <span className="search-icon" aria-hidden>
                ⌕
              </span>
              <input
                className="search"
                type="search"
                placeholder="Search families, titles, abstracts…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                autoFocus
              />
              {query && (
                <button type="button" className="clear" onClick={() => setQuery('')}>
                  Clear
                </button>
              )}
            </div>
            <div className="toolbar-actions">
              <button
                type="button"
                className="chip"
                onClick={() => setViewer({ kind: 'overview' })}
              >
                Overview PDF
              </button>
              <button
                type="button"
                className={`chip ${showTracesOnly ? 'is-on' : ''}`}
                onClick={() => setShowTracesOnly((v) => !v)}
              >
                Reasoning traces
              </button>
              <button type="button" className="chip ghost" onClick={expandAllFiltered}>
                Expand
              </button>
              <button type="button" className="chip ghost" onClick={collapseAll}>
                Collapse
              </button>
            </div>
          </div>

          <div className="main">
            <aside className="list-pane">
              {showTracesOnly && (
                <section className="traces-banner">
                  <h2>Reasoning summaries</h2>
                  <ul>
                    {catalog.reasoningTraces.map((t) => (
                      <li key={t.pdf}>
                        <button
                          type="button"
                          onClick={() =>
                            setViewer({ kind: 'trace', pdf: t.pdf, title: t.title })
                          }
                        >
                          <span className="fid">{t.familyId}</span>
                          {t.title}
                        </button>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              <FamilyList
                families={filtered}
                expanded={expanded}
                activePdf={null}
                onToggle={toggleExpand}
                onOpenPaper={openPaper}
                traces={catalog.reasoningTraces}
                onOpenTrace={(t) =>
                  setViewer({ kind: 'trace', pdf: t.pdf, title: t.title })
                }
              />

              {filtered.length === 0 && (
                <p className="empty">No families match “{query}”.</p>
              )}
            </aside>
          </div>
        </>
      )}

      <ChatBuddy />
    </div>
  )
}
