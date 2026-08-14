---
title: "What Is a JWT? How JSON Web Tokens Work (With Examples)"
description: "A plain-English breakdown of what's actually inside a JSON Web Token, how the three parts are built, and what the signature does and doesn't protect."
metaTitle: "What Is a JWT? How JSON Web Tokens Work (With Examples)"
metaDescription: "Learn how JWTs are structured, what header.payload.signature actually means, why JWTs are signed but not encrypted, and how servers verify them."
image: "/guides/what-is-jwt/hero.svg"
imageAlt: "A JWT string splitting apart into its header, payload, and signature sections"
publishDate: 2026-08-14
category: "developer-tools"
relatedTools:
  - "jwt-decoder"
  - "json-formatter-validator"
  - "hash-generator"
faqs:
  - question: "Is a JWT encrypted?"
    answer: "No, a standard JWT is signed, not encrypted. The header and payload are only base64url-encoded, which is trivially reversible by anyone, not a form of encryption. The signature proves the token hasn't been altered since it was issued, but it does nothing to hide the payload's contents from someone who intercepts the token."
  - question: "Can I put sensitive data like a password in a JWT payload?"
    answer: "No. Since the payload is just base64url-encoded and not encrypted, anyone holding the token, including the end user's own browser dev tools, can decode and read it instantly. Only put data in a JWT payload that's safe to be publicly readable, like a user ID or role, never passwords, secrets, or private personal data."
  - question: "What's the difference between a JWT's signature and a checksum?"
    answer: "A checksum only detects accidental corruption, and anyone can recompute one, including an attacker who modified the data. A JWT's signature is created with a secret key (or private key for asymmetric algorithms) that only the issuing server holds, so only that server can produce a signature that will verify correctly, which is what actually prevents tampering."
  - question: "Do JWTs expire automatically?"
    answer: "Not on their own. A JWT typically includes an exp claim stating when it should be considered expired, but nothing forces that expiration, it's just a value the verifying server is expected to check. A server that ignores the exp claim will happily accept an old token forever, so expiration is a convention enforced by the code that verifies the token, not a property of the token format itself."
  - question: "What happens if someone edits a JWT's payload without the secret key?"
    answer: "The signature will no longer match the modified payload, so a server correctly verifying the token will reject it. This is exactly what the signature is designed to catch, since re-signing the edited payload requires the same secret key used to create the original signature, which an attacker doesn't have."
  - question: "Why do JWTs use base64url instead of regular base64?"
    answer: "Regular base64 can include +, /, and = characters, which have special meaning in URLs and can cause problems if a JWT is passed as a URL parameter. base64url replaces those characters with URL-safe equivalents and typically omits padding, so the same token can be dropped directly into a URL, header, or cookie without extra escaping."
---

A JWT looks like a long, unreadable string of random characters, but it's actually three separate pieces of readable JSON stuck together with dots. Once you know how to split it apart, decoding one takes seconds, no library required. This guide walks through what each piece actually contains, why the whole thing is signed instead of encrypted, and where that distinction matters in practice.

<div style="background:#EEF2FF;border:1px solid #C7D2FE;border-radius:0.75rem;padding:1.25rem 1.5rem;margin:1.5rem 0;">
<strong style="color:#3730A3;">Key takeaways</strong>
<ul style="margin-top:0.5rem;margin-bottom:0;color:#3730A3;">
<li>A JWT is three base64url-encoded parts separated by dots: <code>header.payload.signature</code></li>
<li>The header and payload are only encoded, not encrypted, so anyone can read their contents</li>
<li>The signature proves the token wasn't tampered with; it doesn't hide anything</li>
<li>Never put passwords or private data in a JWT payload, treat it as publicly readable</li>
<li>Claims like <code>exp</code> (expiration) are just values a server chooses to check, not something the format enforces on its own</li>
</ul>
</div>

## The Three Parts of a JWT

Every JWT follows the same structure: three base64url-encoded segments joined by periods, `header.payload.signature`. Split on the dots and decode each segment, and you get three separate pieces of information.

