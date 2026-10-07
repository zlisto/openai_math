import type { Family, Paper, ReasoningTrace } from '../types'
import './FamilyList.css'

interface Props {
  families: Family[]
  expanded: Set<string>
  activePdf: string | null
  onToggle: (id: string) => void
  onOpenPaper: (familyId: string, paper: Paper) => void
  traces: ReasoningTrace[]
  onOpenTrace: (t: ReasoningTrace) => void
}

export function FamilyList({
  families,
  expanded,
  activePdf,
  onToggle,
  onOpenPaper,
  traces,
  onOpenTrace,
}: Props) {
  const traceByFamily = new Map(traces.map((t) => [t.familyId, t]))

  return (
    <ul className="family-list">
      {families.map((family) => {
        const open = expanded.has(family.id)
        const trace = traceByFamily.get(family.id)
        return (
          <li key={family.id} className={`family ${open ? 'is-open' : ''}`}>
            <button
              type="button"
              className="family__head"
              onClick={() => onToggle(family.id)}
              aria-expanded={open}
            >
              <span className="family__id">{family.id}</span>
              <span className="family__meta">
                <span className="family__title">{family.title}</span>
                <span className="family__summary">{family.summary}</span>
                <span className="family__count">
                  {family.papers.length} manuscript
                  {family.papers.length === 1 ? '' : 's'}
                  {trace ? ' · has reasoning trace' : ''}
                  {family.lean ? ' · Lean' : ''}
                </span>
              </span>
              <span className="family__chev" aria-hidden>
                {open ? '▾' : '▸'}
              </span>
            </button>

            {open && (
              <div className="family__body">
                {trace && (
                  <button
                    type="button"
                    className="trace-link"
                    onClick={() => onOpenTrace(trace)}
                  >
                    Open reasoning summary PDF
                  </button>
                )}
                <ul className="paper-list">
                  {family.papers.map((paper) => (
                    <li key={paper.pdf}>
                      <button
                        type="button"
                        className={`paper ${activePdf === paper.pdf ? 'is-active' : ''} ${paper.missing ? 'is-missing' : ''}`}
                        onClick={() => onOpenPaper(family.id, paper)}
                        disabled={paper.missing}
                      >
                        <span className="paper__title">{paper.title}</span>
                        {paper.abstract && (
                          <span className="paper__abs">{paper.abstract}</span>
                        )}
                        <span className="paper__path">{paper.pdf}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </li>
        )
      })}
    </ul>
  )
}
