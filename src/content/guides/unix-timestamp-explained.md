---
title: "Unix Timestamp Explained: Convert, Read, and Debug It"
description: "What a Unix timestamp actually counts, the seconds-vs-milliseconds mistake that breaks dates constantly, and how timezone display works with a timezone-free number."
metaTitle: "Unix Timestamp Explained: Convert, Read, and Debug It"
metaDescription: "Learn what a Unix timestamp is, why seconds vs milliseconds trips up so many bugs, how timezones apply to a timezone-independent number, and the 2038 problem."
image: "/guides/unix-timestamp-explained/hero.svg"
imageAlt: "A timeline starting at January 1, 1970 counting up in seconds to a Unix timestamp value"
publishDate: 2026-08-14
category: "developer-tools"
relatedTools:
  - "unix-timestamp-converter"
  - "jwt-decoder"
  - "cron-expression-parser"
faqs:
  - question: "What exactly does a Unix timestamp count?"
    answer: "The number of seconds that have elapsed since midnight UTC on January 1, 1970, a moment referred to as the Unix epoch. A timestamp of 0 means exactly that moment; any positive number counts seconds forward from there, and negative numbers represent moments before it."
  - question: "Why does a timestamp look wrong by a factor of 1000 in JavaScript?"
    answer: "JavaScript's Date object expects milliseconds, not seconds, while a standard Unix timestamp is in seconds. Passing a raw Unix timestamp straight into new Date() without multiplying by 1000 first produces a date decades too early, since the number gets interpreted as milliseconds since 1970, which is a far smaller span of real time than the same number of seconds."
  - question: "Does a Unix timestamp have a timezone?"
    answer: "No, and this is a common point of confusion. The number itself represents a single, unambiguous moment in time relative to UTC, with no timezone attached to it at all. Timezone only enters the picture when that moment gets displayed as a human-readable date, at which point the same timestamp will show a different local time depending on which timezone is used for formatting."
  - question: "What is the Year 2038 problem?"
    answer: "Systems that store a Unix timestamp as a signed 32-bit integer can only represent values up to 2,147,483,647, which corresponds to a moment in January 2038. Past that point, the number overflows and wraps around to a negative value, which older or embedded systems using 32-bit timestamps can misinterpret as a date back in 1901. Modern systems using 64-bit integers don't have this limit for a very long time to come."
  - question: "Can a Unix timestamp be negative?"
    answer: "Yes. A negative Unix timestamp represents a moment before the epoch, January 1, 1970. This comes up when working with historical dates, for example a birthdate from the 1950s converted to a Unix timestamp will be a negative number, and most modern date libraries handle this correctly without any special casing needed."
  - question: "How do I get the current Unix timestamp in JavaScript?"
    answer: "Math.floor(Date.now() / 1000) gives the current timestamp in seconds, since Date.now() itself returns milliseconds. Some codebases just use Date.now() directly and call that a timestamp, which technically produces a millisecond-based Unix timestamp rather than the traditional seconds-based one, so it's worth being explicit about which unit a given piece of code expects."
---

A Unix timestamp is just a number, and that's exactly what makes it useful and occasionally confusing at the same time. It's a single integer that unambiguously represents one moment, with no timezone baked in and no formatting to argue about, but that same simplicity is also where the most common bugs come from, starting with seconds getting mixed up with milliseconds.

<div style="background:#EEF2FF;border:1px solid #C7D2FE;border-radius:0.75rem;padding:1.25rem 1.5rem;margin:1.5rem 0;">
<strong style="color:#3730A3;">Key takeaways</strong>
<ul style="margin-top:0.5rem;margin-bottom:0;color:#3730A3;">
<li>A Unix timestamp counts seconds elapsed since midnight UTC on January 1, 1970, the "epoch"</li>
<li>JavaScript's <code>Date</code> expects milliseconds, so a raw Unix timestamp needs multiplying by 1000 first</li>
<li>The timestamp number itself has no timezone; timezone only applies when it's formatted for display</li>
<li>Negative timestamps represent moments before 1970 and are handled normally by modern date libraries</li>
<li>Systems storing timestamps as a signed 32-bit integer will overflow in January 2038</li>
</ul>
</div>

## What "Seconds Since the Epoch" Actually Means

