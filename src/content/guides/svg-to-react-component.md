---
title: "How to Convert an SVG into a React Component"
description: "A step-by-step walkthrough of turning raw SVG markup into a proper React component: attribute renaming, the style object, props, and the gotchas that trip people up."
metaTitle: "How to Convert an SVG into a React Component (SVG to JSX)"
metaDescription: "Learn how to convert SVG to a React component step by step: renaming attributes to JSX, handling style, adding props, and common SVG-as-JSX mistakes to avoid."
image: "/guides/svg-to-react-component/hero.svg"
imageAlt: "An SVG tag transforming into a React component tag, with a checkmark icon in between"
publishDate: 2026-08-13
category: "svg-tools"
relatedTools:
  - "svg-to-react-component"
  - "svg-editor"
faqs:
  - question: "Does this same process work for Vue instead of React?"
    answer: "Mostly the opposite problem, actually. Vue's template syntax is much closer to plain HTML and accepts kebab-case attributes and class as written, so far less needs converting. The class-to-className and kebab-to-camelCase rules in this guide are specifically a JSX requirement."
  - question: "Do I need a build tool like SVGR to do this?"
    answer: "No, not for a single icon or a small number of them. SVGR automates importing an .svg file directly as a component (import Icon from './icon.svg'), which is worth setting up if a project has dozens of icons, but hand-converting a handful of SVGs the way this guide describes works fine without any extra tooling."
  - question: "Why do aria-* and data-* attributes stay lowercase when everything else becomes camelCase?"
    answer: "React specifically preserves these two attribute families in their original HTML form rather than converting them like other props, since that matches the actual HTML and ARIA specifications those attributes come from. It's a deliberate exception, not an inconsistency."
  - question: "How do I make the icon change color when used in different places?"
    answer: "Replace a hardcoded fill or stroke color in the SVG with the keyword currentColor, then the icon inherits whatever CSS text color is active wherever it's placed, a parent's color, or a className passed into the component."
  - question: "Do I need to convert numeric attribute values like width=\"24\" to a JSX number, like width={24}?"
    answer: "No, JSX accepts these SVG presentation attributes as plain strings just fine. Converting them to numbers isn't necessary and doesn't change how they render."
---

Pasting raw SVG markup straight into a React component almost works, right up until React throws a warning about an unrecognized DOM attribute, or a TypeScript error about a style prop that isn't the shape it expects. None of the individual fixes are hard, but there are enough of them, and a couple of real gotchas, that it's worth walking through properly once rather than fixing the same warnings from memory every time. This guide covers the actual conversion, step by step, along with what an automated tool is really doing when it does this for you.

<div style="background:#EEF2FF;border:1px solid #C7D2FE;border-radius:0.75rem;padding:1.25rem 1.5rem;margin:1.5rem 0;">
<strong style="color:#3730A3;">Key takeaways</strong>
<ul style="margin-top:0.5rem;margin-bottom:0;color:#3730A3;">
<li>Most SVG attributes just need kebab-case turned into camelCase, and class renamed to className.</li>
<li>aria-* and data-* attributes are the one deliberate exception. They stay exactly as written.</li>
<li>An inline style string has to become a real object for JSX, not just have its quotes changed.</li>
</ul>
</div>

## Why raw SVG doesn't just paste into JSX

JSX looks like HTML but compiles to JavaScript, and it follows JavaScript's rules rather than HTML's. `class` becomes `className` because `class` is a reserved word in JavaScript. A hyphenated attribute like `stroke-width` becomes `strokeWidth` because a bare hyphen in that position would be read as subtraction, not part of an identifier. None of this is arbitrary. It's a direct consequence of JSX being JavaScript syntax wearing HTML's clothes.

## Step 1: Start with the raw SVG

Here's a simple checkmark icon, the kind of thing you might export from a design tool or grab from an icon set:

```html
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#4F46E5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="check-icon">
  <path d="M20 6L9 17l-5-5" />
</svg>
```

This is valid SVG and would render fine dropped directly into an HTML file. Pasted as-is into a JSX return statement, it will cause warnings the moment React tries to reconcile `class`, `stroke-width`, and `stroke-linecap` against its known set of DOM properties.

## Step 2: Rename class to className

The most familiar one first:

```diff
- class="check-icon"
+ className="check-icon"
```

## Step 3: Convert kebab-case attributes to camelCase

Most of the remaining changes follow one consistent rule: split on the hyphen, capitalize the following letter, remove the hyphen.

```diff
- stroke-width="2"
+ strokeWidth="2"

- stroke-linecap="round"
+ strokeLinecap="round"

- stroke-linejoin="round"
+ strokeLinejoin="round"
```