<figure>
  <img src="/guides/what-is-jwt/jwt-structure.svg" alt="Diagram splitting a JWT string into its header, payload, and signature segments with their decoded contents shown" width="800" height="420" loading="lazy" />
  <figcaption>A JWT's three dot-separated segments decode into a header, a payload, and a signature.</figcaption>
</figure>

**Header** — a small JSON object naming the signing algorithm and token type, typically something like `{"alg":"HS256","typ":"JWT"}`. The verifying server reads this to know which algorithm to use when checking the signature.

**Payload** — the actual data, called claims, that the token is carrying. This might include a user ID, an expiration timestamp, or custom application data, for example `{"sub":"user_123","role":"editor","exp":1755043200}`.

**Signature** — a cryptographic value computed from the header, the payload, and a secret key the server holds. This is the part that makes the token trustworthy, and it's the only part of the three that can't simply be decoded back into something readable, since it's the output of a signing algorithm rather than encoded JSON.

## Signed, Not Encrypted: Why This Distinction Matters

The most common misunderstanding about JWTs is treating them like an opaque, secure container. They aren't. Base64url encoding is a reversible transformation, not encryption, meaning anyone with the token, including the browser it's stored in, can decode the header and payload instantly without any key at all.

<figure>
  <img src="/guides/what-is-jwt/signed-vs-encrypted.svg" alt="Diagram contrasting a signed JWT where the payload stays readable but tamper-evident against an encrypted token where the payload is hidden" width="800" height="420" loading="lazy" />
  <figcaption>Signing makes tampering detectable; it doesn't make the contents unreadable.</figcaption>
</figure>

What the signature protects against is modification, not exposure. If someone intercepts a JWT and changes the payload, for example editing `"role":"editor"` to `"role":"admin"`, the signature computed for the original payload will no longer match, and a properly implemented server will reject the token outright. But that same someone could always read the original `"role":"editor"` value in the first place, since it was never hidden to begin with.

This is why JWT payloads should only ever contain data that's safe to be public: user IDs, roles, or non-sensitive claims. If a payload genuinely needs to be hidden, that requires a different mechanism, JSON Web Encryption (JWE), which is a separate, less commonly used standard from the signed JWTs (technically JWS) covered here.

## How a Server Actually Verifies a Token

When a client sends a JWT back to a server, typically in an `Authorization: Bearer <token>` header, the server doesn't need to look anything up in a database to check whether the token is legitimate. It recomputes the signature itself:

1. Split the token on its two dots into header, payload, and signature.
2. Take the original header and payload, and run them through the same signing algorithm named in the header, using the server's own secret key.
3. Compare that freshly computed signature to the signature that came with the token.
4. If they match, the token hasn't been altered since it was issued. If they don't, reject it.

This is what makes JWTs useful for stateless authentication: the server doesn't need to store session state anywhere, the token itself carries everything needed to verify it, as long as the server still holds the same secret key that created it.

## Common Claims You'll See in a Payload

A handful of standard claim names show up across most JWTs, though none of them are strictly required by the format itself:

- `sub` — subject, usually the user ID the token represents
- `iss` — issuer, identifying which service created the token
- `exp` — expiration time, as a Unix timestamp
- `iat` — issued-at time, when the token was created
- `aud` — audience, which service or application the token is intended for

None of these are enforced automatically. A server that never checks `exp` will accept an expired token indefinitely, since expiration is a value the verification logic is expected to compare against the current time, not a built-in expiry mechanism.

## Decoding a JWT Yourself

Manually base64url-decoding two segments and formatting the JSON by hand works, but it's tedious and easy to mess up, especially with padding differences between standard base64 and base64url. Pasting a token into the [JWT Decoder](/dev-tools/jwt-decoder/) splits it into header and payload instantly, formats both as readable JSON, and flags common issues like an already-expired `exp` claim, without ever sending the token anywhere since decoding happens entirely in the browser.

## The short version

A JWT is three base64url-encoded JSON objects, header, payload, and signature, joined by dots. The header and payload are only encoded and fully readable by anyone holding the token, so they should never carry sensitive data. The signature is what actually matters for security, it proves the token hasn't been modified since a server with the right secret key issued it, but it does nothing to hide the payload's contents. Claims like `exp` are conventions a verifying server chooses to enforce, not guarantees the token format provides on its own.