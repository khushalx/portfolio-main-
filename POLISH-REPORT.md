# Portfolio polish verification

## Scope and files changed

The desktop design, content, fonts, colors, shader source, lighting, geometry, particle count, hover treatments, and transition timings are preserved. No dependencies were added or removed.

| File | Change |
| --- | --- |
| `src/app/globals.css` | Corrections at widths up to 1100px; full mockup containment, explicit responsive cover widths, suitable minimum heights, tablet positioning, mobile type scaling, wrapped contact links, and 44px mobile link targets. |
| `src/components/work.tsx` | Preserve a space when the introductory line break is hidden on mobile. |
| `src/data/socials.ts` | Configure official X profile and email alongside the existing centralized contact data. |
| `src/components/footer.tsx` | Accessible email and X labels; retain existing buttons, arrows, hover states, GitHub, LinkedIn, and secure external-link attributes. |
| `src/components/project-cover.tsx` | Use a lazy, asynchronously decoded image for the original local NASA Moon asset, with explicit fill sizing. The original image bytes and visual treatment are preserved. |
| `src/components/motion.tsx` | Remove the redundant animated `blur(0px)` filter; retain opacity, translation, duration, easing, and reveal behavior. |
| `src/components/atmospheric-scene.tsx` | Measure clipping on coalesced scroll/resize events, reuse a region ref, pause when actually outside the viewport, and clean up observers, listeners, and pending animation frames. |
| `src/components/atmosphere-canvas.tsx` | GPU scissor clipping and narrower Three.js state subscriptions. Reduced-motion scenes still paint a complete static surface for later scrolling. |
| `README.md` | Update contact and rendering documentation. |
| `POLISH-REPORT.md` | Findings, measurements, and verification evidence. |

`layout.tsx` was restored byte-for-byte after temporary profiling. Profiling code is absent from the final production output. Raw evidence and the temporary audit script are retained under `test-results/`, outside the public site.

## Mobile findings and fixes

The original mobile rules deliberately enlarged the Astroboat, publication, and railway mockups to 145%, 123%, and 135% of the cover width. Their right edges and bottoms were clipped. The phone combined a fixed 275×550 layout, a fixed scale, and a 48% left offset; it extended past the cover. The startup dashboard also extended below its cover. Tablet publication and dashboard heights were too large for their inherited aspect ratios.

All five original HTML/CSS/SVG concepts remain. Responsive typography, positions, inner spacing, phone scales, and cover heights now keep them inside their covers. Explicit cover widths prevent aspect-ratio/min-height constraints from increasing the page width. The startup headline retains its line break, and project descriptions and actions use consistent margins.

Final production-browser checks at **320, 375, 390, 430, 768, and 1024px** found no horizontal document overflow and no clipped primary mockups. The browser reserves 15px for its scrollbar, so the recorded content widths are 305, 360, 375, 415, 753, and 1009px respectively. All eight detail pages were also checked at 320px with no overflow. Hero, About, Experience, Contact, and mobile navigation were included in the page inspection.

Mobile menu opening, Escape dismissal, focus return, and section-link dismissal passed. Contact links wrap and keep mobile touch targets at least 44px high. X uses `https://x.com/DangarKhushal`, email uses `mailto:khushaldangar29@gmail.com`, and the existing GitHub and LinkedIn links remain. External profiles retain `target="_blank"` and `rel="noopener noreferrer"`. Email verification inspected the destination without sending a message or launching a mail client.

## Performance findings and measurements

Measurements used an optimized production build served on port 3001, with a temporary audit script installed equally for before/after measurements. It recorded five-second frame windows, WebGL draw calls/scissor state, paint entries, layout shifts, and long tasks. The final build contains none of this instrumentation.

The baseline already had a DPR cap of 1.4, lazy Three.js loading, memoized particle data/uniforms, GPU animation, and hidden-tab/offscreen pauses. Those protections remain. There was no per-frame React state update or repeated geometry/material creation in the animation code. R3F already disposes its owned geometries, materials, renderer, and context on unmount; duplicating that disposal would add risk rather than fix a confirmed leak.

Two avoidable costs were identified:

1. Oversized canvases shaded pixels hidden by the layout. Scissoring keeps the same camera and full rendering resolution while skipping those pixels. The full vertical surface stays painted to avoid delayed strips appearing during scrolling.
2. Every reveal retained a zero-radius filter. Removing this visually inert filter avoids unnecessary filter/compositing work on large project and section layers.

The GPU area rows compare the scissor rectangle with the full target at the same resolution; they do not use different viewport sizes as a performance improvement.

| Local production measurement | Before / full target | After |
| --- | --- | --- |
| Sustained visible-hero frame rate | Approximately 60 fps | Approximately 60 fps |
| Mobile p95 frame interval | Approximately 17.6ms | Approximately 17.6ms |
| Mobile eligible fragment area | 712×515 = 366,680 pixels/frame | 375×462 = 173,250 pixels/frame, about **53% fewer** |
| Desktop eligible fragment area | Full 1596×775 target = 1,236,900 pixels/frame | 1425×760 = 1,083,000 pixels/frame, about **12% fewer** |
| Fully offscreen scene draw calls | Paused already | 0 in settled five-second samples |
| Long tasks in sampled steady windows | 0 | 0 |
| CLS in final fresh-load samples | — | 0 |

The pixel percentages describe the scissor area versus the full render target, **not** measured GPU milliseconds or an FPS improvement. Mesh complexity, all 24,000 particles, antialiasing, DPR, lighting, animation speed, and shader code are unchanged. Vertex work is unchanged. Image loading now follows native lazy-loading policy and preserves the original image quality.

The severe intermittent lag did not reproduce on this computer. The baseline already reached the display's 60Hz limit. Cache state and instrumentation varied across loads, so no reliable cold-load/LCP or transfer-size improvement is claimed. These are local browser measurements, not physical-phone or throttled-device benchmarks.

## Desktop and lifecycle verification

At the requested 1440×900 viewport, 15 key hero, project, About, and Experience elements retained their measured positions and dimensions after normalizing the screenshots' different scroll offsets. Before/after full-page captures had identical dimensions. Static project-region comparison averaged approximately 0.011 intensity levels per channel out of 255; the Experience region was effectively identical. Animated wave/particle frames naturally differ over time. Contact has only the requested additional links.

Three repeated client-side project/home navigation cycles alternated between 0 canvases on the detail route and 1 on the home/work view, with no accumulating canvas elements. Observer/listener/rAF cleanup was audited, along with R3F resource disposal. This is a bounded lifecycle check, not an exhaustive heap or GPU-memory proof.

The production console had **no errors**. One existing upstream warning remains: R3F uses `THREE.Clock`, which Three.js deprecates in favor of `THREE.Timer`. The dependency was not patched or replaced simply to silence the warning.

## Final checks

- `npm run lint`: passed.
- `npm run typecheck`: passed.
- `npm run build`: passed; all 15 static/generated routes completed.
- Home and all eight project routes: HTTP 200.
- All eight detail routes at 320px: no horizontal overflow.
- All six requested home-page widths: no overflow or clipped primary mockups.
- Existing project data and external destinations: unchanged.
- X/email destinations, accessible labels, and external security attributes: verified.
- Temporary audit script: absent from all nine HTML route responses.

Evidence is saved in `test-results/polish-*.json` and `test-results/polish-*.png`, including before/after desktop captures, mobile project crops, bounds checks, route checks, frame samples, and navigation canvas counts.
