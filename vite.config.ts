import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'
import fs from 'node:fs'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const mathRoot = path.resolve(__dirname, '..')

function serveMathRepo(): Plugin {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handler = (req: any, res: any, next: () => void) => {
    const raw = (req.url as string | undefined)?.split('?')[0] ?? ''
    if (
      !raw.startsWith('/preprints/') &&
      !raw.startsWith('/reasoning_traces/') &&
      raw !== '/overview.pdf'
    ) {
      next()
      return
    }

    const decoded = decodeURIComponent(raw)
    const filePath = path.join(mathRoot, decoded.replace(/^\//, ''))
    const resolved = path.resolve(filePath)
    if (!resolved.startsWith(mathRoot) || !fs.existsSync(resolved)) {
      res.statusCode = 404
      res.end('Not found')
      return
    }

    const ext = path.extname(resolved).toLowerCase()
    const types: Record<string, string> = {
      '.pdf': 'application/pdf',
      '.md': 'text/markdown; charset=utf-8',
      '.tex': 'text/plain; charset=utf-8',
      '.bib': 'text/plain; charset=utf-8',
    }
    const stat = fs.statSync(resolved)
    res.setHeader('Content-Type', types[ext] ?? 'application/octet-stream')
    res.setHeader('Content-Disposition', 'inline')
    res.setHeader('Content-Length', String(stat.size))
    fs.createReadStream(resolved).pipe(res)
  }

  return {
    name: 'serve-math-repo',
    configureServer(server) {
      server.middlewares.use(handler)
    },
    configurePreviewServer(server) {
      server.middlewares.use(handler)
    },
  }
}

export default defineConfig({
  // GitHub Pages project site: https://zlisto.github.io/openai_math/
  base: process.env.VITE_BASE || '/',
  plugins: [react(), serveMathRepo()],
  server: {
    port: 5174,
    fs: { allow: [mathRoot, __dirname] },
  },
  preview: {
    port: 5174,
  },
})
