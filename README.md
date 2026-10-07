# OpenAI Math · Paper Navigator

Black/pink browser for the [openai/math](https://github.com/openai/math) manuscript collection.

**Live site:** https://zlisto.github.io/openai_math/

PDFs are loaded from the public `openai/math` repo (via jsDelivr). This repository only hosts the navigator UI + catalog.

## Local development

Clone or use alongside a local copy of `openai/math` (PDFs served from the parent folder in dev):

```bash
npm install
npm run dev
```

Open http://localhost:5174/

## Deploy

Pushes to `main` build and publish GitHub Pages via Actions.
