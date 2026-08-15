---
title: "Robots.txt Explained: Syntax, Rules, and Common Mistakes"
description: "How robots.txt actually works, the syntax every rule follows, and the mistakes that most often cause pages to be blocked or crawled by accident."
metaTitle: "Robots.txt Explained: Syntax, Rules, and Common Mistakes"
metaDescription: "A complete guide to robots.txt syntax, directives, and crawler behavior, including the most common mistakes that accidentally block or expose pages."
image: "/guides/robots-txt-explained/hero.svg"
imageAlt: "A robots.txt file with User-agent, Disallow, Allow, and Sitemap directives labeled"
publishDate: 2026-08-14
category: "seo-tools"
relatedTools:
  - "robots-txt-tester"
  - "ai-crawler-access-checker"
faqs:
  - question: "Does robots.txt actually prevent a page from appearing in search results?"
    answer: "Not reliably. Disallowing a URL in robots.txt tells well-behaved crawlers not to fetch that page's content, but if the URL is linked from elsewhere, a search engine can still index the URL itself, sometimes showing it in results with no description, since it was never allowed to crawl the page to generate one. Reliably keeping a page out of search results requires a noindex meta tag or header instead, which requires the page to be crawlable in the first place."
  - question: "Is robots.txt legally or technically enforced?"
    answer: "No. Robots.txt is purely a voluntary convention. Well-behaved crawlers like Googlebot honor it, but nothing stops a crawler from ignoring it entirely, and malicious bots routinely do. It should never be relied on as a security or access-control mechanism for genuinely private content."
  - question: "What happens if a site has no robots.txt file at all?"
    answer: "Most crawlers treat a missing robots.txt (a 404 response) as permission to crawl everything, the same as if the file existed but contained no rules. This is a perfectly valid setup for many sites; robots.txt is only necessary when there's something specific you want to restrict."
  - question: "Can I have multiple Sitemap lines in one robots.txt?"
    answer: "Yes, and it's common for larger sites with multiple sitemap files or a sitemap index. Each Sitemap directive is independent of the User-agent blocks above it, it applies globally to the whole file regardless of where it's placed."
  - question: "Why do some AI crawlers ignore robots.txt entirely?"
    answer: "Reputable AI crawlers, like those from major search and AI companies, generally do honor robots.txt directives targeted at their specific user-agent name, the same as traditional search crawlers. Less reputable scrapers, however, often ignore it entirely, since as a voluntary convention robots.txt has no technical enforcement behind it. Checking which named crawlers a site actually allows is different from assuming every bot respects the file."
  - question: "Does order matter within a robots.txt file?"
    answer: "Within a single User-agent block, most modern crawlers use the longest matching rule rather than the first or last one, so a specific Allow can override a broader Disallow even when it appears after it. This differs from how some older or simpler parsers behave, which is part of why testing actual behavior matters more than reasoning about the file by eye."
---

Robots.txt is one of the oldest and most misunderstood files on the web. It's a plain text file with a small handful of directives, yet it's easy to write a rule that blocks far more than intended, or one that looks restrictive but does nothing at all. This guide covers exactly how robots.txt syntax works, what each directive actually controls, and the mistakes that show up most often in real sites.

<div style="background:#EEF2FF;border:1px solid #C7D2FE;border-radius:0.75rem;padding:1.25rem 1.5rem;margin:1.5rem 0;">
<strong style="color:#3730A3;">Key takeaways</strong>
<ul style="margin-top:0.5rem;margin-bottom:0;color:#3730A3;">
<li>Robots.txt controls crawling, not indexing, a disallowed page can still appear in search results under some conditions</li>
<li>It's a voluntary convention with no technical enforcement, well-behaved crawlers follow it, others simply ignore it</li>
<li>Rules are grouped by User-agent, and the most specific matching rule generally wins, not necessarily the first or last one</li>
<li>A missing or empty robots.txt is treated as permission to crawl everything</li>
<li>Sitemap directives apply globally to the whole file, regardless of where they're placed relative to User-agent blocks</li>
</ul>
</div>

## What Robots.txt Actually Controls

Robots.txt lives at the root of a domain, `example.com/robots.txt`, and tells crawlers which parts of a site they're welcome to request. It's important to be precise about what that means: robots.txt governs *crawling*, the act of a bot fetching a URL, not *indexing*, whether that URL shows up in search results. A URL that's disallowed but linked to from elsewhere can still be indexed by its URL alone, just without the page content a crawler was never allowed to read.

