---
title: "SVG Accessibility: title, desc, and ARIA Roles Explained"
description: "How screen readers actually interpret SVG markup, and the specific tags and attributes that make an icon accessible instead of invisible or confusing."
metaTitle: "SVG Accessibility: title, desc, and ARIA Roles Explained"
metaDescription: "Learn how <title>, <desc>, role, and aria-hidden affect SVG accessibility, and when each one applies to icons, illustrations, and complex graphics."
image: "/guides/svg-accessibility-explained/hero.svg"
imageAlt: "An SVG icon with a screen reader speech bubble showing its accessible name being announced"
publishDate: 2026-08-13
category: "svg-tools"
relatedTools:
  - "svg-accessibility-checker"
  - "svg-viewer-validator"
  - "svg-optimizer"
faqs:
  - question: "Does every SVG on a page need a title and description?"
    answer: "No. Purely decorative SVGs, like a background flourish or an icon that duplicates adjacent visible text, should actually be hidden from assistive technology with aria-hidden rather than given a title, since announcing redundant decoration adds noise rather than information."
  - question: "What's the difference between <title> and <desc> in SVG?"
    answer: "<title> provides the short, accessible name for the graphic, similar in purpose to an <img> alt attribute, and is what a screen reader typically announces first. <desc> is for a longer supplementary explanation, useful for complex charts or diagrams where a single short name isn't enough context."
  - question: "Is alt text on an <img> tag enough, or do I still need SVG-internal accessibility markup?"
    answer: "If the SVG is referenced via an <img> tag's src attribute, the img's alt attribute is what actually gets announced, and any <title> or <desc> inside that SVG file is ignored by the browser in that context. Internal SVG accessibility markup only matters when the SVG is inlined directly in the HTML as an <svg> element."
  - question: "Should icon-only buttons use SVG accessibility tags or an aria-label on the button?"
    answer: "Either can work, but putting aria-label directly on the parent <button> is usually simpler and more reliable, since it avoids relying on the SVG's internal markup being read correctly across every browser and screen reader combination. Reserve <title> inside the SVG for cases where the graphic can appear outside a labeled control."
  - question: "What does role='img' actually do on an SVG element?"
    answer: "It tells assistive technology to treat the entire SVG as a single, atomic image rather than trying to step through its internal shapes and groups one by one. Without it, some screen readers may attempt to describe individual paths and elements, which is rarely a useful experience for the person listening."
  - question: "Can an SVG be accessible without any ARIA attributes at all?"
    answer: "Yes, for simple cases. A well-formed inline SVG with just a <title> as its first child is enough for most screen readers to announce a sensible accessible name, even with no role or aria attributes present. ARIA becomes more useful for finer control, like explicitly hiding decorative graphics or linking a longer <desc>."
---

An SVG icon that looks perfectly clear on screen can be completely silent, or worse, confusing, to someone using a screen reader. Unlike an `<img>` tag, which has one well-understood `alt` attribute, an inline SVG is a small piece of markup with its own internal structure, and browsers and screen readers have specific rules for which parts of that structure actually get announced. This guide walks through exactly what to add, and what to deliberately leave out.

<div style="background:#EEF2FF;border:1px solid #C7D2FE;border-radius:0.75rem;padding:1.25rem 1.5rem;margin:1.5rem 0;">
<strong style="color:#3730A3;">Key takeaways</strong>
<ul style="margin-top:0.5rem;margin-bottom:0;color:#3730A3;">
<li><code>&lt;title&gt;</code> gives an SVG its accessible name; <code>&lt;desc&gt;</code> adds optional longer context</li>
<li><code>&lt;title&gt;</code> only works when it's the first child element inside the <code>&lt;svg&gt;</code> tag</li>
<li>Decorative SVGs should be hidden with <code>aria-hidden="true"</code>, not given a title</li>
<li><code>role="img"</code> tells screen readers to treat the SVG as one image, not a set of shapes</li>
<li><code>&lt;title&gt;</code> and <code>&lt;desc&gt;</code> inside an SVG file are ignored when that file is loaded via <code>&lt;img src="..."&gt;</code></li>
</ul>
</div>

## Why SVG Accessibility Isn't the Same as Image Alt Text

When a browser encounters `<img src="icon.svg" alt="Search">`, the rule is simple: the `alt` attribute is what gets announced, full stop. Whatever accessibility markup exists inside `icon.svg` itself is irrelevant in that context, because the browser treats the whole file as a single opaque image, the same as it would a PNG or JPEG.

