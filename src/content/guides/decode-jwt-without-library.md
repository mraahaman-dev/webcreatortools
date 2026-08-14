---
title: "How to Decode a JWT Without a Library"
description: "A step-by-step walkthrough of manually decoding a JWT's header and payload using nothing but the browser console, plus the padding gotcha that trips most people up."
metaTitle: "How to Decode a JWT Without a Library"
metaDescription: "Learn how to manually decode a JWT's header and payload with just atob() and the browser console, no npm package required, plus common decoding pitfalls."
image: "/guides/decode-jwt-without-library/hero.svg"
imageAlt: "A browser console decoding a JWT string into readable JSON"
publishDate: 2026-08-14
category: "developer-tools"
relatedTools:
  - "jwt-decoder"
  - "json-formatter-validator"
  - "hash-generator"
faqs:
  - question: "Do I need a library to decode a JWT?"
    answer: "No. Decoding a JWT's header and payload only requires base64url decoding and JSON.parse, both of which are built into every modern browser and Node.js. A library becomes useful for verifying a signature, since that requires implementing the actual signing algorithm, but reading the contents needs nothing extra."
  - question: "Why does atob() sometimes throw an error on a JWT segment?"
    answer: "atob() expects standard base64, but JWTs use base64url, which replaces the + and / characters with - and _ and often omits padding = characters entirely. Passing a raw JWT segment straight into atob() without converting those characters first, and re-adding any missing padding, will throw an InvalidCharacterError on many tokens."
  - question: "Can I decode a JWT's signature the same way as the header and payload?"
    answer: "No. The signature isn't encoded data, it's the raw output of a cryptographic hashing algorithm, so there's no decoding step that turns it back into anything readable. Trying to base64url-decode it will just produce meaningless bytes rather than JSON."
  - question: "Is it safe to decode a JWT from a production system in my browser console?"
    answer: "Decoding itself is safe and doesn't send the token anywhere, since atob() and JSON.parse both run entirely locally. What matters is what you do afterward, avoid pasting a real production token into a random third-party website, since some online decoders do transmit what you paste to a server rather than decoding client-side."
  - question: "What's the difference between decoding a JWT and verifying it?"
    answer: "Decoding just reveals what's inside the header and payload, it doesn't confirm the token is genuine. Verifying means recomputing the signature with the correct secret key and checking it matches, which proves the token wasn't tampered with. A JWT can be decoded by anyone, but only whoever holds the signing key can verify it with confidence."
  - question: "Why does my decoded payload show numbers instead of readable dates?"
    answer: "Claims like exp and iat are stored as Unix timestamps, a count of seconds since January 1, 1970, not as formatted date strings. Multiply the value by 1000 and pass it to JavaScript's Date constructor to convert it into a readable date, since Date expects milliseconds rather than seconds."
---

Every JWT decoder online is really just running two lines of logic under the hood: split the string on its dots, then base64url-decode two of the three pieces. You don't need a package installed or a website to do this, the browser's own developer console can decode a token in a few lines. This guide walks through exactly how, plus the one encoding quirk that breaks the naive approach.

<div style="background:#EEF2FF;border:1px solid #C7D2FE;border-radius:0.75rem;padding:1.25rem 1.5rem;margin:1.5rem 0;">
<strong style="color:#3730A3;">Key takeaways</strong>
<ul style="margin-top:0.5rem;margin-bottom:0;color:#3730A3;">
<li>Decoding a JWT only needs base64url decoding plus <code>JSON.parse</code>, both built into every browser</li>
<li>JWTs use base64url, not standard base64, so raw segments need character swaps before <code>atob()</code> will accept them</li>
<li>Only the header and payload can be decoded; the signature is a hash output with nothing to decode</li>
<li>Decoding proves nothing about authenticity, only verifying the signature with the correct key does that</li>
<li><code>exp</code> and <code>iat</code> claims are Unix timestamps in seconds, multiply by 1000 for JavaScript's <code>Date</code></li>
</ul>
</div>