<figure>
  <img src="/guides/robots-txt-explained/directive-anatomy.svg" alt="A labeled robots.txt file showing the User-agent, Disallow, Allow, and Sitemap directives and what each line controls" width="800" height="420" loading="lazy" />
  <figcaption>The four directives that make up nearly every robots.txt file.</figcaption>
</figure>

It's also worth being clear that robots.txt is entirely voluntary. There's no technical mechanism forcing a crawler to obey it, well-known, reputable crawlers do because ignoring it would be considered bad practice, but nothing stops a crawler, especially a malicious one, from requesting disallowed URLs anyway. It should never be treated as a way to actually secure or hide sensitive content.

## The Core Syntax

A robots.txt file is organized into groups, each starting with one or more `User-agent` lines followed by the rules that apply to those crawlers.

**User-agent** names which crawler the following rules apply to. `*` matches every crawler that doesn't have its own more specific group elsewhere in the file. A specific name like `Googlebot` only applies to that crawler, and when a crawler has both a specific group and would otherwise match `*`, it follows its own specific group instead.

**Disallow** tells the matching crawler(s) not to request URLs starting with the given path. `Disallow: /admin/` blocks everything under `/admin/`, including nested paths.

**Allow** carves out an exception within a broader Disallow, useful when most of a directory should stay blocked but one file inside it shouldn't.

**Sitemap** points crawlers to a sitemap file's location. Unlike User-agent, Disallow, and Allow, it isn't scoped to any particular group, it applies to the file as a whole no matter where it appears.

## How Conflicting Rules Are Resolved

When Allow and Disallow rules overlap for the same crawler, most modern crawlers resolve the conflict by using whichever rule has the longer, more specific matching path, not simply whichever rule appears first or last in the file.

<figure>
  <img src="/guides/robots-txt-explained/rule-specificity.svg" alt="Diagram showing a broad Disallow rule for a folder being overridden by a more specific Allow rule for one file inside it" width="800" height="420" loading="lazy" />
  <figcaption>A more specific rule generally wins over a broader one, regardless of order.</figcaption>
</figure>

Given `Disallow: /admin/` and `Allow: /admin/public-page.html`, the second rule's path is longer and more specific, so `/admin/public-page.html` remains crawlable even though it sits inside a disallowed folder. This behavior isn't part of the original, informal robots.txt convention, and not every parser implements it identically, which is exactly why testing a file's real-world behavior matters more than reasoning through it by eye.

## Common Mistakes

**Blocking an entire site by accident.** `Disallow: /` blocks everything on the domain. This is sometimes left over from a staging environment's robots.txt that made it into production unnoticed, quietly telling crawlers to stay away from a live site.

**Assuming Disallow prevents indexing.** As covered above, a disallowed URL can still appear in search results by URL alone if it's linked elsewhere. Actually preventing indexing requires a `noindex` directive on the page itself, which the crawler needs to be *allowed* to fetch in order to see.

**Forgetting that paths are case-sensitive and prefix-based.** `Disallow: /Admin/` does not block `/admin/`, and `Disallow: /file` blocks `/file`, `/file.html`, and `/files/anything`, not just an exact match, since it's a prefix, not a whole-path comparison.

**Blocking CSS or JavaScript needed to render the page.** Search engines render pages to understand layout and content, and blocking the assets required to do that can hurt how a page is understood and ranked, even though the HTML itself remains crawlable.

**Not testing against the actual crawler in question.** A rule written for `User-agent: *` behaves differently once a crawler-specific group exists elsewhere in the file, and it's easy to add a new group without noticing it changes how an existing bot is treated.

## Checking a Real File Instead of Guessing

Robots.txt syntax looks simple, but the interaction between multiple groups, specificity rules, and crawler-specific behavior makes it easy to write something that doesn't do what it looks like it does. The [Robots.txt Tester](/seo-tools/robots-txt-tester/) checks a live domain's actual robots.txt (or a pasted draft) against a specific crawler's user-agent and reports exactly which rule wins for a given URL. If the concern is specifically AI crawlers rather than traditional search bots, the [AI Crawler Checker](/seo-tools/ai-crawler-checker/) checks a domain's stance toward named AI crawlers directly.

## The short version

Robots.txt is a small, plain-text convention with just a few directives, User-agent, Disallow, Allow, and Sitemap, but its rule-resolution behavior (most specific match wins) and its limits (it governs crawling, not indexing, and isn't enforced on bots that choose to ignore it) are easy to get wrong. Testing a file's actual effect against a real crawler and a real URL is far more reliable than reasoning through the rules by eye.