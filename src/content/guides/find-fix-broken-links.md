---
title: "How to Find and Fix Broken Links on Your Site"
description: "How broken links happen, why they quietly hurt both user experience and SEO, and a practical process for finding and fixing them across an entire site."
metaTitle: "How to Find and Fix Broken Links on Your Site"
metaDescription: "A step-by-step guide to finding and fixing broken links, including internal vs external links, common causes, and how to prioritize fixes."
image: "/guides/find-fix-broken-links/hero.svg"
imageAlt: "A sitemap diagram with several links marked as broken (404) among working links"
publishDate: 2026-08-14
category: "seo-tools"
relatedTools:
  - "broken-link-checker"
  - "redirect-chain-checker"
faqs:
  - question: "Do broken links actually hurt SEO, or just user experience?"
    answer: "Both, though through different mechanisms. For users, a broken link is an immediate dead end that damages trust and can end a visit early. For crawlers, broken internal links waste crawl budget on dead ends and break the flow of link authority through a site's internal linking structure, since a link pointing nowhere passes nothing forward. Neither effect is usually dramatic on its own, but both accumulate as broken links pile up over time."
  - question: "What's the difference between a broken internal link and a broken external link?"
    answer: "An internal link points to another page on the same site, so a broken one is entirely within your control to fix, either by correcting the link or restoring the missing page. An external link points to another site, so it can break for reasons entirely outside your control, like the other site restructuring its own URLs or shutting down. Both are worth fixing, but internal links deserve priority since they're both more fixable and more directly tied to your own site's crawl structure."
  - question: "How often should a site be checked for broken links?"
    answer: "There's no fixed universal schedule, it depends on how often content changes and how large the site is. A frequently updated site with lots of internal linking benefits from checking every few weeks or after major content changes; a smaller, rarely updated site might only need an occasional check every few months. The more relevant trigger than a fixed schedule is checking after any site restructuring, migration, or bulk content change, since those are when broken links are most likely to appear all at once."
  - question: "Should I redirect a broken link or just remove it?"
    answer: "It depends on whether the linked content still exists somewhere. If the destination page moved rather than disappeared, redirecting the old URL to its new location preserves both the link and any value it was passing along. If the content is genuinely gone with no real replacement, removing or updating the link to point somewhere relevant is usually better than redirecting to an unrelated page just to avoid a 404."
  - question: "Can a link be broken even if it worked when it was first added?"
    answer: "Yes, this is actually the most common way broken links form. A link that worked perfectly when added can break later if the destination page gets moved, renamed, or deleted, entirely independent of anything happening on the page containing the link itself. This is why broken links tend to accumulate gradually across a site's lifetime rather than appearing all at once."
  - question: "Do broken links in old blog posts matter if the posts don't get much traffic anymore?"
    answer: "They matter less for direct user impact, but still count toward overall site quality signals and still waste crawl budget if the pages remain indexed and crawled. Prioritizing high-traffic pages first is reasonable, but a periodic full-site sweep is still worth doing, since crawlers don't only visit a site's most popular pages."
---

Links break quietly. A page that worked perfectly when it was linked to can disappear or move months later, with nothing on the linking page itself changing at all. Left unchecked, broken links accumulate across a site's lifetime, and by the time someone notices, there can be dozens or hundreds scattered across years of content. This guide covers why they happen, why they're worth fixing, and a practical process for finding and clearing them.

<div style="background:#EEF2FF;border:1px solid #C7D2FE;border-radius:0.75rem;padding:1.25rem 1.5rem;margin:1.5rem 0;">
<strong style="color:#3730A3;">Key takeaways</strong>
<ul style="margin-top:0.5rem;margin-bottom:0;color:#3730A3;">
<li>A link can break long after it was added, entirely because of changes on the destination page, not the linking page</li>
<li>Broken links hurt both user trust and crawl efficiency, wasting crawl budget and breaking the flow of internal link authority</li>
<li>Internal broken links are fully within your control to fix; external ones depend on a site you don't control</li>
<li>Whether to redirect or remove a broken link depends on whether the original content still exists somewhere else</li>
<li>Broken links accumulate gradually, so periodic full-site checks catch what individual page reviews miss</li>
</ul>
</div>

