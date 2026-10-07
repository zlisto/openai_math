export interface Paper {
  title: string
  pdf: string
  abstract: string
  missing?: boolean
}

export interface Family {
  id: string
  title: string
  summary: string
  lean?: string
  papers: Paper[]
}

export interface ReasoningTrace {
  familyId: string
  title: string
  pdf: string
}

export interface Catalog {
  generatedAt: string
  manuscriptCount: number
  familyCount: number
  missingPdfCount: number
  overviewPdf: string
  families: Family[]
  reasoningTraces: ReasoningTrace[]
}

export type ViewerTarget =
  | { kind: 'overview' }
  | { kind: 'paper'; familyId: string; pdf: string; title: string }
  | { kind: 'trace'; pdf: string; title: string }
  | null
