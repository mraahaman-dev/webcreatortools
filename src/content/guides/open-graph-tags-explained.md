---
title: "Open Graph Tags Explained: How Social Previews Actually Work"
description: "How og:title, og:description, and og:image control the preview card that appears when a link is shared, the right image size to use, and why cached previews go stale."
metaTitle: "Open Graph Tags Explained: How Social Previews Actually Work"
metaDescription: "Learn how Open Graph tags build a link's social preview card, the correct og:image size and aspect ratio, and how Twitter Card tags relate to them."
image: "/guides/open-graph-tags-explained/hero.svg"
imageAlt: "A raw URL transforming into a rich social media preview card with an image, title, and description"
publishDate: 2026-08-14
category: "seo-tools"
relatedTools:
  - "open-graph-generator"
  - "twitter-card-validator"
  - "meta-tag-generator"
faqs:
  - question: "What happens if a page has no Open Graph tags at all?"
    answer: "Most platforms fall back to scraping whatever they can find, typically the page's <title> tag, a meta description if one exists, and sometimes the first sizable image on the page. This fallback is unreliable and often picks something unintended, like a logo instead of a relevant image, which is exactly why explicit Open Graph tags exist."
  - question: "What's the ideal size for og:image?"
    answer: "1200 by 630 pixels is the widely recommended size, giving a 1.91:1 aspect ratio that displays well across most platforms without awkward cropping. Going smaller risks the image looking blurry when scaled up on larger preview surfaces, and using a different aspect ratio risks the platform cropping it in a way that cuts off important content."
  - question: "Do I need separate Twitter Card tags if I already have Open Graph tags?"
    answer: "Not strictly. Twitter (X) will fall back to using standard og:title, og:description, and og:image tags if dedicated twitter:card tags aren't present. Adding twitter:card explicitly, usually set to summary_large_image, gives more direct control over exactly how the preview appears on that platform specifically, but it's a refinement, not a requirement."
  - question: "Why does my updated og:image still show the old image when I share the link?"
    answer: "Most platforms cache the Open Graph data they scrape the first time a URL is shared, and don't automatically re-check it every time the link is shared again afterward. Updating the tags on your page doesn't retroactively update a cache that already exists, each platform provides its own debugging or cache-refresh tool to force a re-scrape after a real change."
  - question: "Does og:image need to be an absolute URL?"
    answer: "Yes. A relative path like /images/preview.jpg will often fail silently, since the scraping bot fetching the tag doesn't necessarily resolve it against the page's domain the way a browser rendering the actual page would. Always use the full absolute URL, including https:// and the domain, for og:image."
  - question: "What's the difference between og:type values like website and article?"
    answer: "og:type tells the consuming platform what kind of content the page represents, which can affect what additional structured fields the platform expects or displays, article type, for instance, pairs naturally with additional tags like article:published_time. website is a safe, generic default when none of the more specific types clearly apply."
---

Paste a link into a chat app or social feed and, a moment later, a rich preview card appears, complete with an image, a headline, and a short description. That card isn't generated automatically from the page's content, it's built almost entirely from a specific set of meta tags called Open Graph, and getting them wrong is why some shared links show a broken image or the wrong title entirely.

<div style="background:#EEF2FF;border:1px solid #C7D2FE;border-radius:0.75rem;padding:1.25rem 1.5rem;margin:1.5rem 0;">
<strong style="color:#3730A3;">Key takeaways</strong>
<ul style="margin-top:0.5rem;margin-bottom:0;color:#3730A3;">
<li>Open Graph tags directly control the preview card shown when a link is shared, they aren't auto-generated from page content</li>
<li>1200×630 pixels (a 1.91:1 ratio) is the standard recommended size for <code>og:image</code></li>
<li><code>og:image</code> must be an absolute URL; a relative path often fails silently</li>
<li>Twitter/X falls back to standard Open Graph tags if dedicated <code>twitter:card</code> tags aren't present</li>
<li>Platforms cache scraped Open Graph data, updating your tags won't refresh an already-cached preview without forcing a re-scrape</li>
</ul>
</div>

## The Core Open Graph Tags

