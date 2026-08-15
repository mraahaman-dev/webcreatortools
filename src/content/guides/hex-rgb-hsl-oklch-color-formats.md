---
title: "HEX vs RGB vs HSL vs OKLCH: A Practical Color Format Guide"
description: "What each CSS color format actually represents, why OKLCH is showing up everywhere now, and which format makes sense for hand-coding, theming, or programmatic color work."
metaTitle: "HEX vs RGB vs HSL vs OKLCH: A Practical Color Format Guide"
metaDescription: "A practical comparison of HEX, RGB, HSL, and OKLCH in CSS — how each one works, why OKLCH is trending, and which format to reach for and when."
image: "/guides/hex-rgb-hsl-oklch-color-formats/hero.svg"
imageAlt: "The same coral color swatch represented in HEX, RGB, HSL, and OKLCH syntax side by side"
publishDate: 2026-08-14
category: "developer-tools"
relatedTools:
  - "color-format-converter"
  - "css-unit-converter"
  - "palette-extractor"
faqs:
  - question: "Is OKLCH better than HSL?"
    answer: "For most hand-authoring and design-system work, yes, because OKLCH is perceptually uniform, meaning equal changes in its lightness value produce equal-looking changes in brightness across every hue. HSL's lightness is mathematically defined but not perceptually consistent, so the same lightness value can look noticeably brighter or darker depending on the hue. HSL is still perfectly fine for quick, familiar tweaks; OKLCH is the better choice when consistency across a palette actually matters."
  - question: "Do I need to stop using HEX?"
    answer: "No. HEX remains the most compact, most copy-pasted, and most universally supported format, and there's nothing wrong with using it for one-off colors or values pulled from a design tool. The other formats exist for situations HEX handles awkwardly, like adjusting lightness or opacity programmatically, not as a wholesale replacement."
  - question: "Can I mix color formats in the same stylesheet?"
    answer: "Yes, CSS has always allowed this, and there's no performance or validity cost to mixing HEX, RGB, HSL, and OKLCH values in one file. Many teams do standardize on one format for consistency and easier find-and-replace, but the browser doesn't care either way."
  - question: "Is OKLCH supported in all browsers yet?"
    answer: "Support across current versions of Chrome, Firefox, and Safari is solid as of this writing, but if a project needs to support notably older browser versions, it's worth checking current support tables before relying on it, and pairing it with a HEX or RGB fallback declared earlier in the same property so unsupported browsers simply ignore the OKLCH line."
  - question: "What does the 'L' in OKLCH actually measure, if not the same thing as HSL's lightness?"
    answer: "Both are called lightness, but they're calculated differently. HSL's lightness is a simple mathematical average based on the RGB values, which doesn't match how the human eye perceives brightness. OKLCH's lightness is derived from the Oklab color space, which was specifically modeled on human perception, so it tracks much more closely with how bright a color actually looks."
  - question: "Why would I use RGB instead of just using HEX?"
    answer: "RGB and HEX represent the exact same color model, red/green/blue channels, so the choice usually comes down to readability and tooling. RGB's comma-separated numbers are easier to generate or modify programmatically (in JavaScript, for instance), while HEX is more compact and easier to copy as a single token. Modern rgb() syntax also supports an alpha channel directly, the same way HEX does with an 8-digit value."
---

Every CSS color eventually becomes the same thing under the hood, a set of numbers describing red, green, and blue light. HEX, RGB, HSL, and OKLCH are just different ways of writing that same underlying color, each suited to a different way of thinking about it. This guide walks through what each format actually represents, why OKLCH has been showing up in more CSS lately, and which format fits which situation.

<div style="background:#EEF2FF;border:1px solid #C7D2FE;border-radius:0.75rem;padding:1.25rem 1.5rem;margin:1.5rem 0;">
<strong style="color:#3730A3;">Key takeaways</strong>
<ul style="margin-top:0.5rem;margin-bottom:0;color:#3730A3;">
<li>HEX and RGB describe the same red/green/blue model, just written differently, neither is more "accurate" than the other</li>
<li>HSL is built around hue, saturation, and lightness, which makes it easier to reason about and adjust by hand</li>
<li>OKLCH is perceptually uniform, meaning equal changes in its lightness value look equally different to the human eye, which HSL doesn't guarantee</li>
<li>OKLCH also supports a wider color gamut than the other three, so it can represent colors HEX/RGB/HSL simply can't</li>
<li>There's no wrong format, pick based on what you're doing: authoring by hand, generating programmatically, or building a consistent design-system scale</li>
</ul>
</div>

## The Four Formats at a Glance

The same coral color can be written four different ways, and all four describe the exact same visible color.

