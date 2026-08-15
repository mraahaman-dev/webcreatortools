---
title: "JSON-LD Schema Markup: A Beginner's Guide With Examples"
description: "How JSON-LD structured data tells search engines what's actually on a page, the basic syntax every schema type shares, and why it can lead to richer search results."
metaTitle: "JSON-LD Schema Markup: A Beginner's Guide With Examples"
metaDescription: "Learn how JSON-LD structured data works, the @context and @type syntax every schema shares, common schema types, and how it can produce rich search results."
image: "/guides/json-ld-schema-markup/hero.svg"
imageAlt: "A block of JSON-LD code connected to a search result showing a rich snippet with star ratings and extra details"
publishDate: 2026-08-14
category: "seo-tools"
relatedTools:
  - "json-ld-schema-generator"
  - "schema-markup-validator"
  - "serp-snippet-preview"
faqs:
  - question: "Does adding JSON-LD schema guarantee a rich search result?"
    answer: "No. Structured data makes a page eligible for a rich result, like star ratings or an FAQ dropdown in search results, but search engines still decide independently whether and when to actually display one, based on many other quality and relevance signals. Valid schema is a prerequisite, not a guarantee."
  - question: "Does JSON-LD affect what visitors see on the page itself?"
    answer: "No, and this is one of its main advantages over older structured data formats. JSON-LD lives in a separate script tag and has no connection to the page's visible layout or content at all, so it can be added, removed, or changed without touching anything a visitor actually sees."
  - question: "Where should the JSON-LD script tag go in the page?"
    answer: "Most commonly in the <head>, though it's also valid in the <body>, since JSON-LD doesn't render anything and its position in the document doesn't affect how search engines parse it. Consistency across your site's pages matters more than the exact placement chosen."
  - question: "What does the @context property actually do?"
    answer: "It tells parsers which vocabulary the schema's type names and properties come from, almost always https://schema.org in practice. Without it, a parser wouldn't know whether a property like author refers to the schema.org definition or some other vocabulary's definition of the same word."
  - question: "Can a single page have more than one JSON-LD schema type?"
    answer: "Yes, either as multiple separate script tags or as an array of schema objects within one script tag. A recipe page, for example, might reasonably include both Recipe schema and BreadcrumbList schema at the same time, describing two different aspects of the same page."
  - question: "Why does my valid JSON-LD still show errors in a testing tool?"
    answer: "Valid JSON syntax and valid schema are two different things. The JSON itself might parse correctly while still being missing a property that a specific schema type requires, like a Product schema missing its required price, or using a property name that doesn't exist for that type at all. A syntax-valid but schema-invalid block will still fail schema-specific validation."
---

JSON-LD is how a page tells search engines exactly what it's about in a structured, machine-readable way, separate from anything a visitor actually sees. Get it right and a page becomes eligible for richer search results, star ratings, FAQ dropdowns, event dates, right in the results themselves. This guide covers the syntax every schema type shares and walks through a few of the most commonly used types.

<div style="background:#EEF2FF;border:1px solid #C7D2FE;border-radius:0.75rem;padding:1.25rem 1.5rem;margin:1.5rem 0;">
<strong style="color:#3730A3;">Key takeaways</strong>
<ul style="margin-top:0.5rem;margin-bottom:0;color:#3730A3;">
<li>JSON-LD lives in its own <code>&lt;script&gt;</code> tag and has zero effect on the page's visible content or layout</li>
<li>Every schema needs <code>@context</code> (almost always schema.org) and <code>@type</code> to identify what kind of thing is being described</li>
<li>Valid schema makes a page eligible for a rich result, it doesn't guarantee one will actually be shown</li>
<li>A page can include multiple schema types at once, either as separate script tags or an array</li>
<li>JSON syntax being valid doesn't mean the schema itself is valid, missing required properties still fail validation</li>
</ul>
</div>

## What JSON-LD Actually Is

