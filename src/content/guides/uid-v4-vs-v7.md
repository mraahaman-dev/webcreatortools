---
title: "UUID v4 vs v7: What's the Difference and Which Should You Use"
description: "How UUID v4's pure randomness compares to UUID v7's time-ordered structure, and why the choice matters for database performance, not just uniqueness."
metaTitle: "UUID v4 vs v7: What's the Difference and Which Should You Use"
metaDescription: "Compare UUID v4 and UUID v7: structure, sortability, database index performance, and which version fits primary keys versus non-sequential identifiers."
image: "/guides/uuid-v4-vs-v7/hero.svg"
imageAlt: "A UUID v4 shown as scattered random bytes next to a UUID v7 shown as an ordered timeline of bytes"
publishDate: 2026-08-14
category: "developer-tools"
relatedTools:
  - "uuid-generator"
  - "hash-generator"
  - "json-formatter-validator"
faqs:
  - question: "Are UUID v4 and UUID v7 both guaranteed to be unique?"
    answer: "Neither is mathematically guaranteed, but both have collision probabilities low enough to be treated as unique in practice. UUID v4 relies on 122 random bits, and UUID v7 combines a millisecond timestamp with random bits, and both spaces are large enough that accidental collisions are effectively never observed in real systems."
  - question: "Does UUID v7 leak information by including a timestamp?"
    answer: "Yes, that's a real tradeoff. Anyone who can see a UUID v7 can extract roughly when it was created, down to the millisecond. For identifiers where creation time should stay private, like certain security tokens, UUID v4's pure randomness avoids this, while UUID v7's timestamp is a deliberate feature for cases where sortability matters more than hiding creation time."
  - question: "Will switching from UUID v4 to v7 break existing systems?"
    answer: "Not at the format level, both are valid 128-bit UUIDs and use the same string representation, so anything that just stores or compares UUIDs as opaque strings won't care. The practical impact is on database index performance and any code that assumes UUIDs are unsortable or non-sequential, which is worth checking before switching an existing primary key column."
  - question: "Can I mix UUID v4 and v7 values in the same database column?"
    answer: "Technically yes, since both are valid UUIDs and the column doesn't enforce a version. Doing so loses most of v7's benefit though, since the whole point of using v7 for a primary key is consistent, mostly-ascending insert order, and interleaving random v4 values back in reintroduces the same index fragmentation v7 was meant to avoid."
  - question: "Is UUID v7 the same as an auto-incrementing integer ID?"
    answer: "No, though they share the sortability benefit. An auto-incrementing integer is strictly sequential and predictable, letting anyone guess adjacent IDs, while UUID v7 is only roughly time-ordered, since the random bits in each value still make individual IDs unguessable, combining a sequential-friendly structure with the unpredictability integers lack."
  - question: "How can I tell which version a given UUID is just by looking at it?"
    answer: "The version number is encoded directly in the string, in the first character of the third group. A UUID like xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx is version 4, and one like xxxxxxxx-xxxx-7xxx-yxxx-xxxxxxxxxxxx is version 7, that single digit tells you which generation scheme produced it."
---

Every UUID looks like the same random-looking string of hex characters and dashes, but not all UUIDs are built the same way underneath. UUID v4 is pure randomness, while UUID v7 deliberately bakes in a timestamp so values sort in roughly the order they were created. That difference sounds minor until it hits database performance at scale, where it becomes one of the more consequential choices in a schema design.

<div style="background:#EEF2FF;border:1px solid #C7D2FE;border-radius:0.75rem;padding:1.25rem 1.5rem;margin:1.5rem 0;">
<strong style="color:#3730A3;">Key takeaways</strong>
<ul style="margin-top:0.5rem;margin-bottom:0;color:#3730A3;">
<li>UUID v4 is 122 bits of pure randomness; UUID v7 embeds a 48-bit millisecond timestamp plus random bits</li>
<li>v7 values sort roughly in creation order; v4 values are randomly scattered with no inherent order</li>
<li>As database primary keys, v4 causes index fragmentation from random inserts; v7 mostly appends, keeping indexes efficient</li>
<li>v7's timestamp is readable by anyone who sees the value, which v4 avoids entirely</li>
<li>Both are equally safe from accidental collisions in practice, the difference is about structure, not uniqueness</li>
</ul>
</div>

