---
title: "Username enumeration via a timing side-channel in a login endpoint"
date: 2026-09-13
category: technique
excerpt: "A login endpoint returned the same generic error for valid and invalid accounts, yet still leaked whether a username existed — through the response time, not the response body."
tags: [appsec, authentication, username-enumeration, side-channel, penetration-testing]
---

Found something interesting during a recent assessment: username enumeration
through a timing side-channel.

## The setup

The login endpoint returned the same generic message for both valid and
invalid accounts:

```text
Invalid email or password
```

So there was no obvious username enumeration through the response itself — the
body and status code were identical either way. On paper, this is exactly how
you're supposed to handle it.

## The leak

The interesting part was the response *time*.

For an existing account, the application continued into the password
verification process before rejecting the request. For a non-existent account,
it rejected the request earlier — before ever reaching password verification.
That created a measurable difference in response times:

- **Existing user:** ~180–220 ms
- **Non-existing user:** ~40–70 ms

A single request isn't enough to draw a conclusion — normal network jitter
will swamp a one-shot measurement. But repeating the requests and comparing the
response-time *distributions* made the difference clear enough to reliably
distinguish valid accounts from invalid ones.

## Why it happens

Despite having a generic error message, the authentication flow was still
leaking whether a username existed — through its execution path rather than its
output. The expensive operation (password hashing / verification) only ran when
the account existed, and that cost showed up on the wire.

This is the first time I've seen username enumeration handled correctly at the
response level but exposed through the execution path instead. The response was
constant-message; the *work* was not constant-time.

## The fix

Make the execution path uniform regardless of whether the account exists:

- Always perform a password-verification step — even for non-existent users,
  hash the supplied password against a dummy/decoy hash so the expensive work
  happens either way.
- Favor constant-time comparison routines in the authentication path.
- Don't let early-return branches (account-not-found) skip the costly work that
  the account-found branch performs.

Generic error messages are necessary, but they are not sufficient. If the
amount of work differs between the two cases, the timing *is* the oracle.
