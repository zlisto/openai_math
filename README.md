# OpenAI Math · Paper Navigator

Black/pink browser for the [openai/math](https://github.com/openai/math) manuscript collection.

**Live site:** https://zlisto.github.io/openai_math/

PDFs are loaded from the public `openai/math` repo (via jsDelivr). This repository only hosts the navigator UI + catalog.

## Local development

```bash
npm install
npm run dev
```

Open http://localhost:5174/

PDFs load from jsDelivr (`openai/math`) in both dev and production, so you do **not** need a local clone of that repo.

Optional: to serve PDFs from a sibling `openai/math` checkout via the Vite middleware, set `VITE_PDF_ORIGIN=/` and put the math repo one level above this project.

## Deploy

Pushes to `main` build and publish GitHub Pages via Actions.
