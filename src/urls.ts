/** Base URL for manuscript PDFs (openai/math on GitHub). */
export const PDF_ORIGIN =
  import.meta.env.VITE_PDF_ORIGIN ??
  (import.meta.env.PROD
    ? 'https://cdn.jsdelivr.net/gh/openai/math@main/'
    : '/')

export function pdfUrl(relativePath: string): string {
  const clean = relativePath.replace(/^\//, '')
  if (import.meta.env.PROD || PDF_ORIGIN !== '/') {
    return `${PDF_ORIGIN.replace(/\/?$/, '/')}${clean}`
  }
  return `/${clean}`
}

export function assetUrl(path: string): string {
  const base = import.meta.env.BASE_URL || '/'
  const clean = path.replace(/^\//, '')
  return `${base}${clean}`
}
