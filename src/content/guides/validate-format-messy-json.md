---
title: "How to Validate and Format Messy JSON"
description: "The most common reasons JSON.parse throws an error, how to spot them by eye, and how to turn a cramped or broken JSON blob into something readable."
metaTitle: "How to Validate and Format Messy JSON"
metaDescription: "Learn how to find and fix common JSON syntax errors like trailing commas and unquoted keys, and how to pretty-print or minify JSON for different needs."
image: "/guides/validate-format-messy-json/hero.svg"
imageAlt: "A cramped, error-highlighted blob of JSON transforming into clean, indented, valid JSON"
publishDate: 2026-08-14
category: "developer-tools"
relatedTools:
  - "json-formatter-validator"
  - "uuid-generator"
  - "hash-generator"
faqs:
  - question: "Why does JSON.parse fail on something that looks like valid JavaScript?"
    answer: "JSON is a stricter subset of JavaScript object syntax, not the same thing. JavaScript object literals allow single quotes, unquoted keys, trailing commas, and comments, none of which are valid in JSON. Code that was copy-pasted from a JavaScript file often fails JSON.parse for exactly this reason, even though it would run fine as actual JavaScript."
  - question: "What's the single most common JSON error?"
    answer: "A trailing comma after the last item in an object or array is probably the most frequent mistake, since it's easy to leave one in after deleting or reordering the last property. JSON has no tolerance for it at all, where JavaScript itself would silently accept the same trailing comma in an object literal."
  - question: "Can JSON have comments?"
    answer: "No. The JSON specification has no comment syntax whatsoever, neither // nor /* */ style, and a strict parser will reject them outright. If you need to document a JSON-like config file, either move to a format that supports comments, like JSON5 or YAML, or keep the explanation outside the file entirely."
  - question: "Does the order of keys in a JSON object matter?"
    answer: "For parsing and validity, no, JSON objects are technically unordered collections of key-value pairs. In practice, most parsers and formatters preserve the order keys were written in, and some code does rely on that order for readability or diffing purposes, but nothing in the JSON spec requires or guarantees it."
  - question: "What's the difference between minifying and pretty-printing JSON?"
    answer: "Minifying strips all unnecessary whitespace to produce the smallest possible file size, useful for data sent over a network. Pretty-printing adds consistent indentation and line breaks to make the structure easy for a human to read, useful for debugging or documentation. Both represent the exact same data, just formatted differently."
  - question: "Can duplicate keys exist in a JSON object?"
    answer: "The JSON spec doesn't explicitly forbid them, but it also doesn't define what should happen if they appear. In practice, most parsers silently keep only the last occurrence and discard earlier ones, which means a duplicate key is rarely a parse error, but it's almost always an accidental bug worth catching before it causes confusion."
---

JSON looks simple enough to write by hand, right up until a missing quote or a stray comma breaks the whole thing and the error message points at a character position instead of telling you what's actually wrong. This guide covers the handful of mistakes that account for nearly every JSON parsing failure, plus the difference between formatting JSON for humans and formatting it for machines.

<div style="background:#EEF2FF;border:1px solid #C7D2FE;border-radius:0.75rem;padding:1.25rem 1.5rem;margin:1.5rem 0;">
<strong style="color:#3730A3;">Key takeaways</strong>
<ul style="margin-top:0.5rem;margin-bottom:0;color:#3730A3;">
<li>JSON is a stricter subset of JavaScript object syntax, several things valid JS allows aren't valid JSON</li>
<li>Trailing commas, single quotes, unquoted keys, and comments are the most common causes of a failed parse</li>
<li>Minifying removes whitespace for smaller file size; pretty-printing adds it for readability, same data either way</li>
<li>Duplicate keys usually aren't a parse error, most parsers just silently keep the last one</li>
<li>A parser's error position often points near, not exactly at, the actual mistake</li>
</ul>
</div>

## The Four Mistakes That Cause Most JSON Errors

JSON borrows its look from JavaScript object and array literals, but the JSON specification itself is much stricter. These four differences account for the overwhelming majority of real-world parsing failures.

<figure>
  <img src="/guides/validate-format-messy-json/common-errors.svg" alt="Diagram showing four common invalid JSON patterns side by side with their valid corrected versions: trailing comma, single quotes, unquoted keys, and comments" width="800" height="420" loading="lazy" />
  <figcaption>Four patterns that are valid in JavaScript object literals but invalid in strict JSON.</figcaption>
</figure>

**Trailing commas.** `{"a": 1, "b": 2,}` fails because of the comma after `2`. JavaScript tolerates this in an object literal; JSON does not, at all.

**Single quotes.** `{'name': 'value'}` fails because JSON strings and keys must use double quotes exclusively. Single quotes are common in JavaScript source but aren't valid JSON syntax under any circumstance.

**Unquoted keys.** `{name: "value"}` fails because every key in a JSON object must be a quoted string, even when it would be a valid identifier on its own. JavaScript allows bare identifier keys; JSON requires the quotes.

**Comments.** `{"name": "value" /* note */}` fails because JSON has no comment syntax at all, neither `//` nor `/* */`. Anything resembling a comment will be treated as invalid, unexpected content by a strict parser.

## Why the Error Message Points at the Wrong Spot

A `JSON.parse` error like `Unexpected token } in JSON at position 47` names a character position, but that position is usually where the parser first noticed something was wrong, not necessarily where the actual mistake is. A trailing comma, for instance, often gets reported at the closing brace or bracket that follows it, since the parser was still expecting another value when it hit the comma and then found the closer instead.

This is one of the more frustrating parts of debugging JSON by hand, since fixing the character the error names doesn't always fix the problem, the actual issue is often a few characters earlier.

## Formatting for Humans vs. Formatting for Machines

Once JSON is valid, there are still two very different ways to format it, depending on who's going to read it next.

<figure>
  <img src="/guides/validate-format-messy-json/minify-vs-pretty.svg" alt="Diagram comparing a minified single-line JSON blob against the same data pretty-printed with indentation and line breaks" width="800" height="420" loading="lazy" />
  <figcaption>Minified JSON strips whitespace for size; pretty-printed JSON adds it back for readability.</figcaption>
</figure>

**Minified** JSON strips every unnecessary space, tab, and line break, producing the smallest possible byte count. This is what you want for JSON traveling over a network in an API response, where every extra byte adds up across thousands of requests, but it's nearly unreadable if you're trying to debug it by eye.

**Pretty-printed** JSON adds consistent indentation, typically two or four spaces per nesting level, and a line break after each property. This is what you want while developing, debugging, or documenting, at the cost of a noticeably larger file size that you'd never want to actually ship over the wire.

```javascript
// Pretty-print with 2-space indentation
JSON.stringify(data, null, 2);

// Minify (the default with no third argument)
JSON.stringify(data);
```

## Validating and Formatting Without Guessing by Eye

Manually scanning a large JSON blob for a single missing comma or stray quote is slow and error-prone, especially once nesting gets a few levels deep. The [JSON Formatter & Validator](/developer-tools/json-formatter-validator/) parses pasted JSON, points out exactly what's invalid and why in plain language rather than just a character offset, and can instantly toggle the same valid data between pretty-printed and minified output.

## The short version

Most JSON parsing failures trace back to one of four differences from JavaScript object syntax: trailing commas, single quotes, unquoted keys, or comments, none of which strict JSON permits. When a parser reports an error position, treat it as a starting point for investigation rather than the exact location of the mistake, since the real issue often sits a few characters earlier. Once JSON is valid, minify it for anything traveling over a network and pretty-print it for anything a human needs to read, the underlying data is identical either way.