## Step 1: Split the Token Into Its Three Segments

A JWT is one string with two dots in it. Splitting on those dots gives you the header, payload, and signature as three separate substrings:

```javascript
const token = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1c2VyXzEyMyIsImV4cCI6MTc1NTA0MzIwMH0.4f3a9c8b1e2d";
const [headerB64, payloadB64, signature] = token.split(".");
```

Only the first two pieces are worth decoding further. The third, the signature, is the raw output of a hashing algorithm, not encoded text, so there's nothing readable to reveal from it no matter what decoding is attempted.

## Step 2: Handle base64url, Not Standard base64

This is the step that trips up most manual attempts. JWTs are encoded with base64url, a variant that swaps two characters and typically drops padding, specifically to stay safe inside URLs. The browser's built-in `atob()` function expects standard base64, so feeding it a raw JWT segment directly often throws an error.

<figure>
  <img src="/guides/decode-jwt-without-library/base64url-conversion.svg" alt="Diagram showing base64url characters being converted to standard base64 by swapping dash and underscore and restoring padding" width="800" height="420" loading="lazy" />
  <figcaption>base64url swaps two characters and drops padding compared to standard base64; both need restoring before atob() works reliably.</figcaption>
</figure>

```javascript
function base64UrlDecode(str) {
  // Swap base64url's URL-safe characters back to standard base64
  let base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  // Restore padding, base64 length must be a multiple of 4
  while (base64.length % 4 !== 0) {
    base64 += "=";
  }
  return atob(base64);
}
```

Skipping this step is why pasting a JWT segment straight into `atob()` in the console frequently throws `InvalidCharacterError`, the input simply isn't valid standard base64 yet.

## Step 3: Parse the Decoded String as JSON

Once `base64UrlDecode` returns a plain string, it's just JSON text at that point, ready for `JSON.parse`:

```javascript
const header = JSON.parse(base64UrlDecode(headerB64));
const payload = JSON.parse(base64UrlDecode(payloadB64));

console.log(header);  // { alg: "HS256", typ: "JWT" }
console.log(payload); // { sub: "user_123", exp: 1755043200 }
```

<figure>
  <img src="/guides/decode-jwt-without-library/decode-pipeline.svg" alt="Diagram showing the full pipeline from a raw JWT segment through base64url conversion, atob decoding, and JSON.parse to a readable object" width="800" height="420" loading="lazy" />
  <figcaption>Three steps turn a raw token segment into a readable JavaScript object: convert, decode, parse.</figcaption>
</figure>

That's the entire process for reading a token's contents, four lines of plain JavaScript with nothing installed. Copy this snippet into any browser console, paste in a real token, and it decodes instantly.

## Turning exp and iat Into Readable Dates

Claims like `exp` and `iat` come back as raw numbers, Unix timestamps counted in seconds. To turn one into an actual date:

```javascript
const expiresAt = new Date(payload.exp * 1000);
console.log(expiresAt.toLocaleString());
```

The multiplication by 1000 matters because JavaScript's `Date` constructor expects milliseconds, while JWT timestamps are specified in seconds, forgetting this conversion produces a date decades off from what's intended.

## When You Just Want the Answer Without Typing Code

The console approach is genuinely useful for understanding what's happening, but typing it out every time you need to check a token gets old fast. The [JWT Decoder](/dev-tools/jwt-decoder/) runs this exact base64url-to-JSON logic behind a paste box, formats both the header and payload as readable JSON, converts `exp` and `iat` into actual dates automatically, and flags an already-expired token, all without the token ever leaving your browser.

## The short version

Decoding a JWT by hand takes four lines of JavaScript: split the token on its dots, convert the base64url segments back to standard base64 by swapping characters and restoring padding, run them through `atob()`, then `JSON.parse` the result. The signature can't be decoded the same way since it's a hash output, not encoded text. Remember that decoding only reveals what's inside a token, it says nothing about whether the token is genuine, that requires actually verifying the signature against the correct secret key.