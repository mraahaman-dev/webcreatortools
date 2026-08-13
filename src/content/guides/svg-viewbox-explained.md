---
title: "SVG viewBox Explained: What It Does and How to Fix a Broken One"
description: "A clear explanation of what the SVG viewBox attribute actually controls, why it causes so many rendering bugs, and how to fix a broken one step by step."
metaTitle: "SVG viewBox Explained: What It Does and How to Fix a Broken One"
metaDescription: "Understand what the SVG viewBox attribute does, why missing or incorrect viewBox values cause cropped or distorted icons, and how to fix them."
image: "/guides/svg-viewbox-explained/hero.svg"
imageAlt: "A cropped, off-center icon being reframed into a clean, properly centered version"
publishDate: 2026-08-13
category: "svg-tools"
relatedTools:
  - "viewbox-fixer"
  - "svg-editor"
  - "svg-viewer"
  - "image-to-svg-converter"
faqs:
  - question: "What happens if an SVG has no viewBox at all?"
    answer: "Without a viewBox, the SVG has no internal coordinate system to scale against. It typically renders at a fixed pixel size regardless of the width and height you set in CSS, or gets cropped to a default viewport rather than scaling proportionally."
  - question: "Can I just copy the width and height values into the viewBox?"
    answer: "Not reliably. The viewBox's third and fourth numbers should match the coordinate space your shapes were actually drawn in, not the physical display size. Using display dimensions as a guess often works by coincidence for square icons but breaks for anything drawn in a different aspect ratio."
  - question: "Why does my icon look stretched or squished instead of just resized?"
    answer: "This usually means the viewBox's aspect ratio doesn't match the width/height the SVG is displayed at, and preserveAspectRatio has been set to \"none\" (or overridden) instead of the default behavior that would otherwise preserve proportions."
  - question: "Why did my viewBox break after I edited the SVG?"
    answer: "If you moved, resized, or added shapes without updating the viewBox to match their new bounding box, the coordinate system no longer reflects where your content actually sits. The viewBox needs to be recalculated any time a shape's extents change, it doesn't update automatically."
  - question: "Does every SVG need a viewBox?"
    answer: "Not strictly, an SVG with only a fixed width and height can render without one. But without a viewBox, the image loses the ability to scale responsively, which defeats one of the main reasons to use SVG in the first place. In practice, almost every SVG intended for the web should have one."
---

Of all the ways an SVG can go visually wrong, cropped, off-center, stretched, or oddly cut off, the underlying cause is very often the same single attribute: `viewBox`. It's easy to miss because it doesn't look like it should matter much, four numbers separated by spaces, but it's doing more work than almost anything else in the file. This guide explains exactly what those four numbers control and walks through fixing a broken one step by step.

<div style="background:#EEF2FF;border:1px solid #C7D2FE;border-radius:0.75rem;padding:1.25rem 1.5rem;margin:1.5rem 0;">
<strong style="color:#3730A3;">Key takeaways</strong>
<ul style="margin-top:0.5rem;margin-bottom:0;color:#3730A3;">
<li>viewBox defines the internal coordinate system your shapes are drawn in, separate from the SVG's actual display size.</li>
<li>A missing or incorrect viewBox is the most common reason an SVG renders cropped, offset, or stretched.</li>
<li>Fixing one means recalculating it from your content's actual bounding box, not guessing at round numbers.</li>
</ul>
</div>

## What viewBox actually does

The `viewBox` attribute takes four numbers: `min-x`, `min-y`, `width`, and `height`.

```html
<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <circle cx="50" cy="50" r="40" fill="#4F46E5" />
</svg>
```

Read together, those four numbers say: "the visible drawing area starts at coordinate (0, 0), and extends 100 units to the right and 100 units down." Every shape inside the SVG is positioned using that internal coordinate system, completely independent of whatever physical size the SVG is actually displayed at on the page.

<figure>
  <img src="/guides/svg-viewbox-explained/viewbox-anatomy.svg" alt="A labeled diagram showing the four viewBox values: min-x and min-y marking the top-left origin point, and width and height defining the size of the internal coordinate grid" width="800" height="420" loading="lazy" />
  <figcaption>min-x and min-y set the origin point. width and height set how much coordinate space extends from it.</figcaption>
</figure>

This is the mechanism that lets a single SVG icon, drawn once in a 24×24 coordinate space, render correctly whether it's displayed at 16 pixels or 400 pixels. The browser maps that internal 24×24 grid onto whatever the actual rendered size is, scaling everything inside proportionally.

