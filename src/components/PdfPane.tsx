import type { ViewerTarget } from '../types'
import { pdfUrl } from '../urls'
import './PdfPane.css'

interface Props {
  target: ViewerTarget
  onClose: () => void
}

function resolveSrc(target: NonNullable<ViewerTarget>): { src: string; title: string } {
  if (target.kind === 'overview') {
    return { src: pdfUrl('overview.pdf'), title: 'Collection overview' }
  }
  return { src: pdfUrl(target.pdf), title: target.title }
}

export function PdfPane({ target, onClose }: Props) {
  if (!target) return null
  const { src, title } = resolveSrc(target)

  return (
    <div className="pdf-pane">
      <div className="pdf-pane__bar">
        <div className="pdf-pane__titles">
          <p className="pdf-pane__label">PDF viewer</p>
          <h2 className="pdf-pane__title">{title}</h2>
        </div>
        <div className="pdf-pane__actions">
          <a className="pdf-btn" href={src} target="_blank" rel="noreferrer">
            Open tab
          </a>
          <a className="pdf-btn ghost" href={src} target="_blank" rel="noreferrer">
            Download
          </a>
          <button type="button" className="pdf-btn close" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
      <iframe
        key={src}
        className="pdf-pane__frame"
        title={title}
        src={`${src}#view=FitH`}
      />
    </div>
  )
}
