# thenewboston-Tutorials

An independent React, TypeScript, and Vite app for interactive architecture tutorials. All runtime code and assets are contained in this repository; no sibling project is required to install, build, run, or test it.

## Run Locally

Use Node.js **22.19 or later in the 22.x series, or 24+**, and npm **10.9.3+**.

```sh
npm ci
npm run dev
```

Vite’s development URL is [http://localhost:5173](http://localhost:5173). Open the tutorial directly at `#/chapters/core-architecture/1`.

To serve a production build on the preview/test port:

```sh
npm run build
npm run preview -- --host 127.0.0.1 --port 4174 --strictPort
```

The preview URL is [http://127.0.0.1:4174](http://127.0.0.1:4174). This separate port avoids conflicts with the earlier tutorial app.

## Checks

Install the Chromium browser once for Playwright:

```sh
npx playwright install chromium
```

Run the project checks:

```sh
npm run lint
npm run typecheck
npm run build
npm test
npm run format:check
```

Playwright starts or reuses the app at **127.0.0.1:4174** and covers desktop/mobile navigation, the diagrams, and interactive outcomes. Keep that port available for this project. Use `npm run test:ui` for the interactive test runner.

## Authoring

- [Authored source](docs/core-architecture-source.md): the exact lesson examples and interaction requirements.
- [Chapter 1 art direction](docs/chapter-01-art-direction.md): layout, styling, motion, teaching simplifications, and review criteria.
- [Contributor instructions](AGENTS.md): scope and implementation guardrails.

Chapter metadata lives in `src/chapters/chapter-01.ts`; chapter registration and shared types live alongside it. Native scene components live in `src/components/`, and browser checks live in `tests/`. The chapter uses `core-architecture` as its stable route id.

The canvas uses a fixed **2560 × 1440** design space scaled uniformly to fit the viewer. Labels remain editable native text. Fees are omitted from the examples for clarity, and account labels 123/456 are simplified; neither implies fee-free Core requests or usable account numbers. Optional Core/DBDC and image-reference links in the art-direction document provide author context only and are not build or runtime dependencies.