<figure>
  <img src="/guides/svg-to-react-component/attribute-mapping.svg" alt="A mapping of SVG attribute names to their JSX equivalents: class becomes className, stroke-width becomes strokeWidth, fill-rule becomes fillRule, stroke-linecap becomes strokeLinecap, xlink:href becomes xlinkHref, while aria-hidden stays unchanged" width="800" height="420" loading="lazy" />
  <figcaption>The pattern is generic and predictable, with one deliberate exception.</figcaption>
</figure>

Worth noting: many SVG attributes are already camelCase in the source spec, like `viewBox` and `preserveAspectRatio`. Those don't need touching at all. Only the genuinely hyphenated ones (`fill-rule`, `clip-rule`, `stroke-dasharray`, `font-family`, and a handful of others) need converting.

## Step 4: Leave aria-* and data-* attributes alone

This is the one real exception to the rule above, and it's easy to get wrong if you're applying the camelCase pattern automatically without thinking about it. React deliberately keeps `aria-*` and `data-*` attributes in their original hyphenated form:

```html
<svg aria-hidden="true" data-testid="check-icon">
```

stays exactly as written in JSX. Converting these to `ariaHidden` or `dataTestid` would actually be wrong here, not just unnecessary.

## Step 5: Convert an inline style string to an object

If the SVG has an inline `style` attribute, it needs more than a rename. JSX's `style` prop specifically expects a JavaScript object, not a string:

```diff
- style="color: red; font-size: 12px"
+ style={{ color: 'red', fontSize: '12px' }}
```

Each CSS property name inside the object also gets the same kebab-to-camelCase treatment (`font-size` becomes `fontSize`), separately from the attribute-name conversion happening everywhere else in the tag.

## Step 6: Handle xlink:href, if present

Gradients and patterns sometimes reference another element using `xlink:href`, an older, namespaced attribute:

```diff
- xlink:href="#gradient1"
+ xlinkHref="#gradient1"
```

React supports `xlinkHref` directly as the JSX equivalent. The `xmlns:xlink` namespace declaration on the root `<svg>` isn't needed once you're using this prop name, and can be dropped.

## Step 7: Wrap it in a component and spread props

At this point the tag itself is valid JSX. Wrapping it in a proper component makes it reusable, and spreading `props` onto the root `<svg>` element is what lets a consumer override `className`, `width`, `onClick`, or anything else without the component needing to explicitly support every possible prop:

```jsx
export function CheckIcon(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}
```

Notice `stroke="#4F46E5"` was also changed to `stroke="currentColor"` here. That's optional, but it's what makes the icon's color follow whatever text color is set on it or its parent, rather than being permanently locked to one hardcoded color.

## Step 8: Add TypeScript types, if the project uses them

`React.SVGProps<SVGSVGElement>` already describes every valid prop an `<svg>` element accepts, so there's no need to hand-write a prop list:

```tsx
import * as React from "react";

export interface CheckIconProps extends React.SVGProps<SVGSVGElement> {}

export function CheckIcon(props: CheckIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}
```

## Common mistakes worth avoiding

**Blindly camelCasing aria-* and data-* attributes.** Covered above, but worth repeating since it's the single most common slip when applying the conversion by habit rather than checking each attribute.

**Forgetting JSX requires an explicit self-closing slash.** `<path d="..." >` without a matching close is valid in some loose HTML contexts but is a syntax error in JSX. Every childless element needs `<path d="..." />`.

**Converting the style string's quotes without converting its structure.** `style="color: 'red'"` is still a string, and still wrong. It has to become an actual object, `style={{ color: 'red' }}`, braces and all.

**Forgetting to spread props onto the root element.** Skipping `{...props}` still produces a working component, just an inflexible one. A consumer won't be able to pass a `className` or an `onClick` handler through to it later without editing the component itself.

## Doing this automatically

Once the pattern above is familiar, it's also exactly what an automated converter is doing, just applied instantly and consistently across every attribute rather than by hand. Our own [SVG to React & Vue Component Converter](/svg-tools/svg-to-react-component/) runs this same conversion, including the aria/data exception and the style-to-object handling, and also offers a currentColor toggle and a Vue output mode for the same source SVG. If you're converting more than one or two icons, it's worth reaching for directly rather than repeating these steps by hand each time. For cleaning up messy source markup before converting it at all, an [SVG Editor](/svg-tools/svg-editor/) is a useful first pass.

## The short version

Converting SVG to JSX comes down to a small, consistent set of rules: rename `class` to `className`, turn hyphenated attributes into camelCase, leave `aria-*` and `data-*` exactly as they are, and turn any `style` string into a real object. Wrap the result in a component, spread `props` onto the root element so it stays flexible, and swap a hardcoded color for `currentColor` if you want it to follow its surroundings. Once you've done it by hand once, you'll recognize exactly what a conversion tool is doing for you every time after.