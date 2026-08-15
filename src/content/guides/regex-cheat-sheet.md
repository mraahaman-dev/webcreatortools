---
title: "Regex Cheat Sheet: Common Patterns Explained and Tested"
description: "A quick-reference table of regex syntax, plus tested patterns for email, URL, phone, hex color, and IPv4 matching, with the gotchas that catch people most often."
metaTitle: "Regex Cheat Sheet: Common Patterns Explained and Tested"
metaDescription: "A regex cheat sheet covering anchors, character classes, and quantifiers, with tested patterns for email, URL, phone number, hex color, and IPv4 validation."
image: "/guides/regex-cheat-sheet/hero.svg"
imageAlt: "A regex pattern broken apart into labeled pieces showing what each symbol matches"
publishDate: 2026-08-14
category: "developer-tools"
relatedTools:
  - "regex-tester-builder"
  - "text-diff-checker"
  - "case-converter"
faqs:
  - question: "What's the difference between * and + in regex?"
    answer: "* matches zero or more of the preceding token, meaning it's satisfied even if that character never appears at all. + matches one or more, requiring at least a single occurrence. A common bug is using * where + was intended, which lets a pattern match an empty string where at least one character was actually required."
  - question: "Why does my regex match more than I expected?"
    answer: "This is almost always greedy quantifier behavior. By default, *, +, and {n,m} grab as much text as possible while still allowing the overall pattern to match, which can pull in far more than intended when there are multiple similar delimiters in the text. Adding a ? after the quantifier, like *?, makes it lazy, matching as little as possible instead."
  - question: "Do I need to escape every special character in regex?"
    answer: "Only the characters that have special meaning in the position you're using them, including . * + ? ( ) [ ] { } ^ $ | and the backslash itself. Escaping a character that isn't special in that context, like escaping a letter, generally does nothing harmful but isn't necessary either. Inside a character class (square brackets), fewer characters need escaping than outside one."
  - question: "Is it safe to use a regex to fully validate an email address?"
    answer: "Not perfectly. The actual email specification (RFC 5322) allows for a surprising range of valid-but-unusual addresses that a practical regex would need to be extremely complex to match correctly. Most real-world email regexes are a reasonable approximation that catches obvious typos, not a fully spec-compliant validator, and pairing regex validation with an actual confirmation email is the more reliable approach."
  - question: "What does the g flag do in a regex?"
    answer: "The g (global) flag tells the regex engine to find all matches in the input rather than stopping after the first one. Without it, methods like String.match() in JavaScript return only the first match; with it, they return every match found throughout the string."
  - question: "Why doesn't my anchored pattern match a multi-line string the way I expect?"
    answer: "By default, ^ and $ anchor to the very start and end of the entire input string, not the start and end of each line. To make them match at the start and end of every individual line within a multi-line string, add the m (multiline) flag, which changes what ^ and $ actually refer to."
---

Regex syntax is dense enough that even people who use it regularly keep a reference open. This is that reference: a quick table of what each symbol means, a set of tested patterns for the matching tasks that come up constantly, and the handful of gotchas, like greedy matching and unescaped special characters, that account for most regex bugs in practice.

<div style="background:#EEF2FF;border:1px solid #C7D2FE;border-radius:0.75rem;padding:1.25rem 1.5rem;margin:1.5rem 0;">
<strong style="color:#3730A3;">Key takeaways</strong>
<ul style="margin-top:0.5rem;margin-bottom:0;color:#3730A3;">
<li><code>*</code> means zero or more; <code>+</code> means one or more, a common source of bugs when mixed up</li>
<li>Quantifiers are greedy by default, matching as much as possible; adding <code>?</code> after one makes it lazy instead</li>
<li><code>^</code> and <code>$</code> anchor to the whole string by default, not each line, unless the <code>m</code> flag is set</li>
<li>A handful of characters need escaping outside a character class: <code>. * + ? ( ) [ ] { } ^ $ |</code> and the backslash itself</li>
<li>A regex email validator is a practical approximation, not a full RFC 5322 implementation, pair it with a confirmation email for real validation</li>
</ul>
</div>