A handful of tags, placed in the page `<head>`, are what most platforms actually read to build a preview card:

```html
<meta property="og:title" content="How Open Graph Tags Work" />
<meta property="og:description" content="A clear guide to social preview cards." />
<meta property="og:image" content="https://example.com/images/preview.jpg" />
<meta property="og:url" content="https://example.com/open-graph-guide" />
<meta property="og:type" content="article" />
```

<figure>
  <img src="/guides/open-graph-tags-explained/tag-to-preview.svg" alt="Diagram mapping og:title, og:description, and og:image tags to the corresponding parts of a rendered social preview card" width="800" height="420" loading="lazy" />
  <figcaption>Each Open Graph tag maps directly to a specific piece of the rendered preview card.</figcaption>
</figure>

`og:title` and `og:description` don't have to match the page's regular `<title>` and meta description exactly, though they often do, since a preview card sometimes benefits from slightly different phrasing optimized for how it displays in a feed rather than a search result. `og:type` tells the platform what kind of content this is, `website` is a safe general default, `article` is common for blog posts and news, each type can unlock additional related tags a platform may use.

## Getting og:image Right

The image is usually what makes or breaks a preview card visually, and it's also the tag most likely to be set up wrong.

<figure>
  <img src="/guides/open-graph-tags-explained/image-dimensions.svg" alt="Diagram showing the recommended 1200 by 630 pixel Open Graph image size with its 1.91 to 1 aspect ratio labeled" width="800" height="420" loading="lazy" />
  <figcaption>1200×630 (1.91:1) is the widely recommended og:image size for consistent display across platforms.</figcaption>
</figure>

**Use 1200×630 pixels.** This gives a 1.91:1 aspect ratio that displays cleanly across most major platforms without significant cropping.

**Always use an absolute URL.** `https://example.com/images/preview.jpg`, not a relative path like `/images/preview.jpg`. The bots that scrape Open Graph tags don't reliably resolve relative paths the way a browser does when rendering the actual page.

**Keep important content centered.** Even at the recommended ratio, some platforms crop slightly differently, so avoid putting critical text or faces right at the edges of the image.

## How Twitter/X Cards Relate to Open Graph

Twitter (X) originally used its own separate tag set, and while it still supports dedicated tags, it also falls back to standard Open Graph tags when its own aren't present:

```html
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="How Open Graph Tags Work" />
<meta name="twitter:image" content="https://example.com/images/preview.jpg" />
```

`twitter:card` set to `summary_large_image` is what triggers the large, prominent image layout rather than a smaller thumbnail alongside the text. Adding these dedicated tags isn't required if standard Open Graph tags already exist, but it gives more direct control over exactly how a link appears specifically on that platform.

## Why an Updated Preview Doesn't Show Up Right Away

Most platforms scrape and cache a URL's Open Graph data the first time that link is shared anywhere on their service, and don't automatically re-check it on every subsequent share. Updating `og:image` on your live page afterward doesn't retroactively refresh a preview that's already been cached, the platform is still showing what it scraped the first time around. Each major platform provides its own tool for forcing a re-scrape, Facebook's Sharing Debugger and similar tools elsewhere, and using one of these after a real content change is usually necessary to see the update reflected.

## Building and Verifying Tags Without Guessing

Getting every property name exactly right, and remembering which tags need absolute URLs versus which don't, is easy to get subtly wrong by hand across a whole site. The [Open Graph Generator](/seo-tools/open-graph-generator/) builds a complete, correctly formatted tag set from a simple form, and the [Twitter Card Validator](/seo-tools/twitter-card-validator/) checks how a URL's existing tags will actually render before you share it anywhere, catching a missing or malformed image URL before real visitors ever see a broken preview.

## The short version

Open Graph tags, `og:title`, `og:description`, `og:image`, `og:url`, and `og:type`, directly control the preview card shown when a link is shared, rather than being auto-generated from page content. Use a 1200×630 image with an absolute URL, and remember that Twitter/X falls back to these same tags when its own `twitter:card` tags aren't present. Because platforms cache scraped data, a genuine update to your tags may need a manual cache-refresh through that platform's own debugging tool before the new preview actually shows up.