import { useEffect, useState } from 'react'
import type { ViewerTarget } from '../types'
import { pdfUrl } from '../urls'
import './PdfPane.css'

interface Props {
  target: NonNullable<ViewerTarget>
  onClose: () => void
}

function resolveSrc(target: NonNullable<ViewerTarget>): { href: string; title: string } {
  if (target.kind === 'overview') {
    return { href: pdfUrl('overview.pdf'), title: 'Collection overview' }
  }
  return { href: pdfUrl(target.pdf), title: target.title }
}

export function PdfPane({ target, onClose }: Props) {
  const { href, title } = resolveSrc(target)
  const [blobUrl, setBlobUrl] = useState<string | null>(null)
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    let objectUrl: string | null = null

    setStatus('loading')
    setError(null)
    setBlobUrl(null)

    fetch(href)
      .then(async (res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const type = res.headers.get('content-type') || ''
        const buf = await res.arrayBuffer()
        const blob = new Blob([buf], {
          type: type.includes('pdf') ? type : 'application/pdf',
        })
        objectUrl = URL.createObjectURL(blob)
        if (cancelled) {
          URL.revokeObjectURL(objectUrl)
          return
        }
        setBlobUrl(objectUrl)
        setStatus('ready')
      })
      .catch((e: Error) => {
        if (cancelled) return
        setError(e.message || 'Failed to load PDF')
        setStatus('error')
      })

    return () => {
      cancelled = true
      if (objectUrl) URL.revokeObjectURL(objectUrl)
    }
  }, [href])

  return (
    <div className="pdf-pane">
      <div className="pdf-pane__bar">
        <div className="pdf-pane__titles">
          <p className="pdf-pane__label">PDF viewer</p>
          <h2 className="pdf-pane__title">{title}</h2>
        </div>
        <div className="pdf-pane__actions">
          <a className="pdf-btn" href={href} target="_blank" rel="noreferrer">
            Open tab
          </a>
          <a className="pdf-btn ghost" href={href} download target="_blank" rel="noreferrer">
            Download
          </a>
          <button type="button" className="pdf-btn close" onClick={onClose}>
            Close
          </button>
        </div>
      </div>

      {status === 'loading' && (
        <div className="pdf-pane__state">
          <div className="pulse" />
          <p>Loading PDF…</p>
        </div>
      )}

      {status === 'error' && (
        <div className="pdf-pane__state">
          <p>Couldn’t load this PDF.</p>
          <p className="pdf-pane__err">{error}</p>
          <a className="pdf-btn" href={href} target="_blank" rel="noreferrer">
            Open in new tab
          </a>
        </div>
      )}

      {status === 'ready' && blobUrl && (
        <iframe
          key={blobUrl}
          className="pdf-pane__frame"
          title={title}
          src={`${blobUrl}#view=FitH`}
        />
      )}
    </div>
  )
}
