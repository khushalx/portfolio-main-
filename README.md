# Khushal Dangar — Portfolio

A complete, original portfolio built with Next.js App Router, TypeScript, Tailwind CSS 4, Motion, React Three Fiber, Drei, and Lucide. Self-hosted Archivo Black and Space Grotesk typography. Custom silver wave shaders, original interface design concepts, and a NASA lunar visualization. No remote 3D models, HDR downloads, or fabricated project results.

## Run locally

Use Node.js 20.9 or newer (Node 24 LTS recommended) and npm.

```sh
npm ci
npm run dev
```

Open http://localhost:3000. The development server accepts connections on your local network for real-device testing. To restrict it to this computer, run `npx next dev --hostname 127.0.0.1` instead.

## Validate and build

```sh
npm run lint
npm run typecheck
npm run build
npm start
```

The home page and all eight project detail pages are prerendered. `typecheck` generates Next route types before running TypeScript, so it also works on a fresh checkout. Dependency versions are pinned and `package-lock.json` is included with the source files.

## Edit content

| File | Content |
| --- | --- |
| `src/data/profile.ts` | Bio, caption, capabilities, portrait, footer copy |
| `src/data/projects.ts` | Eight projects, descriptions, verified links, technologies, screenshots, case studies |
| `src/data/experience.ts` | Roles, organizations, dates, visible descriptions |
| `src/data/education.ts` | University, program, dates |
| `src/data/socials.ts` | LinkedIn, GitHub, email, X, additional contact links |
| `src/data/types.ts` | Shared content types |
| `src/data/editorial.ts` | Headings, hero copy, contact invitation, display names |

Email, X, and portrait are deliberately `null`. Unconfirmed project technologies, images, and case studies are empty arrays; project/repository links are omitted unless supplied. Missing links and case-study sections are omitted. Add actual values to enable them. All featured projects and the three additional projects have functional local detail pages.

### Add a project or a case study

Add another object to `projects.ts` with a unique slug and number. The page route and next-project navigation are generated from this data. Set `featured: true` for a full exhibition panel. Each cover uses a project-specific composition. Set `featured: false` for the additional-project grid.

The `cover` union selects one of eight original procedural cover directions. These are explicitly labeled interface/publication design concepts based on the supplied project facts, not genuine screenshots of the products. Add a new direction in `project-cover.tsx` and corresponding styles for a new visual identity. Public websites and repositories are independent optional properties.

Add process writing to the project's `caseStudy` array:

```ts
caseStudy: [
  { heading: "The problem", body: "Your real project context." },
  { heading: "The approach", body: "What you built, decisions, and tradeoffs." },
]
```

Only include outcomes and technology names you can substantiate.

### Add images

Put project screenshots in `public/projects/<slug>/`. Use descriptive WebP or AVIF images and add their paths, meaningful alt text, and real dimensions:

```ts
images: [
  {
    src: "/projects/astroboat/overview.webp",
    alt: "Describe the actual screen shown in this image",
    width: 1600,
    height: 1000,
  },
]
```

Images render automatically on the detail page with Next Image optimization and responsive sizing. Keep screenshots comfortably below 500 KB when possible.

For your portrait, add `public/images/portrait.webp` and set `profile.portrait` to the same `{ src, alt, width, height }` structure. The About section currently presents an original particle sculpture instead of a portrait. To use the portrait later, replace that visual in `src/components/about.tsx`; no actual photograph is assumed.

## Dark technology design