## What's Actually Different Under the Hood

A UUID is always 128 bits, formatted as 32 hex characters split into five dash-separated groups. Where v4 and v7 diverge is how those bits are chosen.

<figure>
  <img src="/guides/uuid-v4-vs-v7/structure-comparison.svg" alt="Diagram comparing the bit layout of UUID v4, which is fully random, against UUID v7, which starts with a 48-bit timestamp followed by random bits" width="800" height="420" loading="lazy" />
  <figcaption>UUID v4 is random throughout; UUID v7 front-loads a timestamp, leaving the rest random.</figcaption>
</figure>

**UUID v4** sets aside a few fixed bits to mark the version and variant, and fills essentially everything else, 122 bits, with random data. There's no structure to exploit and no information encoded beyond "this is a version 4 UUID."

**UUID v7** starts with a 48-bit Unix timestamp in milliseconds, taking up the first part of the value, followed by random bits for the rest. Because the timestamp comes first, sorting UUID v7 values as plain strings sorts them in roughly chronological order too, something that's simply not possible with v4's fully random layout.

## Why This Matters for Database Primary Keys

The structural difference isn't just trivia, it directly affects how a database's index behaves as rows are inserted. Most relational databases store primary key indexes as B-trees, which perform best when new values are inserted at or near the end, similar to appending to a sorted list.

<figure>
  <img src="/guides/uuid-v4-vs-v7/index-insert-pattern.svg" alt="Diagram comparing random UUID v4 inserts scattering across a database index causing fragmentation against UUID v7 inserts landing sequentially at the end" width="800" height="420" loading="lazy" />
  <figcaption>Random v4 inserts scatter across the index; time-ordered v7 inserts mostly append at the end.</figcaption>
</figure>

A random UUID v4 used as a primary key inserts at an essentially random position in that index every single time, since there's no relationship between one value and the next. At small scale this is invisible, but as a table grows, this causes page splits and index fragmentation, which slows down writes and bloats the index on disk. UUID v7, because its timestamp prefix keeps values roughly increasing, mostly inserts near the end of the index instead, behaving much closer to an auto-incrementing integer ID while still keeping the collision resistance and decentralized generation that made UUIDs appealing over integers in the first place.

## When v4's Randomness Is Actually the Right Choice

None of this makes v4 obsolete. For identifiers where hiding creation time matters, like password reset tokens, API keys, or anything where an attacker guessing "this was likely issued around the same time as that other one" would be useful information, v4's lack of any embedded timestamp is a genuine security property, not just an omission.

v4 is also the simpler default when the value in question isn't a high-volume database primary key at all, for example a one-off identifier generated client-side for a UI element, where index performance never comes into play and there's no reason to reach for anything more specialized.

## Quick Comparison

| | UUID v4 | UUID v7 |
|---|---|---|
| Structure | Fully random | Timestamp prefix + random |
| Sortable by creation time | No | Yes, roughly |
| Leaks creation time | No | Yes |
| Database index performance at scale | Degrades with fragmentation | Stays efficient, mostly sequential |
| Best for | Security tokens, non-indexed identifiers | Primary keys, event logs, sortable records |

## Generating Either Version

Both versions follow specific bit-layout rules that are easy to get subtly wrong by hand, particularly the version and variant bits that mark a UUID as v4 or v7 in the first place. The [UUID Generator](/developer-tools/uuid-generator/) produces correctly formatted values for either version on demand, so there's no need to hand-roll the bit manipulation or accidentally generate a malformed identifier.

## The short version

UUID v4 and UUID v7 are both valid 128-bit UUIDs, but v4 is entirely random while v7 leads with a timestamp, making v7 values sort roughly in creation order. That ordering translates directly into database index performance: v4 as a primary key causes fragmentation from random inserts at scale, while v7 mostly appends, staying efficient. Reach for v7 on high-volume primary keys and sortable records; stick with v4 when hiding creation time matters, like security tokens, or when the value never touches a large indexed table in the first place.