## Why Links Break Even When Nothing on Your Site Changes

The counterintuitive part of broken links is that the page containing the link often hasn't changed at all. What changed is the destination. A page you linked to a year ago can be moved, renamed, restructured, or deleted by whoever controls it, and your link has no way of knowing that happened, it just keeps pointing at a URL that no longer resolves.

<figure>
  <img src="/guides/find-fix-broken-links/why-links-break.svg" alt="Timeline showing a link working correctly when added, then becoming broken later after the destination page was moved or deleted, with the linking page unchanged throughout" width="800" height="420" loading="lazy" />
  <figcaption>The linking page stays the same; it's the destination that quietly moves or disappears.</figcaption>
</figure>

This is true for both internal and external links, but the distinction between the two matters for how fixable each one is.

## Internal vs. External: Different Causes, Different Fixes

**Internal links** point to other pages on your own site, which means a broken one is entirely within your control. It usually traces back to a page being deleted, a URL slug being changed without a redirect, or a typo in the link itself. Because you control both ends, internal broken links are typically the easiest to actually fix, and they're also the ones most directly affecting your own site's crawl efficiency and internal link structure.

**External links** point to other sites, and they break for reasons completely outside your control: the other site restructures its URLs, shuts down, or removes the specific page you linked to. You can't prevent this, but you can still find and address it, either by updating the link to a working replacement or removing it if no reasonable alternative exists.

## Why Broken Links Cost More Than They Look Like They Do

<figure>
  <img src="/guides/find-fix-broken-links/broken-link-impact.svg" alt="Diagram showing a broken internal link interrupting the flow of link authority between two pages, compared to an intact link passing it through normally" width="800" height="420" loading="lazy" />
  <figcaption>A broken internal link is a dead end for both users and the flow of link authority through a site.</figcaption>
</figure>

For a visitor, a broken link is an immediate, visible dead end, one that can end a visit or damage trust in the site's overall quality, especially if it happens more than once. For crawlers, the cost is less visible but just as real: a broken internal link wastes crawl budget on a URL that returns nothing useful, and it breaks the chain by which link authority flows between pages on a site, since a dead link passes nothing forward to wherever it was supposed to point.

Neither cost is usually severe from a single broken link. The problem is that broken links accumulate, and a site that's gone years without a check can easily be carrying dozens scattered across old content, each one a small, compounding drag on both user experience and crawl efficiency.

## A Practical Process for Finding and Fixing Them

1. **Scan the full site, not just recent pages.** Broken links concentrate in older content precisely because it's had the most time for destination pages to change. A scan limited to recently published pages will miss most of the actual problem.
2. **Separate internal from external results.** Internal broken links are fully actionable immediately; external ones need a judgment call on whether a replacement exists.
3. **Decide redirect vs. remove for each internal break.** If the content moved, point the old URL to its new location. If it's genuinely gone, update or remove the link rather than leaving a dead end or redirecting somewhere unrelated just to avoid a 404.
4. **Prioritize high-traffic and high-link-count pages first** if the full list is large, since fixing those delivers the most immediate benefit to both users and crawl efficiency.
5. **Re-check periodically, especially after migrations.** A one-time cleanup doesn't prevent new breaks from forming; site restructurings and content deletions are the moments most likely to introduce a fresh batch all at once.

## Finding Broken Links Without Clicking Every One by Hand

Manually clicking through every link on a site of any real size isn't practical, and it's easy to miss links buried in older content that rarely gets revisited. The [Broken Link Checker](/seo-tools/broken-link-checker/) crawls a site's pages and reports which links return an error, distinguishing internal from external so the most actionable fixes surface first. For broken links that turn out to be the result of an underlying redirect problem rather than a genuinely missing page, the [Redirect Chain Checker](/seo-tools/redirect-chain-checker/) can help trace what's actually happening at the destination.

## The short version

Links break primarily because their destination changes, not because anything on the linking page does, which is why they accumulate quietly over a site's lifetime rather than announcing themselves. Internal broken links are fully within your control to fix and matter most for crawl efficiency; external ones depend on sites you don't control but are still worth periodically checking. A practical process, full-site scans, internal-first prioritization, and redirect-or-remove decisions based on whether content still exists, keeps the count from growing into something unmanageable.