---
title: "How to Write a Strong Password (and Why Passphrases Are Better)"
description: "What actually makes a password hard to crack, why length beats complexity, and why a random passphrase is often stronger and easier to remember than a traditional password."
metaTitle: "How to Write a Strong Password (and Why Passphrases Are Better)"
metaDescription: "Learn what actually makes a password resistant to cracking, why length matters more than special characters, and how random passphrases compare to traditional passwords."
image: "/guides/strong-password-vs-passphrase/hero.svg"
imageAlt: "A short complex password and a longer random passphrase shown side by side, with the passphrase marked as stronger"
publishDate: 2026-08-14
category: "developer-tools"
relatedTools:
  - "password-passphrase-generator"
  - "hash-generator"
  - "uuid-generator"
faqs:
  - question: "Is a passphrase actually more secure than a complex password?"
    answer: "Given equivalent randomness, yes, and usually by a wide margin, because a passphrase's extra length increases the number of possible combinations far more than adding a symbol or two to a short password does. A four-word random passphrase can have more possible combinations than an eight-character password stuffed with special characters, while also being easier for a person to actually remember and type."
  - question: "How long should a password or passphrase be?"
    answer: "Longer is better, with diminishing returns eventually, but a reasonable practical target is at least 12-16 characters for a traditional password, or 4-6 random words for a passphrase. The right length also depends on what's protecting the account, a financial or email account deserves more length than a throwaway forum login."
  - question: "Do I still need special characters if I use a passphrase?"
    answer: "Not necessarily. A passphrase's strength comes primarily from the randomness of word selection and the sheer number of words, not from stuffing symbols into it. Some sites still require a digit or symbol regardless, in which case adding one to a passphrase doesn't hurt, it just isn't where most of the security comes from."
  - question: "Why is reusing a password across sites dangerous even if the password itself is strong?"
    answer: "Because password strength only protects against guessing or brute-force attacks, it does nothing once a site's user database is stolen directly. If one service you use gets breached and passwords leak, attackers immediately try that same exact password on other popular sites, a technique called credential stuffing. A strong password reused everywhere is only as safe as the least secure site you used it on."
  - question: "Are password-generated strings actually random, or could someone predict them?"
    answer: "It depends entirely on how the generator produces randomness. A generator built on a cryptographically secure random number source, the kind built into modern browsers, produces output that isn't predictable even if someone knows the generator's code. A generator using a weak or predictable random source can produce output that's far easier to guess than it looks, which is why it matters what's actually generating the randomness, not just how the output looks."
  - question: "Should I still use a password manager if I switch to passphrases?"
    answer: "Yes. Passphrases make individual passwords easier to remember, but the core problem a password manager solves, using a different, high-quality password or passphrase for every single account, doesn't go away. A password manager remains the most practical way to actually follow that rule across dozens of accounts."
---

Most advice about "strong" passwords focuses on the wrong thing: a mandatory capital letter, a digit, one special character. Those rules feel secure but often produce passwords that are both hard for a person to remember and not particularly hard for a computer to guess. This guide covers what actually determines password strength, and why a random passphrase frequently beats a traditional password on both security and memorability at once.

<div style="background:#EEF2FF;border:1px solid #C7D2FE;border-radius:0.75rem;padding:1.25rem 1.5rem;margin:1.5rem 0;">
<strong style="color:#3730A3;">Key takeaways</strong>
<ul style="margin-top:0.5rem;margin-bottom:0;color:#3730A3;">
<li>Length matters more for security than complexity rules like requiring a symbol or a capital letter</li>
<li>A password's real strength is measured in entropy, roughly, how many guesses a computer would need to find it</li>
<li>A random passphrase of several unrelated words can have more entropy than a short complex password, while being far easier to remember</li>
<li>A strong password only protects against guessing, it does nothing against credential stuffing from a reused password leaked elsewhere</li>
<li>Randomness has to come from a genuinely unpredictable source to actually deliver the security a password's length suggests</li>
</ul>
</div>

## What "Strong" Actually Means: Entropy, Not Symbols

A password's resistance to being guessed is usually described in terms of entropy, a measure of how many possible combinations an attacker would have to try before finding it. Entropy grows with two things: how many characters the password could have been drawn from, and how long the password is.