JSON-LD stands for JSON for Linked Data, and it's a way of embedding structured, machine-readable descriptions of a page's content directly in the HTML, using plain JSON wrapped in a script tag:

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "How to Bake Sourdough Bread",
  "author": {
    "@type": "Person",
    "name": "Jamie Rivera"
  },
  "datePublished": "2026-08-01"
}
</script>
```

<figure>
  <img src="/guides/json-ld-schema-markup/anatomy.svg" alt="Diagram labeling the parts of a JSON-LD block: the script tag wrapper, @context, @type, and properties" width="800" height="420" loading="lazy" />
  <figcaption>Every JSON-LD block shares the same basic anatomy: a script wrapper, a context, a type, and properties.</figcaption>
</figure>

Because this lives entirely inside a `<script>` tag, it's invisible to anyone viewing the page normally, and completely independent from the page's actual visible HTML. That separation is what makes JSON-LD easier to work with than older structured data formats like microdata, which required weaving special attributes directly into the visible markup itself.

## The Two Properties Every Schema Needs

**`@context`** tells parsers which vocabulary the type and property names come from. In practice this is almost always `"https://schema.org"`, the shared vocabulary most search engines expect and understand.

**`@type`** names what kind of thing is being described, Article, Product, Recipe, FAQPage, LocalBusiness, and dozens of others, each with its own expected set of properties. This is what determines which rich result format, if any, a page becomes eligible for.

Everything else in a schema object is a property specific to that type, `headline` and `author` for an Article, `price` and `availability` for a Product, `ratingValue` for an AggregateRating, and so on. The full list of types and their properties lives in the schema.org vocabulary itself, which is extensive enough that most people reach for a generator rather than memorizing it.

## From Schema to Rich Result

<figure>
  <img src="/guides/json-ld-schema-markup/schema-to-serp.svg" alt="Diagram showing a JSON-LD Product schema block on one side connecting to an enhanced search result showing a star rating and price on the other side" width="800" height="420" loading="lazy" />
  <figcaption>Structured data on the page connects to an enhanced result in search, when the search engine chooses to show one.</figcaption>
</figure>

A Product schema with `aggregateRating` and `offers` properties filled in is what makes a search result eligible to show star ratings and a price directly in the results list, rather than just a plain blue link and description. An FAQPage schema is what makes an expandable question-and-answer dropdown possible right in the search results. In both cases, the schema provides the raw material; whether a search engine actually chooses to render the enhanced version is a separate decision based on relevance, quality signals, and the search engine's own current display rules.

## A Few Common Schema Types

- **Article** — blog posts, news articles, guides, describing headline, author, and publish date
- **Product** — items for sale, describing price, availability, and ratings
- **FAQPage** — a list of questions and answers, enabling the expandable dropdown result format
- **LocalBusiness** — a physical business location, describing address, hours, and contact info
- **BreadcrumbList** — the page's position in a site hierarchy, shown as a breadcrumb trail in results instead of a raw URL

A single page can combine several of these where relevant, for example a product page might reasonably include both `Product` schema and `BreadcrumbList` schema together, since they describe two entirely different aspects of the same page.

## Building and Checking Schema Without Guessing the Syntax

Hand-writing JSON-LD correctly means knowing exactly which properties a given type requires, which are optional, and getting the nested object structure right for things like `author` or `aggregateRating`, all easy to get subtly wrong. The [JSON-LD Schema Generator](/seo-tools/json-ld-schema-generator/) builds correctly structured schema for several common types through a plain form, and the [Schema Markup Validator](/seo-tools/schema-markup-validator/) checks existing schema against what each type actually requires, catching missing or misnamed properties that valid JSON syntax alone wouldn't reveal.

## The short version

JSON-LD embeds structured, machine-readable data about a page inside a `<script type="application/ld+json">` tag, completely separate from the page's visible content. Every schema needs `@context` (almost always schema.org) and `@type` to identify what's being described, followed by properties specific to that type. Valid schema makes a page eligible for a richer search result, star ratings, FAQ dropdowns, breadcrumbs, though search engines still decide independently whether to actually show one. Remember that syntactically valid JSON and a valid schema are two different bars to clear, missing a required property will still fail validation even when the JSON itself parses fine.