## viewBox versus width and height: two separate jobs

It's easy to conflate `viewBox` with the SVG's `width` and `height` attributes, but they answer different questions:

- **`viewBox`** answers: "what coordinate space were the shapes drawn in?"
- **`width` and `height`** answer: "how large should the SVG actually appear on the page?"

An SVG can have a `viewBox` of `0 0 24 24` and be displayed at `width="200" height="200"`, and it'll scale up cleanly, because the browser is stretching that 24-unit coordinate grid to fill 200 physical pixels. If you omit `width` and `height` entirely (common when SVG is styled with CSS instead), the SVG typically fills whatever space its container gives it, still scaled according to the `viewBox`.

Where this gets confusing is `preserveAspectRatio`, a related attribute that controls what happens when the `viewBox`'s aspect ratio doesn't match the displayed width-to-height ratio. Its default value, `xMidYMid meet`, keeps proportions intact and centers the content, adding letterboxing if needed rather than distorting the image. Setting it to `none` instead allows the image to stretch to fill the exact dimensions given, ignoring the original aspect ratio entirely, which is occasionally useful but is also a common accidental cause of a squished-looking icon.

## Why SVGs actually break: the common causes

In practice, a broken `viewBox` usually falls into one of a small number of patterns:

<figure>
  <img src="/guides/svg-viewbox-explained/broken-viewbox-symptoms.svg" alt="Three side-by-side icon examples: one cropped due to a missing viewBox, one stretched due to a mismatched aspect ratio, and one rendering correctly with a proper viewBox" width="800" height="420" loading="lazy" />
  <figcaption>Three different symptoms, three different underlying causes, same root problem: a viewBox that doesn't match the content.</figcaption>
</figure>

- **No viewBox at all.** The SVG renders at a fixed pixel size and often gets cropped rather than scaling responsively to fill its container.
- **A viewBox that no longer matches the content.** This happens most often after hand-editing an SVG, moving or resizing a shape without updating the viewBox to match its new bounding box leaves the coordinate system out of sync with where the content actually sits, so part of the image gets cut off or pushed out of frame.
- **A viewBox with the wrong aspect ratio for how it's displayed.** If the internal coordinate space is, say, a 2:1 rectangle but the SVG is forced into a 1:1 display box without `preserveAspectRatio` handling it gracefully, the image stretches or squishes.
- **A viewBox stripped during export or conversion.** Some raster-to-vector conversion tools and older export pipelines omit the `viewBox` attribute entirely, particularly when converting a simple raster image with an [Image to SVG Converter](/svg-tools/image-to-svg-converter/), it's worth confirming a viewBox was actually included in the output before using the file.

## How to fix a broken viewBox, step by step

Fixing a broken viewBox comes down to recalculating it based on where your content's shapes actually sit, not guessing at round numbers.

1. **Find the actual bounding box of your content.** This means the smallest rectangle that fully contains every shape in the SVG, its leftmost, rightmost, topmost, and bottommost points.
2. **Set `min-x` and `min-y`** to the top-left corner of that bounding box. If your content starts exactly at the origin, these are both `0`. If a shape was moved and now starts at, say, x=15, your `min-x` needs to reflect that, or the content will render partially or fully out of view.
3. **Set `width` and `height`** to the actual span of the bounding box, how far the content extends horizontally and vertically from that top-left corner.
4. **Re-render and visually confirm** nothing is cropped or offset. A [SVG Viewer](/svg-tools/svg-viewer/) is a fast way to check the result renders as expected before shipping it.

Doing this calculation by hand on a complex SVG with many shapes is tedious and error-prone, which is exactly the kind of task worth automating rather than doing manually. A [ViewBox Fixer](/svg-tools/viewbox-fixer/) calculates the correct viewBox directly from your SVG's actual rendered content, handling the bounding-box math for you. From there, if any manual fine-tuning is still needed, a [SVG Editor](/svg-tools/svg-editor/) lets you adjust the values and see the result update live.

## The short version

`viewBox` defines the coordinate grid your SVG's shapes are drawn on, separate from the size the image is actually displayed at. Most "broken SVG" symptoms, cropping, offset content, stretching, trace back to this one attribute being missing, stale, or mismatched with how the image is displayed. Fixing it means recalculating the four values from your content's real bounding box, either by hand for simple cases or with a tool that does the bounding-box math automatically for anything more complex.