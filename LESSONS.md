# Veya Padel lessons
Stack: Astro 7 (static), GSAP, Lenis, JSON content files
## Reusable modules
- court heatmap: `src/scripts/heat.js`, paints a pointer trail into a small buffer and colours it through a lookup table; no dependencies
## Lessons
### Element gone after scrolling back
- Area: GSAP intro plus scrubbed ScrollTrigger timeline
- Symptom: hero player faded on scroll and stayed invisible after returning to the top
- Cause: ScrollTrigger recorded the start opacity while the intro `from()` held it at 0, so rewinding restored 0
- Fix: a `fromTo` with `immediateRender: false` was not enough for a tween that starts mid-timeline; the intro animates the image, the scrub fades a wrapper, so the two never share an element and property
- Next time: never let an intro and a scrub animate the same property on the same element; test scroll back, not only scroll down
### Child component had no size
- Area: Astro scoped styles
- Symptom: logo missing from the header, no error anywhere
- Cause: a scoped `.logo` rule in the parent never reaches the SVG inside the child component, so the SVG collapsed to zero width
- Fix: `.brand :global(.logo)` in the parent
- Next time: style child components through `:global` from a scoped parent, or inside the child

### False alarm from a paused page
- Area: browser testing of GSAP
- Symptom: a scripted test read opacity 0 on the hero image while the screenshot showed it fine
- Cause: animation frames can stall when the preview pane is hidden or scaled, so the intro had not run yet
- Fix: read the value after a screenshot, with the page visible
- Next time: do not trust a timing-based number from a hidden pane; confirm against a rendered frame
### Built from the wrong wireframe
- Area: project setup
- Symptom: the finished sections matched an old wireframe, not the one Masoud meant
- Cause: two wireframes existed; the current one lived in a folder described as old, and the older one was the file named wireframe. The source was never confirmed, although he had said he would send it
- Fix: rebuilt the sections from the version on GitHub main and pinned its copy in the tests
- Next time: before building from a source file, name it back to the person and compare it with what is live

### Parent style leaked into a child element
- Area: Astro scoped styles
- Symptom: the large price showed as tiny monospace text
- Cause: a bare `span` rule meant for the radio labels also matched the price span in the same component
- Fix: narrowed the selector to `label span`
- Next time: scoping stops leaks between components, not inside one; avoid bare element selectors in a busy component
### Reference preload outlived the image
- Area: Astro layout
- Symptom: a 404 in the console after swapping the hero image, with the page looking fine
- Cause: `Base.astro` still preloaded the old `player.webp`
- Fix: pointed the preload at the new layers and added a test that the old path is gone
- Next time: when replacing a key image, search for its name across the layout as well as the component
