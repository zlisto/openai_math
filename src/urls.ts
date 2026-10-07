/** Base URL for manuscript PDFs (openai/math on GitHub). */
const DEFAULT_PDF_ORIGIN = 'https://cdn.jsdelivr.net/gh/openai/math@main/'

/**
 * Always default to jsDelivr so `npm run dev` works without a local openai/math clone.
 * Override with VITE_PDF_ORIGIN=/ to use the Vite middleware + sibling repo checkout.
 */
export const PDF_ORIGIN = import.meta.env.VITE_PDF_ORIGIN ?? DEFAULT_PDF_ORIGIN

export function pdfUrl(relativePath: string): string {
  const clean = relativePath.replace(/^\//, '')
  // Encode each path segment (handles spaces / odd chars; keeps slashes).
  const encoded = clean
    .split('/')
    .map((part) => encodeURIComponent(part))
    .join('/')
  const origin = PDF_ORIGIN.replace(/\/?$/, '/')
  if (origin === '/' || origin === '') {
    return `/${encoded}`
  }
  return `${origin}${encoded}`
}

export function assetUrl(path: string): string {
  const base = import.meta.env.BASE_URL || '/'
  const clean = path.replace(/^\//, '')
  return `${base}${clean}`
}
