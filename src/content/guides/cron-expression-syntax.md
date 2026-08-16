---
title: "Cron Expression Syntax Explained (With Common Examples)"
description: "How to read the five fields of a cron expression, what the special characters actually mean, and a reference table of common scheduling patterns."
metaTitle: "Cron Expression Syntax Explained (With Common Examples)"
metaDescription: "Learn how cron expressions work field by field, including the *, comma, dash, and slash syntax, with a table of common scheduling examples."
image: "/guides/cron-expression-syntax/hero.svg"
imageAlt: "A cron expression broken apart into five labeled fields showing minute, hour, day, month, and weekday"
publishDate: 2026-08-14
category: "developer-tools"
relatedTools:
  - "cron-expression-parser"
  - "unix-timestamp-converter"
  - "json-formatter-validator"
faqs:
  - question: "How many fields does a standard cron expression have?"
    answer: "Five: minute, hour, day of month, month, and day of week, in that order. Some systems, like some versions of Vixie cron used on Linux, support a sixth optional seconds field at the front, but the classic five-field format is the one supported almost everywhere, including most CI/CD and cloud scheduler platforms."
  - question: "What does an asterisk mean in a cron field?"
    answer: "An asterisk means every possible value for that field, effectively no restriction. A cron expression of * * * * * runs every single minute, since every field is left wide open with no constraint at all."
  - question: "Why do some cron schedulers accept both 0 and 7 for Sunday?"
    answer: "The day-of-week field is defined as 0 through 6, with 0 traditionally meaning Sunday, but many implementations also accept 7 as an alias for Sunday for compatibility with other scheduling conventions. Not every parser supports the 7 alias though, so 0 is the safer, more portable choice when Sunday is what you mean."
  - question: "What's the difference between a comma and a dash in a cron field?"
    answer: "A comma lists specific individual values, like 1,15 meaning the 1st and 15th only. A dash defines an inclusive range, like 1-5 meaning every value from 1 through 5. The two can also combine, like 1-5,10 for a range plus one extra value."
  - question: "How does the slash (step) syntax work in cron?"
    answer: "A slash defines a step, or interval, usually combined with an asterisk or a range. */15 in the minute field means every 15 minutes, starting from 0. 10-30/5 means every 5 units within the 10 to 30 range specifically, not from the start of the whole field."
  - question: "Are @daily, @hourly, and similar shortcuts standard cron syntax?"
    answer: "They're a widely supported convenience extension, not part of the original five-field cron specification. @daily typically expands to 0 0 * * * and @hourly to 0 * * * *, but support for these shortcuts varies by platform, so it's worth checking whether your specific scheduler accepts them before relying on the shorthand."
---

Cron expressions pack a full recurring schedule into five terse fields, which makes them compact but genuinely hard to read at a glance until the pattern clicks. This guide breaks down each field, what the special characters actually do, and a reference table of the schedules that come up constantly, so you don't have to reverse-engineer one from scratch every time.

<div style="background:#EEF2FF;border:1px solid #C7D2FE;border-radius:0.75rem;padding:1.25rem 1.5rem;margin:1.5rem 0;">
<strong style="color:#3730A3;">Key takeaways</strong>
<ul style="margin-top:0.5rem;margin-bottom:0;color:#3730A3;">
<li>A standard cron expression has five fields, in order: minute, hour, day of month, month, day of week</li>
<li><code>*</code> means "every value" for that field; a comma lists specific values; a dash defines a range</li>
<li>A slash defines a step interval, like <code>*/15</code> for "every 15 units"</li>
<li>Day of week runs 0-6 (Sunday to Saturday), though many parsers also accept 7 as an alias for Sunday</li>
<li><code>@daily</code>, <code>@hourly</code>, and similar shortcuts are a common convenience extension, not part of the original five-field spec</li>
</ul>
</div>

## The Five Fields, in Order

Every standard cron expression follows the same fixed field order. Getting the order wrong is one of the most common mistakes, since a misplaced value can silently produce a valid-looking expression that runs on a completely different schedule than intended.

<figure>
  <img src="/guides/cron-expression-syntax/five-fields.svg" alt="Diagram labeling the five fields of a cron expression in order: minute, hour, day of month, month, and day of week" width="800" height="420" loading="lazy" />
  <figcaption>Field order is fixed: minute, hour, day of month, month, day of week.</figcaption>
</figure>

| Field | Allowed values |
|---|---|
| Minute | 0-59 |
| Hour | 0-23 |
| Day of month | 1-31 |
| Month | 1-12 |
| Day of week | 0-6 (0 = Sunday), or 1-7 depending on the implementation |

## The Special Characters

Four symbols do almost all the work in cron syntax, and combining them is what makes the format compact.

**`*` (asterisk)** — every possible value, no restriction at all in that field.

**`,` (comma)** — a list of specific values, for example `1,15` in the day-of-month field means only the 1st and the 15th.

**`-` (dash)** — an inclusive range, for example `9-17` in the hour field means every hour from 9am through 5pm.

**`/` (slash)** — a step interval, usually paired with `*` or a range. `*/15` in the minute field means every 15 minutes starting at 0; `9-17/2` means every 2 hours within the 9-to-17 range specifically.

<figure>
  <img src="/guides/cron-expression-syntax/step-syntax.svg" alt="Diagram showing */15 in the minute field highlighting which minutes it actually matches: 0, 15, 30, and 45" width="800" height="420" loading="lazy" />
  <figcaption>A step value like */15 selects every 15th unit starting from the field's minimum.</figcaption>
</figure>

## Common Cron Expressions Reference

| Schedule | Expression |
|---|---|
| Every minute | `* * * * *` |
| Every 5 minutes | `*/5 * * * *` |
| Every hour, on the hour | `0 * * * *` |
| Every day at midnight | `0 0 * * *` |
| Every day at 9:30am | `30 9 * * *` |
| Every weekday at 9am | `0 9 * * 1-5` |
| Every Monday at 9am | `0 9 * * 1` |
| First day of every month at midnight | `0 0 1 * *` |
| Every 6 hours | `0 */6 * * *` |
| Twice a day, 8am and 8pm | `0 8,20 * * *` |

## Convenience Shortcuts

Many, though not all, cron implementations support a handful of named shortcuts that expand to a standard five-field expression:

- `@yearly` or `@annually` → `0 0 1 1 *`
- `@monthly` → `0 0 1 * *`
- `@weekly` → `0 0 * * 0`
- `@daily` or `@midnight` → `0 0 * * *`
- `@hourly` → `0 * * * *`

These are a readability convenience layered on top of the standard fields, not a separate specification, and support for them varies by platform, so it's worth confirming your specific scheduler accepts the shorthand before relying on it in production.

## Building and Checking an Expression Without Guessing

Reading an unfamiliar cron expression correctly, or writing a new one without accidentally scheduling it for the wrong day, is easy to get subtly wrong by hand, especially once ranges and steps combine. The [Cron Expression Parser](/developer-tools/cron-expression-parser/) translates a pasted expression into a plain-English description of exactly when it runs, and includes a visual builder mode for constructing one field by field without memorizing the syntax.

## The short version

A cron expression is five fields in a fixed order, minute, hour, day of month, month, and day of week, built from four special characters: `*` for "every value," `,` for a list, `-` for a range, and `/` for a step interval. The reference table above covers the schedules that come up most often, and the named shortcuts like `@daily` are a convenience layer that not every platform supports. When in doubt about what an expression actually does, translate it rather than guess, since a single misplaced field can silently point at the wrong day entirely.