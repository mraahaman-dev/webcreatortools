---
title: "How to Write an SEO-Friendly Meta Title and Description"
description: "Why pixel width matters more than character count for title and description length, and how to write both so they don't get cut off or rewritten in search results."
metaTitle: "How to Write an SEO-Friendly Meta Title and Description"
metaDescription: "Learn the real pixel-width limits for meta titles and descriptions, why character counts alone are misleading, and how to write copy that earns clicks."
image: "/guides/seo-meta-title-description/hero.svg"
imageAlt: "A search result snippet showing a title and description with a ruler measuring pixel width instead of character count"
publishDate: 2026-08-14
category: "seo-tools"
relatedTools:
  - "serp-snippet-preview"
  - "meta-tag-generator"
  - "keyword-density-checker"
faqs:
  - question: "What's the actual character limit for a meta title?"
    answer: "There isn't a strict character limit, search engines truncate based on pixel width, not character count. As a practical guideline, staying under roughly 60 characters usually keeps a title from being cut off, but the real number varies depending on which letters are used, since wide characters like W and M take up more pixel space than narrow ones like i and l."
  - question: "Why did Google show a different description than the one I wrote?"
    answer: "Search engines sometimes rewrite a page's displayed description, pulling text directly from the page instead, when they judge that on-page text better matches what a specific searcher typed. Writing a strong meta description still matters since it's frequently used as-is, but it's a strong suggestion to the search engine, not a guaranteed, unconditional display."
  - question: "Does the meta description affect search rankings?"
    answer: "Not directly. It's not a ranking factor search engines use to decide position, but it does directly affect click-through rate, since it's often the deciding factor between two similarly ranked results in what a searcher actually clicks. Click-through rate itself may indirectly feed back into rankings over time, making description quality worth the effort even without a direct ranking mechanism."
  - question: "Should every page have a unique title and description?"
    answer: "Yes. Duplicate titles or descriptions across multiple pages make it harder for both users and search engines to distinguish between them in results, and can dilute how confidently a search engine associates a specific page with a specific query. Templated titles are fine as long as some unique element, like the product or article name, is included."
  - question: "Does keyword stuffing in a title help rankings?"
    answer: "No, and it usually backfires. Modern search engines are built to recognize keyword stuffing and treat it as a quality signal working against the page rather than for it, and a title crammed with repeated keywords also reads poorly to an actual human deciding whether to click, hurting click-through rate on top of any ranking impact."
  - question: "Should the target keyword go at the beginning or end of a title?"
    answer: "Front-loading the primary keyword near the start is generally considered better practice, partly because titles get truncated from the right when they run too long, so content further toward the end is more likely to be cut off, and partly because the most important term being visible immediately helps a scanning searcher decide relevance faster."
---

A meta title and description are a page's pitch in search results, and they're judged in a fraction of a second by someone scanning a list of blue links. Get the length wrong and search engines chop it off mid-sentence; get the copy wrong and even a perfectly sized snippet won't earn the click. This guide covers both the technical limits and what actually makes people choose one result over another.

<div style="background:#EEF2FF;border:1px solid #C7D2FE;border-radius:0.75rem;padding:1.25rem 1.5rem;margin:1.5rem 0;">
<strong style="color:#3730A3;">Key takeaways</strong>
<ul style="margin-top:0.5rem;margin-bottom:0;color:#3730A3;">
<li>Search engines truncate by pixel width, not character count, so a character limit is only ever a rough guideline</li>
<li>Roughly 60 characters for a title and 155-160 for a description keeps most snippets from being cut off in practice</li>
<li>Front-load the primary keyword since titles truncate from the right when they run too long</li>
<li>A meta description isn't a ranking factor directly, but it drives click-through rate, which matters regardless</li>
<li>Search engines sometimes rewrite the displayed description using on-page text if it better matches the query</li>
</ul>
</div>

## Why Pixel Width, Not Character Count, Actually Matters

Search engines truncate titles and descriptions based on how much horizontal space the rendered text takes up, not how many characters it contains. This is why two titles with the identical character count can behave differently, one full of wide letters like `W`, `M`, and capital letters generally, and another full of narrow letters like `i`, `l`, and `t`, will occupy noticeably different amounts of pixel space for the same character count.

<figure>
  <img src="/guides/seo-meta-title-description/pixel-width-truncation.svg" alt="Diagram comparing two titles with the same character count but different pixel widths, one fitting fully and one getting truncated with an ellipsis" width="800" height="420" loading="lazy" />
  <figcaption>Same character count, different pixel width, only one fits without truncating.</figcaption>
</figure>

That's why character-count guidelines are always approximate. Staying under roughly 60 characters for a title and 155-160 for a description works as a practical rule of thumb for most fonts search engines actually render with, but a title packed with wide capital letters can still get cut off well under that character count, while a title full of narrow lowercase letters might fit with room to spare even slightly over it.

## Writing a Title That Doesn't Get Cut Off

Beyond raw length, where the important information sits in the title matters just as much, since truncation happens from the right side when a title runs too long.

- **Front-load the primary keyword or main topic.** If truncation happens, what gets cut is the end, not the beginning, so put what matters most first.
- **Keep the brand name at the end, if included at all.** A trailing " | Your Brand Name" is the safest thing to lose to truncation, since the page's actual topic has already been communicated by that point.
- **Avoid stuffing multiple keyword variations in.** One clear, specific title beats several overlapping keyword phrases crammed together, both for how it reads and for triggering keyword-stuffing quality signals.

## Writing a Description That Earns the Click

Unlike the title, the description has no direct ranking influence, but it's often the single biggest factor in whether someone clicks a result ranked #3 over the one ranked #2 sitting right above it.

<figure>
  <img src="/guides/seo-meta-title-description/good-vs-vague-snippet.svg" alt="Diagram comparing a vague generic search snippet against a specific, compelling one that clearly states what the page offers" width="800" height="420" loading="lazy" />
  <figcaption>A specific, benefit-forward description outperforms a vague, generic one at the same length.</figcaption>
</figure>

- **State what the page actually delivers, specifically.** "Learn about SEO" tells a searcher almost nothing; "A step-by-step guide to fixing 404 errors before they hurt your rankings" tells them exactly what they'll get.
- **Match search intent.** A description for a how-to guide should sound like a how-to guide; a description for a product page should mention price, availability, or a key differentiator, whatever a searcher with that specific intent is actually scanning for.
- **Don't rely on it being shown verbatim.** Search engines will sometimes swap in text pulled directly from the page instead, when they judge it matches a specific query better, so a strong description is a strong suggestion, not an unconditional guarantee of what displays.

## Previewing Before You Publish

Since truncation depends on rendered pixel width rather than a fixed character count, the only reliable way to know whether a specific title and description will fit is to actually render them the way a search engine would, rather than counting characters and hoping. The [SERP Snippet Preview](/seo-tools/serp-snippet-preview/) renders a live preview using the same approximate width search engines use, showing exactly where truncation would happen before the page ever goes live.

## The short version

Meta titles and descriptions get truncated by pixel width, not character count, which is why character limits are always approximate guidelines rather than hard rules, roughly 60 characters for a title and 155-160 for a description is a reasonable starting point. Front-load the important keyword in the title since truncation cuts from the right, and write descriptions that specifically state what the page delivers rather than vague filler, since the description's real job is earning the click, not directly influencing rank. Preview both before publishing rather than relying on a character count alone.