The moment that same SVG is inlined directly into the HTML as an `<svg>...</svg>` element, the rules change completely. Now the browser exposes the SVG's actual internal structure to the accessibility tree, and it's the SVG's own markup, specifically `<title>`, `<desc>`, and any `role` or `aria-*` attributes, that determines what gets announced. Running a source file through the [SVG Viewer & Validator](/svg-tools/svg-viewer/) first is a good habit here too, since malformed markup can behave unpredictably once it's parsed as live DOM rather than treated as an opaque file.

## `<title>`: The Accessible Name

`<title>` is the closest SVG equivalent to `alt` text, and it's the single most important tag for making an icon accessible. It has one strict requirement that trips people up constantly: it must be the first child element inside the `<svg>` tag, or many screen readers won't pick it up at all.

<figure>
  <img src="/guides/svg-accessibility-explained/title-placement.svg" alt="Diagram showing a title element correctly placed as the first child of an svg tag versus incorrectly placed after other elements" width="800" height="420" loading="lazy" />
  <figcaption>A <code>&lt;title&gt;</code> placed after other elements is often silently ignored by assistive technology.</figcaption>
</figure>

```html
<svg viewBox="0 0 24 24" role="img" aria-labelledby="search-icon-title">
  <title id="search-icon-title">Search</title>
  <path d="..."/>
</svg>
```

Pairing `<title>` with `role="img"` and `aria-labelledby` pointing at its `id` is the most broadly reliable pattern, since it doesn't rely on every screen reader correctly inferring the accessible name from `<title>` alone.

## `<desc>`: When a Short Name Isn't Enough

`<desc>` exists for cases where `<title>` alone can't carry enough information, most commonly complex data visualizations, diagrams, or illustrations where a sighted user would spend several seconds visually parsing what's happening. A simple icon almost never needs one.

```html
<svg viewBox="0 0 400 300" role="img" aria-labelledby="chart-title chart-desc">
  <title id="chart-title">Quarterly revenue growth</title>
  <desc id="chart-desc">A bar chart showing revenue increasing from $2M in Q1 to $3.4M in Q4, with the steepest growth between Q2 and Q3.</desc>
  <!-- chart paths -->
</svg>
```

Notice `aria-labelledby` references both IDs here, space-separated, so the accessible name and the longer description are both exposed together rather than one silently overriding the other.

## Decorative SVGs: When to Hide Them Instead

Not every SVG should be announced. An icon sitting directly next to visible text that already says the same thing, like a small arrow inside a "Learn more →" link, adds nothing by being read aloud a second time, and often just creates redundant noise for someone navigating by screen reader.

<figure>
  <img src="/guides/svg-accessibility-explained/decorative-vs-meaningful.svg" alt="Diagram comparing a decorative icon hidden with aria-hidden next to labeled text against a standalone icon button with its own title" width="800" height="420" loading="lazy" />
  <figcaption>Decorative icons should be hidden; standalone icon-only controls need their own accessible name.</figcaption>
</figure>

```html
<a href="/learn-more">
  Learn more
  <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24">
    <path d="..."/>
  </svg>
</a>
```

`aria-hidden="true"` removes the SVG from the accessibility tree entirely, and `focusable="false"` is worth adding too, since older versions of Internet Explorer and Edge made SVGs keyboard-focusable by default, which could otherwise create an empty, unlabeled stop in the tab order.

## Icon-Only Buttons: A Special Case

A button that's only an icon, with no visible text, is the case most likely to actually break for screen reader users if accessibility markup is skipped. Here, putting the label directly on the parent control is usually more robust than relying on the SVG's internal `<title>`:

```html
<button aria-label="Close dialog">
  <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24">
    <path d="..."/>
  </svg>
</button>
```

This way, the SVG itself is marked purely decorative, and the accessible name comes from the `aria-label` on the button that actually receives focus, which is a pattern supported consistently across every major screen reader.

## Checking Your Work

Manually eyeballing SVG markup for these patterns across a whole icon set is tedious and easy to get subtly wrong, especially the `<title>`-must-be-first-child rule. The [SVG Accessibility Checker](/svg-tools/svg-accessibility-checker/) scans pasted SVG markup for exactly these issues, flagging missing or misplaced `<title>` elements, decorative icons that aren't hidden, and icons missing `role="img"`, so you can catch it before it ships rather than after a user reports it.

## The short version

Accessible SVG markup comes down to a small set of consistent rules: give meaningful standalone icons a `<title>` as the very first child element, paired with `role="img"` and `aria-labelledby`; reserve `<desc>` for genuinely complex graphics that need more than a short name; and explicitly hide purely decorative icons with `aria-hidden="true"` rather than leaving them to be announced as noise. Remember that none of this applies when an SVG is loaded through `<img src="...">`, since the `alt` attribute takes over entirely in that case. Run your icon set through the [SVG Accessibility Checker](/svg-tools/svg-accessibility-checker/) to catch placement mistakes automatically.