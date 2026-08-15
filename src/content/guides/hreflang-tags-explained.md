---
title: "Hreflang Tags: A Beginner's Guide for International SEO"
description: "How hreflang tags tell search engines which language and region version of a page to show, and the reciprocal-linking mistake that breaks them most often."
metaTitle: "Hreflang Tags: A Beginner's Guide for International SEO"
metaDescription: "Learn how hreflang tags work, the correct language-region code format, why they must be reciprocal, and where to place them for international SEO."
image: "/guides/hreflang-tags-explained/hero.svg"
imageAlt: "Three language versions of the same page connected by hreflang tags pointing to each other"
publishDate: 2026-08-14
category: "seo-tools"
relatedTools:
  - "hreflang-tag-generator"
  - "meta-tag-generator"
  - "sitemap-generator"
faqs:
  - question: "Do I need hreflang tags if my site is only in one language?"
    answer: "No. Hreflang exists specifically to tell search engines which language or regional version of a page to serve when multiple versions exist, like a US English page and a UK English page covering the same content. A single-language site has nothing to disambiguate, so hreflang provides no benefit there."
  - question: "What's the difference between a language code and a region code in hreflang?"
    answer: "The language code, like en or fr, is required and specifies the language alone. An optional region code, like en-US or en-GB, further narrows it to a specific country or locale. A tag can use just the language code to target all speakers of that language broadly, or add the region code to target a specific country's version specifically."
  - question: "What does x-default mean in an hreflang tag?"
    answer: "x-default marks a fallback page for visitors whose language or region doesn't match any of the other hreflang entries listed. It's commonly pointed at a language-selector page or a default version of the site, and while it's not strictly required, its absence means search engines have to guess which version to show unmatched visitors."
  - question: "Why do my hreflang tags show as errors in Search Console even though they look correct?"
    answer: "The most common cause is a missing reciprocal link. Hreflang requires that if Page A links to Page B, Page B must link back to Page A with the same relationship, every page in the set needs to reference every other page, including itself. If even one direction of that linking is missing, search engines will flag the whole set as having errors."
  - question: "Should a page include an hreflang tag pointing to itself?"
    answer: "Yes, this is required, not optional. Every page in an hreflang set needs a self-referencing tag alongside the tags pointing to its alternate versions. Omitting the self-reference is a common mistake that breaks the reciprocal relationship the other pages in the set are expecting."
  - question: "Can hreflang tags go in the sitemap instead of the page head?"
    answer: "Yes, both are valid locations, and some sites prefer the sitemap specifically because it keeps a large number of hreflang entries out of the HTML head, which can get unwieldy with many language and region variants. HTTP headers are a third valid option, mainly used for non-HTML resources like PDFs. All three methods follow the same underlying rules around reciprocity and format."
---

Hreflang tags solve a specific problem: when the same content exists in multiple languages or regional variants, which one should a search engine actually show a given visitor? Get the tags right and search engines route people to the correct version automatically. Get them wrong, which happens constantly through one specific mistake, and search engines either ignore the tags entirely or show visitors the wrong language page.

<div style="background:#EEF2FF;border:1px solid #C7D2FE;border-radius:0.75rem;padding:1.25rem 1.5rem;margin:1.5rem 0;">
<strong style="color:#3730A3;">Key takeaways</strong>
<ul style="margin-top:0.5rem;margin-bottom:0;color:#3730A3;">
<li>Hreflang tags tell search engines which language/region version of a page to serve a given visitor</li>
<li>Every page in a set must link to every other page, including itself, or the whole set can be flagged as an error</li>
<li>Language code is required (<code>en</code>), region code is optional and more specific (<code>en-US</code>)</li>
<li><code>x-default</code> sets a fallback for visitors who don't match any listed language or region</li>
<li>Tags can live in the page <code>&lt;head&gt;</code>, the sitemap, or HTTP headers, all follow the same reciprocity rules</li>
</ul>
</div>

