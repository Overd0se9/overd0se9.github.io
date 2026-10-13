---
title: "Write-up: Egypt and Tunisia National Cyber Security CTF 2019"
date: 2019-08-13
category: ctf
platform: "CyberTalents"
difficulty: "Qualification round"
excerpt: "My first CTF write-up — the qualification round of the Egypt & Tunisia National Cyber Security CTF 2019, covering packet forensics, Referer-header command injection, a User-Agent gate, and image steganography."
tags: [ctf, web-security, command-injection, forensics, steganography, cybertalents]
---

This is my first write-up, for the Egypt CTF qualification round. :)

## 1 — bflag (Digital Forensics)

**Level:** Easy · **Points:** 50

The challenge gives you a `.pcap` file — a capture of packets transferred
between two machines. After downloading it from the link in the challenge,
open it in Wireshark and set the display filter to `http` so you can see all
the HTTP packets. Search through the packets for the flag or anything useful,
and you'll find it:

```text
/f14g/analyze_packet_for_fun
```

## 2 — Referer Valley (Web Security)

**Level:** Medium · **Points:** 100

> We are at Referer Valley — know who you are and where you come from.

From the description you can tell it's about the `Referer` header. (The
`Referer` header lets a server identify where a visitor came from, and it may
use that for analytics, logging, or optimized caching.) If you set
`Referer: google.com` on the request, the response looks like the output of a
terminal command (`nslookup`) — so the value is being passed to a shell.
That means command injection. Let's try:

```http
Referer: 0x|ls -lah
```

The response reveals a directory called `hidden`. Pivot into it:

```http
Referer: 0x | ls hidden
```

That lists `flag.txt`. Read it:

```http
Referer: 0x | cat hidden/flag.txt
```

You can also just browse to
`http://35.232.137.174/referer-valley/hidden/flag.txt`. Either way the flag is:

```text
Syst3mFa1l3r
```

## 3 — Reward (General Information)

**Level:** Easy · **Points:** 50

> I receive a reward or get mentioned on a wall of fame when I find a
> vulnerability. I am participating in a ….. program? (Flag format: no spaces.)

**Answer:**

```text
bugbounty
```

## 4 — Secret Browser (Web Security)

**Level:** Medium · **Points:** 100

> The company employees use a special company browser to view the website
> content.

Opening the page shows: *"Welcome Guest, you are not using our company
browser."* Inspecting the page turned up nothing useful, so I re-read the
hint — it's about the `User-Agent`. I opened Burp Suite and intercepted the
request; there's the usual `User-Agent` header with my browser details. Trying
a list of different user-agent strings got me nowhere, until I noticed the
page's title bar carried the company name. So I set:

```http
User-Agent: PublicTradeCo
```

That returned: *"Welcome employee, the flag you are looking for is here
somewhere."* Intercepting the response, the flag was sitting in a custom
header:

```http
x-flag: W3lcomeC0mpanyUs3R
```

## 5 — sgtoe2 (Digital Forensics)

**Level:** Medium · **Points:** 100

The challenge is a `.jpg` image. I first tried
[StegOnline](https://georgeom.net/StegOnline/image) to look for anything
hidden in the image, but came up empty. So I used `stegextract` to pull any
embedded files out of it, which recovered two image files — opening one of
them revealed the flag.

## Wrap-up

Thanks for reading. A nice mix across the qualification round: packet
forensics, a classic header-based command injection, a User-Agent gate, and
some basic steganography.
