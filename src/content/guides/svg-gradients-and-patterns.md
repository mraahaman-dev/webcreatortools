---
title: "SVG Gradients and Patterns: A Practical Guide"
description: "How linearGradient, radialGradient, and pattern actually work in SVG, with copy-paste examples for filling shapes with smooth color transitions or repeating tiles."
metaTitle: "SVG Gradients and Patterns: A Practical Guide"
metaDescription: "Learn how to build SVG linear gradients, radial gradients, and repeating patterns, and how to reuse them across shapes with defs and url() references."
image: "/guides/svg-gradients-and-patterns/hero.svg"
imageAlt: "An SVG shape filled with a gradient next to another shape filled with a repeating pattern"
publishDate: 2026-08-13
category: "svg-tools"
relatedTools:
  - "svg-gradient-generator"
  - "svg-pattern-generator"
  - "svg-viewer-validator"
faqs:
  - question: "What's the difference between a linear gradient and a radial gradient in SVG?"
    answer: "A linear gradient transitions color along a straight line at a set angle, like a sunset fading from orange to purple. A radial gradient transitions outward from a center point in a circle or ellipse, like a spotlight or a glow. Both are defined once and referenced by shapes using the same fill syntax."
  - question: "Can I use a gradient on text in SVG?"
    answer: "Yes. Any element that accepts a fill attribute, including text, can reference a gradient the same way a shape does, by setting fill to url() followed by the gradient's ID. The gradient itself doesn't need to know what kind of element is using it."
  - question: "Why isn't my SVG pattern tiling correctly?"
    answer: "This is almost always a mismatch between the pattern's width and height attributes and the actual size of the artwork inside it. If the pattern tile is set smaller than its content, tiles will overlap; if it's set larger, gaps appear between them. Double-check the pattern's width, height, and its content's own dimensions all agree."
  - question: "Do gradients and patterns work the same way in CSS as they do in SVG?"
    answer: "No, they're separate systems. CSS has its own linear-gradient() and radial-gradient() functions for backgrounds, but they can't be applied to SVG shape fills directly. SVG gradients and patterns are defined as their own elements inside the SVG and referenced with fill, which is the only mechanism SVG shapes actually support."
  - question: "Can a single gradient be reused across multiple shapes?"
    answer: "Yes, that's the intended way to use them. A gradient is defined once inside defs and given an ID, then any number of shapes can reference that same ID with fill, all pulling from the identical gradient definition without duplicating it."
  - question: "What does gradientUnits='userSpaceOnUse' actually change?"
    answer: "By default, a gradient's coordinates are relative to the bounding box of the shape using it, so the same gradient looks different on differently sized shapes. Setting gradientUnits to userSpaceOnUse switches the gradient to use the SVG's actual coordinate system instead, so its position and size stay fixed regardless of which shape references it."
---

Filling an SVG shape with a flat color is one line of code. Filling it with a smooth gradient or a repeating pattern takes a bit more structure, since both are defined as their own elements first and then referenced, rather than written inline the way a CSS background gradient is. This guide covers the syntax for both, along with the details that trip people up most, like why a pattern won't tile or why a gradient looks different on two different shapes.

<div style="background:#EEF2FF;border:1px solid #C7D2FE;border-radius:0.75rem;padding:1.25rem 1.5rem;margin:1.5rem 0;">
<strong style="color:#3730A3;">Key takeaways</strong>
<ul style="margin-top:0.5rem;margin-bottom:0;color:#3730A3;">
<li>Gradients and patterns are defined once inside <code>&lt;defs&gt;</code> and referenced by shapes with <code>fill="url(#id)"</code></li>
<li><code>&lt;linearGradient&gt;</code> transitions along a straight line; <code>&lt;radialGradient&gt;</code> transitions outward from a center point</li>
<li>A pattern's <code>width</code> and <code>height</code> must match its content's actual size or tiles will overlap or leave gaps</li>
<li>By default, gradient coordinates are relative to each shape's bounding box, so the same gradient can look different on different shapes</li>
<li>The same gradient or pattern definition can be reused across as many shapes as needed without duplicating it</li>
</ul>
</div>

## The Core Pattern: Define Once, Reference with fill

Both gradients and patterns follow the same two-step structure in SVG. First, the gradient or pattern is defined as its own element, usually tucked inside a `<defs>` block so it doesn't render on its own, and given an `id`. Second, any shape that should use it sets its `fill` attribute to `url()` wrapped around that same ID.

```html
<svg viewBox="0 0 200 200">
  <defs>
    <linearGradient id="sunset" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#F59E0B" />
      <stop offset="100%" stop-color="#7C3AED" />
    </linearGradient>
  </defs>
  <rect width="200" height="200" fill="url(#sunset)" />
</svg>
```