- `src/app/globals.css`: black/graphite surfaces, Archivo Black uppercase display type, Space Grotesk body text, controlled section spacing, and responsive compositions.
- `src/components/hero.tsx`: oversized left-aligned name layered with a continuous full-scale silver wave, direct introduction, and two anchor actions.
- `src/components/atmosphere-canvas.tsx`: an open shader-deformed membrane with interpolated analytical normals and procedural reflection strips; an original 24,000-point sculpted bust. No torus, imported model, or heavy volumetric rendering.
- `src/components/atmospheric-scene.tsx`: lazy loading, visibility pause, reduced motion, context-loss handling, and SVG fallbacks.
- `src/components/project-cover.tsx`: astronomy interface, publication spread, safety phone, startup simulation, and rail-network concepts. Real supplied screenshots automatically override concept covers.
- `src/components/experience.tsx`: five editorial blocks; every role, date, organization and description is visible without expanding controls.
- `src/components/about.tsx`: large particle sculpture beside the original biography, education, and interests.
- `src/components/navigation.tsx`: compact navigation, mobile focus loop, Escape support, background `inert`, scroll lock.
- `src/app/work/[slug]/page.tsx`: all eight project routes, optional verified links, real screenshots when supplied, editable case studies, and next-project navigation.

The WebGL renderer caps DPR at 1.4. Each visible scene uses one draw call. The membrane uses a 260 × 100 segment plane; the figure uses `THREE.Points`. Off-screen and hidden-tab scenes stop continuous rendering. Reduced-motion mode renders a static frame and disables smooth scrolling and UI transitions. SVG fallbacks remain for graphics failures. Slow hover effects use CSS transforms.

### Imagery and provenance

No genuine product screenshots were present in the supplied assets. The live Astroboat site could not be loaded during capture. All five featured presentations are original, clearly labeled design concepts. Their sample visual composition is illustrative, not a claim about current product UI, data, or outcomes.

The Astroboat concept uses NASA Scientific Visualization Studio lunar imagery from [Moon Phase and Libration, 2026](https://svs.gsfc.nasa.gov/5587/), stored locally at `public/images/moon-nasa.jpg`. Credit: NASA’s Scientific Visualization Studio; lunar terrain data from LRO. Source frame: `https://svs.gsfc.nasa.gov/vis/a000000/a005500/a005587/frames/730x730_1x1_30p/moon.0001.jpg`. It is a lunar visualization, not an Astroboat screenshot. Other presentation visuals are repo-native HTML/CSS/SVG. Use actual product imagery as soon as it is available.

## Deploy

### Vercel

1. Push this directory to your Git provider and import the repository into Vercel as a Next.js project.
2. Configure `NEXT_PUBLIC_SITE_URL` to the real full HTTPS origin of your deployment.
3. Keep the default Next.js build settings (`npm run build`) and deploy.

### Node host

Use any host supporting Node.js and Next.js:

```sh
npm ci
# Set NEXT_PUBLIC_SITE_URL in the host's environment before building.
npm run build
npm start
```

Point your domain/reverse proxy at the process. The app has no database, account system, or secret API keys. No paid services are needed by the implementation.

### SEO configuration

Copy `.env.example` to `.env.local` for local configuration or set the variable in your hosting dashboard. The URL must be a valid full origin. Without it, local previews use `http://localhost:3000` only for image metadata, canonical tags are omitted, and the sitemap is empty. Set it **before production build** so prerendered canonical, Open Graph, robots, and sitemap URLs use your public domain. Redeploy after changing it.

Open Graph artwork is generated at `/opengraph-image`. Page titles/descriptions are unique for every project. The favicon is original vector artwork. A custom 404 page handles unknown paths.

## Verification and limitations

- ESLint, TypeScript, and production compilation are part of the delivery checks.
- Browser QA covers desktop and narrow mobile layouts, overflow, mobile navigation, keyboard focus and Escape, anchor navigation, visible experience content, and project routes.
- No Lighthouse score is claimed. Measure on the production deployment and real devices, especially lower-powered mobile GPUs.
- `npm audit` currently reports five development-only findings in Next's lint dependency chain (`fast-glob` → `micromatch` → `braces`); the upstream `braces` release remains 3.0.3. The production dependency audit is clean. Do not apply npm's suggested downgrade of the Next lint configuration to an incompatible major version. Recheck when upstream releases a compatible fix.
- Procedural material shading can differ slightly across GPUs. The fallback remains available for unsupported browsers and graphics failures.

Before sharing publicly, add your portrait/contact details if desired, confirm project URLs, and set the canonical URL. No missing personal facts have been invented.