## Syntax Quick Reference

<figure>
  <img src="/guides/regex-cheat-sheet/pattern-anatomy.svg" alt="Diagram labeling each part of an email-matching regex pattern, pointing out the character class, quantifier, and anchors" width="800" height="420" loading="lazy" />
  <figcaption>Every regex pattern is built from the same small set of building blocks, combined differently.</figcaption>
</figure>

| Symbol | Meaning |
|---|---|
| `.` | Any character except a line break |
| `\d` | Any digit, equivalent to `[0-9]` |
| `\w` | Any word character, letters, digits, and underscore |
| `\s` | Any whitespace character, space, tab, or line break |
| `^` | Start of the string (or line, with the `m` flag) |
| `$` | End of the string (or line, with the `m` flag) |
| `*` | Zero or more of the preceding token |
| `+` | One or more of the preceding token |
| `?` | Zero or one of the preceding token |
| `{n,m}` | Between n and m of the preceding token |
| `[abc]` | Any one character from this set |
| `[^abc]` | Any one character not in this set |
| `(...)` | A capturing group |
| `(?:...)` | A non-capturing group |
| `\|` | Alternation, matches either side |

## Tested Patterns for Common Matching Tasks

Each of these is a starting point that covers the common case, not a guaranteed-perfect validator for every edge case in its category.

| What it matches | Pattern |
|---|---|
| Email (practical) | `^[\w.+-]+@[\w-]+\.[a-zA-Z]{2,}$` |
| URL (http/https) | `^https?:\/\/[\w.-]+\.[a-zA-Z]{2,}(\/\S*)?$` |
| US phone number | `^\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$` |
| Hex color | `^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$` |
| IPv4 address | `^(\d{1,3}\.){3}\d{1,3}$` |
| Digits only | `^\d+$` |
| Whitespace-only string | `^\s*$` |

The IPv4 pattern above is intentionally simple, it correctly rejects things like letters, but it won't catch an out-of-range value like `999.999.999.999` since checking each segment stays under 256 requires a considerably longer pattern than most day-to-day use actually needs.

## The Greedy vs. Lazy Gotcha

By far the most common surprise in regex is a quantifier matching more text than intended. Quantifiers are greedy by default, they consume as much as possible while still letting the rest of the pattern succeed.

<figure>
  <img src="/guides/regex-cheat-sheet/greedy-vs-lazy.svg" alt="Diagram comparing a greedy quantifier matching from the first opening tag to the last closing tag against a lazy quantifier matching only the first tag pair" width="800" height="420" loading="lazy" />
  <figcaption>Greedy matching grabs as much as possible; lazy matching (with a trailing ?) grabs as little as possible.</figcaption>
</figure>

Given the text `<b>bold</b> and <i>italic</i>`, the pattern `<.+>` greedily matches from the very first `<` all the way to the very last `>`, swallowing both tags and everything between them. Adding a `?` to make it lazy, `<.+?>`, matches only `<b>`, stopping at the first possible closing point instead. Whenever a match seems to be pulling in far more text than expected, a greedy quantifier consuming too much is almost always the cause.

## Testing a Pattern Without Guessing

Writing regex correctly on the first try is rare even for people who use it daily, since small mistakes like a missing escape or a greedy quantifier are easy to miss just by reading the pattern. The [Regex Tester & Builder](/dev-tools/regex-tester-builder/) highlights matches live as you type, against your own sample text, so you can see immediately whether a pattern is too loose, too strict, or matching the wrong part of the string entirely.

## The short version

Regex is built from a small, reusable set of symbols, character classes like `\d` and `\w`, quantifiers like `*`, `+`, and `{n,m}`, and anchors like `^` and `$`, combined in different orders to describe a pattern. The patterns in the table above cover the matching tasks that come up most often, but treat them as practical starting points rather than exhaustive validators, especially for something like email where the real specification is far more permissive than any reasonable regex. When a match pulls in more text than expected, check for greedy quantifiers first, and test any pattern against real sample text before relying on it.