import { useCallback, useEffect, useMemo, useState } from 'react'
import type { Catalog, Family, Paper, ViewerTarget } from './types'
import { PdfPane } from './components/PdfPane'
import { FamilyList } from './components/FamilyList'
import { assetUrl } from './urls'
import './App.css'

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

  const goHome = () => {
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
        <p className="hint">Run <code>npm run catalog</code> then <code>npm run dev</code>.</p>
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

  const split = viewer != null

  return (
    <div className={`app ${split ? 'is-split' : ''}`}>
      <header className="topbar">
        <div className="topbar__row">
          <button type="button" className="brand-block" onClick={goHome}>
            <p className="eyebrow">OpenAI · Math collection</p>
            <h1 className="brand">Paper Navigator</h1>
          </button>
          <nav className="nav" aria-label="Main">
            <button type="button" className="nav__link is-active" onClick={goHome}>
              Home
            </button>
          </nav>
        </div>
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
      </header>

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
          <button type="button" className="chip" onClick={() => setViewer({ kind: 'overview' })}>
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
            activePdf={viewer && 'pdf' in viewer ? viewer.pdf : null}
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

        {split && (
          <section className="viewer-pane">
            <PdfPane
              target={viewer}
              onClose={() => setViewer(null)}
            />
          </section>
        )}
      </div>
    </div>
  )
}