This indirection is what makes gradients reusable. The [SVG Gradient Generator](/svg-tools/svg-gradient-generator/) builds this exact structure visually, letting you drag color stops and preview the result before copying the markup out.

## Linear Gradients: Direction and Color Stops

A `<linearGradient>` transitions color along a straight line, whose angle is set by its `x1`, `y1`, `x2`, and `y2` coordinates. Each `<stop>` inside it marks a color at a given point along that line, using `offset` as a percentage from start to end.

<figure>
  <img src="/guides/svg-gradients-and-patterns/linear-vs-radial.svg" alt="Diagram comparing a linear gradient transitioning diagonally across a square against a radial gradient glowing outward from the center of a circle" width="800" height="420" loading="lazy" />
  <figcaption>A linear gradient follows a straight line; a radial gradient expands outward from a focal point.</figcaption>
</figure>

Two stops give a simple fade, but any number can be added for a multi-color transition, for example a rainbow bar would just add more `<stop>` elements at evenly spaced offsets. The `x1`/`y1`/`x2`/`y2` coordinates default to a horizontal left-to-right fade, so a diagonal or vertical gradient needs those explicitly changed, as in the sunset example above going corner to corner.

## Radial Gradients: Center, Radius, and Focal Point

A `<radialGradient>` works the same way structurally, but transitions outward in a circle instead of along a line, controlled by `cx`, `cy`, and `r` for the center point and radius.

```html
<svg viewBox="0 0 200 200">
  <defs>
    <radialGradient id="glow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#FBBF24" />
      <stop offset="100%" stop-color="#78350F" />
    </radialGradient>
  </defs>
  <circle cx="100" cy="100" r="90" fill="url(#glow)" />
</svg>
```

Shifting `cx` and `cy` off-center, or adding `fx` and `fy` for a separate focal point, is how a lens-flare or spotlight effect gets built, since the brightest point of the gradient no longer sits in the exact middle of the shape it's filling.

## Patterns: Repeating Tiles Instead of Color Fades

A `<pattern>` fills a shape by repeating a small tile of content across it, rather than blending colors. The pattern element defines a tile's size and content, and like gradients, is referenced by a shape's `fill` attribute.

```html
<svg viewBox="0 0 200 200">
  <defs>
    <pattern id="dots" width="20" height="20" patternUnits="userSpaceOnUse">
      <circle cx="10" cy="10" r="4" fill="#4F46E5" />
    </pattern>
  </defs>
  <rect width="200" height="200" fill="url(#dots)" />
</svg>
```

<figure>
  <img src="/guides/svg-gradients-and-patterns/pattern-tiling.svg" alt="Diagram showing a single small pattern tile repeated edge to edge to fill a larger rectangle, plus an example of mismatched tile size causing gaps" width="800" height="420" loading="lazy" />
  <figcaption>A pattern's tile repeats edge to edge; mismatched width and height leaves gaps or overlaps.</figcaption>
</figure>

The most common mistake here is the tile's `width` and `height` not matching the actual size of what's drawn inside it. In the example above, the tile is 20 by 20 and the dot sits centered within that space, so tiles butt up cleanly against each other. Shrink the tile to 15 without adjusting the dot's position and the dots start overlapping between tiles; grow it to 30 and visible gaps appear. The [SVG Pattern Generator](/svg-tools/svg-pattern-generator/) handles this math automatically and previews the tiled result live.

## Bounding Box vs. Fixed Coordinates

By default, both gradients and patterns use `objectBoundingBox` units, meaning their coordinates are expressed as a fraction (0 to 1, or a percentage) of whatever shape is using them. That's convenient for a gradient meant to look the same proportionally on any shape, but it also means the same gradient definition will visually stretch differently on a tall rectangle versus a wide one.

Setting `gradientUnits="userSpaceOnUse"` (or `patternUnits="userSpaceOnUse"` for patterns) switches to the SVG's actual coordinate system instead, so the gradient or pattern has a fixed position and size regardless of which shape references it. This matters most when the same gradient needs to look visually consistent across several differently shaped elements, like a background wash that should stay put behind multiple overlapping shapes.

## The short version

Gradients and patterns in SVG both follow the same structure: define them once inside `<defs>` with a unique `id`, then reference that ID from any shape's `fill` attribute using `url(#id)`. Linear gradients transition along a line set by coordinates, radial gradients transition outward from a center point, and patterns repeat a small tile of content rather than blending color at all, with tile `width` and `height` needing to match the content inside for clean, gapless tiling. Build both visually with the [SVG Gradient Generator](/svg-tools/svg-gradient-generator/) and [SVG Pattern Generator](/svg-tools/svg-pattern-generator/) rather than hand-tuning stop offsets and tile dimensions by trial and error.