<figure>
  <img src="/guides/strong-password-vs-passphrase/entropy-comparison.svg" alt="Bar chart comparing the approximate entropy of a short complex password against a longer random passphrase, showing the passphrase far ahead" width="800" height="420" loading="lazy" />
  <figcaption>Length increases entropy faster than adding symbol variety does.</figcaption>
</figure>

Here's the part that surprises people: length increases entropy exponentially, while adding a new category of character, say, requiring one symbol, only multiplies it by a small, fixed amount. An eight-character password using letters, digits, and symbols has a large but bounded set of possible combinations. A sixteen-character password using only lowercase letters has vastly more, simply because there are so many more character positions to guess correctly. Complexity rules exist for a reason, but they're a much smaller lever than length.

## Why "P@ssw0rd1!" Isn't Actually Strong

A password like `P@ssw0rd1!` technically satisfies most complexity requirements, an uppercase letter, a digit, a symbol, but it's a poor password in practice for a reason entropy alone doesn't capture: predictability. Attackers don't guess randomly, they guess in order of likelihood, starting with dictionary words, common substitutions (`@` for `a`, `0` for `o`), and known-leaked passwords from previous breaches. A password that looks complex but follows a common, guessable pattern gets tried early, not late.

True randomness matters as much as raw length. A password generated by actually rolling dice, or the equivalent electronic process, doesn't follow a pattern an attacker can anticipate, even a short one is meaningfully harder to guess than a longer password built from a predictable substitution pattern.

## Why Passphrases Win on Both Security and Memorability

A passphrase strings together several random, unrelated words, something like `correct horse battery staple`, rather than a single word or short string. Assuming each word is chosen randomly from a large word list, the entropy math works out in the passphrase's favor even though it's easier to remember and type than a traditional password of comparable strength.

<figure>
  <img src="/guides/strong-password-vs-passphrase/word-count-strength.svg" alt="Diagram showing how each additional random word added to a passphrase multiplies the number of possible combinations" width="800" height="420" loading="lazy" />
  <figcaption>Each additional random word multiplies a passphrase's possible combinations.</figcaption>
</figure>

The reason is straightforward: a large word list (say, a few thousand common words) gives each word position roughly as many possibilities as several random characters would, but a whole word is far easier for a human brain to store and recall than an equivalent string of random characters. Four to six random words, drawn from a genuinely large list and genuinely randomly selected, routinely outperforms an eight-to-twelve-character traditional password while being noticeably easier to type correctly and remember without writing down.

The key word throughout is *random*. A passphrase made of words you personally chose, like a memorable sentence or song lyric, loses almost all of this advantage, because a human-chosen phrase is far more predictable than a computer-selected one, even if it feels random to you.

## Strength Alone Doesn't Solve Reuse

A password or passphrase being individually strong only protects against one category of attack: someone trying to guess or brute-force it directly. It does nothing to protect an account if the password was reused somewhere else that later suffered a data breach. Once a password leaks from one site, attackers automatically try that exact same password against other popular services, a technique known as credential stuffing, and a strong-but-reused password is exactly as vulnerable to this as a weak one.

This is why password strength and password uniqueness are two separate problems that both need solving, typically with the help of a password manager that can store a different strong password or passphrase for every account without asking you to memorize any of them.

## Generating Passwords and Passphrases That Are Actually Random

Because true randomness is the ingredient that makes both approaches work, generating one by hand, picking "random-feeling" characters or words yourself, tends to produce something far less random than it feels. The [Password & Passphrase Generator](/developer-tools/password-passphrase-generator/) uses your browser's cryptographically secure random number generator to produce either a traditional password with adjustable length and character sets, or a passphrase built from a large random word list, with nothing generated or logged server-side. If you also need a random unique identifier for something other than a login, like a database key, the [UUID Generator](/developer-tools/uuid-generator/) covers that related but distinct use case.

## The short version

A password's real strength comes from length and genuine randomness, far more than from satisfying symbol-and-capital-letter rules, and a password that merely looks complex is often more predictable, and therefore weaker, than it appears. Random passphrases exploit this: stringing together several unrelated random words usually produces more entropy than a short complex password while being dramatically easier to remember and type. None of this replaces using a unique password or passphrase per account, since strength alone doesn't protect against a password leaked from an unrelated breach.