<figure>
  <img src="/guides/hex-rgb-hsl-oklch-color-formats/syntax-comparison.svg" alt="One coral color swatch shown four times with its HEX, RGB, HSL, and OKLCH syntax written beneath each" width="800" height="420" loading="lazy" />
  <figcaption>The same color, written in four different CSS color formats.</figcaption>
</figure>

| Format | Example | Model |
|---|---|---|
| HEX | `#F26B5E` | Red/green/blue as base-16 pairs |
| RGB | `rgb(242 107 94)` | Red/green/blue as base-10 numbers |
| HSL | `hsl(6 84% 66%)` | Hue, saturation, lightness |
| OKLCH | `oklch(0.71 0.16 25)` | Perceptual lightness, chroma, hue |

## HEX: Compact and Universally Recognized

HEX packs a color's red, green, and blue channels into a six-digit base-16 string, `#F26B5E`, or eight digits when an alpha channel is included. It's the format most design tools export by default and the one nearly every developer recognizes on sight, which makes it a reasonable default for one-off values pulled from a mockup. What it's not good for is editing by eye. There's no intuitive way to look at `#F26B5E` and know how to make it 10% lighter without running it through a converter first.

## RGB: The Same Model, Easier to Manipulate Programmatically

RGB describes the identical red/green/blue model as HEX, just written as three base-10 numbers instead of a packed hex string: `rgb(242 107 94)`. Modern CSS also allows an alpha value directly in the same function, `rgb(242 107 94 / 0.5)`, replacing the older separate `rgba()` syntax. RGB's real advantage shows up in code rather than in a stylesheet: multiplying, clamping, or interpolating three plain numbers in JavaScript is far more natural than doing the same math on a hex string.

## HSL: Thinking in Hue, Saturation, and Lightness

HSL swaps the RGB channels for three values that map more closely to how people actually describe color: hue (a position around a 360-degree color wheel), saturation (how vivid vs. gray), and lightness (how close to black or white). This makes small manual adjustments genuinely easier. Want a darker version of a brand color? Lower the lightness percentage and leave hue and saturation untouched, something that's much harder to eyeball correctly in HEX or RGB.

The catch is that HSL's lightness value isn't perceptually consistent. `hsl(60 100% 50%)` (a bright yellow) and `hsl(240 100% 50%)` (a deep blue) share the same lightness number but look nowhere near equally bright to the human eye.

## OKLCH: Built for Perceptual Consistency

OKLCH is the newest of the four, part of the CSS Color Module Level 4 specification, and it's the format actually solving HSL's inconsistency problem. It's built on the Oklab color space, which was specifically designed to match human perception, so two OKLCH colors with the same lightness value really do look equally bright, regardless of hue.

<figure>
  <img src="/guides/hex-rgb-hsl-oklch-color-formats/perceptual-uniformity.svg" alt="Two rows of color swatches at matching lightness steps, showing HSL's uneven perceived brightness across hues compared to OKLCH's even perceived brightness across the same hues" width="800" height="420" loading="lazy" />
  <figcaption>Equal lightness values in HSL don't look equally bright across hues; OKLCH's do.</figcaption>
</figure>

OKLCH also supports colors outside the sRGB gamut that HEX, RGB, and HSL simply cannot express, which matters more each year as wide-gamut displays become standard. That combination, perceptual uniformity plus a wider gamut, is the main reason OKLCH has been showing up in more CSS resets, design systems, and color-scale generators recently.

## Which Format Should You Use When

- **Copying a value straight from a design tool or brand guide** — HEX is fine, there's no real benefit to converting it.
- **Generating or interpolating colors in JavaScript** — RGB's plain numbers are the easiest to do math on.
- **Hand-tweaking a color's darkness or vividness while writing CSS** — HSL is intuitive and widely supported.
- **Building a consistent lightness scale across many hues, like a design system's color tokens** — OKLCH is the format actually designed for this.

Converting between them by hand is tedious and error-prone, especially for OKLCH's decimal lightness/chroma values. The [Color Format Converter](/developer-tools/color-format-converter/) converts a color between all four formats instantly, and pairs well with the [CSS Unit Converter](/developer-tools/css-unit-converter/) when you're translating an entire set of design values at once. If you're starting from an existing image or logo rather than a single known color, the [Palette Extractor](/svg-tools/palette-extractor/) pulls out a usable palette first.

## The short version

HEX, RGB, HSL, and OKLCH all describe the same underlying red/green/blue color, just organized differently: HEX and RGB are the raw channels, HSL reorganizes them around hue/saturation/lightness for easier manual tweaking, and OKLCH goes a step further by making that lightness value perceptually consistent across every hue, while also unlocking a wider color gamut. None of them is objectively correct, the right one depends on whether you're copying a value, computing with it, adjusting it by eye, or building a consistent scale.