Every Unix timestamp counts up from the same fixed starting point, called the epoch: midnight UTC on January 1, 1970. A timestamp of `0` is that exact moment. A timestamp of `1755043200` means 1,755,043,200 seconds have elapsed since then.

<figure>
  <img src="/guides/unix-timestamp-explained/epoch-timeline.svg" alt="Timeline starting at the Unix epoch on January 1, 1970 counting forward in seconds to a labeled timestamp value" width="800" height="420" loading="lazy" />
  <figcaption>Every Unix timestamp is a count of seconds forward (or backward) from the same fixed starting point.</figcaption>
</figure>

This design is what makes Unix timestamps so easy to store, compare, and sort, comparing two timestamps is just comparing two plain numbers, no date-parsing logic required. It's also why they show up constantly in places like JWT `exp`/`iat` claims, database `created_at` columns, and API responses, a single integer is compact and completely unambiguous.

## The Seconds vs. Milliseconds Mistake

This is the single most common bug involving Unix timestamps, and it happens because JavaScript quietly does something different from the traditional Unix standard. `Date.now()` and `new Date()` in JavaScript both work in milliseconds, not seconds, while a standard Unix timestamp from most APIs, databases, and other languages is in seconds.

<figure>
  <img src="/guides/unix-timestamp-explained/seconds-vs-milliseconds.svg" alt="Diagram showing a raw Unix timestamp passed directly into JavaScript's Date constructor producing a date in 1970 instead of the intended date, versus correctly multiplying by 1000 first" width="800" height="420" loading="lazy" />
  <figcaption>Skipping the ×1000 conversion produces a date decades too early.</figcaption>
</figure>

```javascript
const timestamp = 1755043200; // seconds, a standard Unix timestamp

new Date(timestamp);        // wrong: interpreted as milliseconds, lands in 1970
new Date(timestamp * 1000); // correct: converted to milliseconds first
```

Going the other direction, when generating a timestamp to send somewhere that expects seconds, the same conversion needs to happen in reverse:

```javascript
Math.floor(Date.now() / 1000); // current Unix timestamp, in seconds
```

Whenever a decoded date looks suspiciously close to January 1, 1970, this mismatch is almost always the cause.

## Why the Same Timestamp Shows Different Local Times

A Unix timestamp is defined relative to UTC and carries no timezone information of its own. What changes based on timezone is purely how that single moment gets displayed. The timestamp `1755043200` refers to one specific, fixed instant no matter who's looking at it or where, but formatting it in Tokyo will show a different clock time than formatting the same number in New York.

This distinction matters when debugging a date that looks "wrong": the underlying timestamp is very likely correct, and the mismatch is almost always in the display formatting step, either an unintended timezone being applied or a timezone being silently omitted where the code assumed local time.

## The Year 2038 Problem

Older and embedded systems sometimes store a Unix timestamp as a signed 32-bit integer, which can only hold values up to 2,147,483,647. That specific number corresponds to a moment in January 2038. Once the actual timestamp exceeds that value, a 32-bit signed integer overflows and wraps around to a large negative number, which can be misread as a date back in December 1901, a bug with the same underlying cause as the well-known Y2K issue but tied to integer overflow rather than a two-digit year field. Systems using 64-bit integers for timestamps, which is most modern software, won't hit this limit for tens of billions of years, effectively never in practice.

## Converting and Debugging Without Doing the Math by Hand

Manually converting between a raw timestamp, a readable date, and the right timezone, especially while also tracking whether a given value is in seconds or milliseconds, is easy to get wrong under time pressure while debugging. The [Unix Timestamp Converter](/dev-tools/unix-timestamp-converter/) converts in both directions instantly, detects whether a pasted value looks like seconds or milliseconds, and displays the result across multiple timezones at once so there's no guessing which conversion step went wrong.

## The short version

A Unix timestamp is a single integer counting seconds since midnight UTC on January 1, 1970, with no timezone attached to the number itself, timezone only matters at display time. The most common bug is a units mismatch, JavaScript's `Date` works in milliseconds while standard Unix timestamps are in seconds, so multiply by 1000 going one direction and divide going the other. Negative values represent dates before 1970 and work normally in modern tooling; the one real structural limit is the 32-bit overflow in January 2038, which only affects systems still using an older, smaller integer size for storage.