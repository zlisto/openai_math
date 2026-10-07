/**
 * Parse ../CONTENTS.md into public/catalog.json for the paper navigator.
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const siteRoot = path.resolve(__dirname, '..')
const root = path.resolve(siteRoot, '..') // math/ repo root
const contentsPath = path.join(root, 'CONTENTS.md')
const outPath = path.join(siteRoot, 'public', 'catalog.json')

const md = fs.readFileSync(contentsPath, 'utf8')

/** @typedef {{ id: string, title: string, summary: string, lean?: string, papers: Paper[] }} Family */
/** @typedef {{ title: string, pdf: string, abstract: string }} Paper */

/** @type {Family[]} */
const families = []
/** @type {Family | null} */
let current = null

const familyRe = /^\*\*(\d{3})\.\s*(.+?)\*\*\s*(.*)$/
const paperRe = /^&emsp;\[([^\]]+)\]\((preprints\/[^)]+\.pdf)\)\s*$/
const leanRe = /\[Lean\]\(([^)]+)\)/

const lines = md.split(/\r?\n/)

for (let i = 0; i < lines.length; i++) {
  const line = lines[i]

  const fm = line.match(familyRe)
  if (fm) {
    current = {
      id: fm[1],
      title: fm[2].trim(),
      summary: fm[3].trim(),
      papers: [],
    }
    const lean = current.summary.match(leanRe)
    if (lean) {
      current.lean = lean[1]
      current.summary = current.summary.replace(leanRe, '').trim()
    }
    families.push(current)
    continue
  }

  const pm = line.match(paperRe)
  if (pm && current) {
    const title = pm[1].trim()
    const pdf = pm[2].trim()
    // abstract: following non-empty lines until blank or next structural line
    const absParts = []
    let j = i + 1
    while (j < lines.length) {
      const L = lines[j]
      if (
        L.trim() === '' ||
        L.startsWith('</td>') ||
        L.startsWith('<') ||
        L.startsWith('**') ||
        L.startsWith('&emsp;')
      ) {
        // allow single blank then stop if next is structural; collect until blank
        if (L.trim() === '') break
        if (L.startsWith('&emsp;') || L.startsWith('**') || L.startsWith('<')) break
      }
      if (!L.startsWith('<') && L.trim()) absParts.push(L.trim())
      j++
    }
    current.papers.push({
      title,
      pdf,
      abstract: absParts.join(' '),
    })
  }
}

// Reasoning traces from README table (hardcode scan)
const readme = fs.readFileSync(path.join(root, 'README.md'), 'utf8')
const traces = []
const traceRe =
  /\|\s*(\d+)\s*\|\s*\[([^\]]+)\]\((reasoning_traces\/[^)]+\.pdf)\)\s*\|/g
let tm
while ((tm = traceRe.exec(readme)) !== null) {
  traces.push({
    familyId: tm[1].padStart(3, '0'),
    title: tm[2],
    pdf: tm[3],
  })
}

// Verify PDFs exist
let missing = 0
for (const f of families) {
  for (const p of f.papers) {
    const full = path.join(root, p.pdf)
    if (!fs.existsSync(full)) {
      missing++
      p.missing = true
    }
  }
}

const catalog = {
  generatedAt: new Date().toISOString(),
  manuscriptCount: families.reduce((n, f) => n + f.papers.length, 0),
  familyCount: families.length,
  missingPdfCount: missing,
  overviewPdf: 'overview.pdf',
  families,
  reasoningTraces: traces,
}

fs.mkdirSync(path.dirname(outPath), { recursive: true })
fs.writeFileSync(outPath, JSON.stringify(catalog, null, 2))
console.log(
  `Wrote ${catalog.familyCount} families, ${catalog.manuscriptCount} papers → ${outPath}` +
    (missing ? ` (${missing} missing PDFs)` : ''),
)