## The Basic Tag Format

An hreflang tag is a `<link>` element in a page's `<head>`, pointing to an alternate version of that same content in a different language or region:

```html
<link rel="alternate" hreflang="en-US" href="https://example.com/en-us/page" />
<link rel="alternate" hreflang="en-GB" href="https://example.com/en-gb/page" />
<link rel="alternate" hreflang="fr" href="https://example.com/fr/page" />
```

The `hreflang` attribute follows a language code, optionally followed by a region code separated by a dash, `en` for English generally, `en-US` for US English specifically, `en-GB` for UK English specifically. The language code alone is valid and useful when a single page should serve all speakers of that language regardless of country.

## The Rule That Breaks Most Implementations: Reciprocity

This is where hreflang goes wrong more often than anywhere else. Every page referenced in an hreflang set must link back to every other page in that same set, including a link to itself.

<figure>
  <img src="/guides/hreflang-tags-explained/reciprocal-linking.svg" alt="Diagram showing three language pages correctly linking to each other and themselves in a fully reciprocal set, versus a broken set missing one direction of linking" width="800" height="420" loading="lazy" />
  <figcaption>Every page must reference every other page in the set, including itself, or the set is considered broken.</figcaption>
</figure>

If the English page lists French and Spanish as alternates, the French page must list English and Spanish back, and the Spanish page must list English and French back too, each also referencing itself. Miss even one of these links in one direction, for example the French page forgets to link back to English, and search engines treat the entire set as unreliable rather than partially trusting it. This is the single most common reason hreflang tags show as errors in Search Console despite looking correct on any individual page.

## Setting a Fallback with x-default

`x-default` names a fallback page for visitors whose browser language doesn't match any of the specific entries listed:

```html
<link rel="alternate" hreflang="x-default" href="https://example.com/" />
```

This is typically pointed at either a language-selector landing page or a sensible default version of the site, English is common. It's optional, but leaving it out means search engines have to guess which version to serve visitors who don't match anything else in the set, which doesn't always land on the outcome you'd have chosen.

## Three Places Hreflang Tags Can Live

<figure>
  <img src="/guides/hreflang-tags-explained/three-locations.svg" alt="Diagram showing the three valid locations for hreflang tags: the HTML head, the XML sitemap, and HTTP response headers" width="800" height="420" loading="lazy" />
  <figcaption>Hreflang tags are valid in the HTML head, the sitemap, or HTTP headers, choose based on scale and content type.</figcaption>
</figure>

**In the page `<head>`** — the most common approach for sites with a modest number of language variants, since it keeps everything visible directly in the page source.

**In the XML sitemap** — better for sites with many languages or regions, since a large hreflang set in every page's `<head>` gets unwieldy fast, while the sitemap centralizes it.

**In HTTP response headers** — mainly used for non-HTML resources like PDFs, where there's no `<head>` element to place a `<link>` tag in at all.

All three follow the identical reciprocity and format rules, the choice is about scale and content type, not about which one search engines trust more.

## Generating a Correct, Reciprocal Set

Manually tracking which pages link to which, across every language and region combination, gets error-prone fast once a site has more than two or three variants, since a single missed reciprocal link anywhere in the set undermines the whole thing. The [Hreflang Tag Generator](/seo-tools/hreflang-tag-generator/) builds the complete, correctly formatted, fully reciprocal tag set for all your language and region pages at once, so nothing gets left out of the loop.

## The short version

Hreflang tags tell search engines which language or region version of a page to show a given visitor, using a `<link rel="alternate" hreflang="...">` format with a required language code and an optional region code. The rule that trips up most implementations is reciprocity: every page in the set must link to every other page, including itself, or the entire set can be flagged as broken. Add `x-default` for unmatched visitors, and place the tags in the `<head>`, sitemap, or HTTP headers depending on how many variants you're managing.