# Website loading performance

Measured on November 12, 2026, against revision `f65868cc302a7757072105d6af272a886d9197a5`. The live site's HTML was byte-for-byte identical to that revision before editing. Changes are in the isolated `codex/performance` branch.

## Controlled comparison

Both versions were served by the same local static server and audited sequentially with Lighthouse 12.8.2, native Apple Silicon Node, and the same installed Chrome. Mobile uses the default simulated mobile throttling; desktop uses Lighthouse's desktop preset. Each column is one lab run, not a field percentile or an average. External Adobe fonts and Google analytics remained enabled for all audits.

| Metric | Mobile before | Mobile after | Desktop before | Desktop after |
| --- | ---: | ---: | ---: | ---: |
| Lighthouse performance score | 51/100 | 78/100 | 64/100 | 97/100 |
| first-contentful-paint | 4.2 s | 2.6 s | 0.9 s | 0.8 s |
| largest-contentful-paint | 38.5 s | 4.9 s | 20.0 s | 1.1 s |
| speed-index | 46.6 s | 2.6 s | 7.0 s | 0.8 s |
| total-blocking-time | 290 ms | 50 ms | 50 ms | 0 ms |
| cumulative-layout-shift | 0 | 0 | 0.001 | 0 |
| total-byte-weight | Total size was 42,983 KiB | Total size was 615 KiB | Total size was 42,982 KiB | Total size was 966 KiB |

Initial mobile transfer fell by **98.6%**. The local server does not compress responses or apply Netlify's caching rules; these measurements isolate source changes and do not predict the exact production timings. An independent live mobile baseline scored 40/100, with LCP of 15.0 s. The optimized version has not been deployed.

Machine-readable metrics, timestamps, browser version, and throttling settings are saved in `scripts/performance-results.json`. Full raw audit reports and QA screenshots from this session are available in the temporary local folder `/private/tmp/camilo-performance-results`.

## Changes

- Generated 67 optimized image sets from 37.9 MB of referenced originals. Their largest variants total 6.8 MB (about 82% smaller); responsive variants and deferred loading reduce the initial transfer further. The original assets remain intact. Animated GIF content is preserved in animated WebP.
- Served smaller hero image variants on phones; added responsive image sources and intrinsic dimensions for gallery/project media.
- Removed the global loading overlay and the image/font preload promises. Visible content and interaction setup no longer wait for offscreen gallery images or a successful Adobe font callback.
- Deferred project backgrounds, hidden slide media, project-detail images, and the Three.js iframe. Hidden videos no longer fetch or autoplay; active videos pause when offscreen or the document is hidden.
- Vendored the existing Splitting 1.1.0 and GSAP 3.9.1 dependencies, retaining license notices. Removed the unused Splitting cells stylesheet and the ImagesLoaded/WebFont loader dependencies. Scripts use `defer`.
- Consolidated hero parallax into one animation loop that stops when settled, offscreen, hidden, or obscured by an open project. The custom cursor also stops when settled; touch and reduced-motion users skip these pointer effects.
- Added Netlify cache rules: generated, content-hashed images can be cached immutably for a year; HTML and editable code continue to revalidate. Production header behavior still needs verification after deployment.
- Fixed self-closing video markup while deferring its sources, and reserved the videos' dimensions.

## Verification

- Desktop Chrome (1440 × 1000) and emulated mobile Chrome (390 × 844, DPR 2): all project overlays open/close, every gallery slide loads and decodes its images, and the audio interaction requests a track and initializes the WebGL canvas.
- No missing local assets or uncaught browser errors during these interactions.
- No initial video, audio, WebGL, hidden gallery, or project-detail image requests.
- External fonts and analytics were deliberately blocked in regression tests; content and interactions stayed usable.
- Reduced-motion and touch behavior verified; hero animation loops settle rather than running continuously.
- Before/after desktop hero screenshots and mobile/desktop gallery screenshots were inspected. The visual design and content are preserved.
- Image regeneration reproduced identical HTML and manifest hashes. JavaScript syntax checks and `git diff --check` passed.

The tests use Chrome with software WebGL. Physical mobile devices, Safari, and Firefox have not been tested. The WebGL app remains unchanged internally and continues its existing behavior after it has been loaded; this change removes its cost from initial loading.

## Reproduction and deployment

See the README for `npm ci`, `npm run images:generate`, and `npm test`. Lighthouse 12.8.2 commands for an HTTP-served checkout:

```sh
npx lighthouse@12.8.2 http://127.0.0.1:4174 --only-categories=performance --chrome-flags="--headless --no-sandbox" --output=json --output-path=mobile.json
npx lighthouse@12.8.2 http://127.0.0.1:4174 --only-categories=performance --preset=desktop --chrome-flags="--headless --no-sandbox" --output=json --output-path=desktop.json
```

Run audits sequentially without other browser tests or image conversion running. On Apple Silicon, use native arm64 Node to avoid Rosetta skew. This is still a static site: publish the repository root with the committed optimized assets and `_headers` file. Nothing has been pushed or deployed. After an approved deployment, verify immutable image headers and repeat the audits against the production URL.
