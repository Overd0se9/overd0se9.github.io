---
layout: post
title: "HTB Escapade: from a leaked SMB share to domain root"
category: ctf
platform: Hack The Box
difficulty: Hard
tags: [active-directory, kerberos, smb, adcs, windows]
excerpt: "An anonymous SMB share leaks a password policy script, which leads through Kerberos pre-auth abuse and a misconfigured certificate template straight to Domain Admin."
---

## Recon

Nothing fancy to start: a full TCP sweep turns up the usual domain controller
fingerprint — Kerberos, LDAP, SMB, and WinRM.

```bash
nmap -p- -sC -sV -T4 -oA escapade 10.10.11.202
```

An anonymous SMB session is allowed on a share named `Shares`, which is
unusual enough to pull on.

```bash
smbclient -N //10.10.11.202/Shares
```

Inside sits a PowerShell password-reset helper. It does not contain
credentials directly, but it references a service account and a naming
convention for temporary passwords — enough to build a targeted wordlist.

## Foothold: AS-REP roasting

With a short list of likely usernames derived from the script's comments,
Kerberos pre-authentication is disabled for one account. That is enough for
an AS-REP roast.

```bash
impacket-GetNPUsers escapade.htb/ -usersfile users.txt -no-pass -dc-ip 10.10.11.202
```

The recovered hash cracks quickly against the wordlist built from the SMB
script, giving a first foothold with WinRM access as a low-privileged user.

## Privilege escalation: ADCS misconfiguration

`certipy` enumerates the certificate authority and flags a vulnerable
template — ESC1, a template that allows a requester to supply a Subject
Alternative Name while still receiving client-authentication rights.

```bash
certipy find -u user@escapade.htb -p 'Summer2025!' -dc-ip 10.10.11.202 -vulnerable
```

A certificate can be requested on behalf of the domain administrator and
exchanged for a TGT:

```bash
certipy req -u user@escapade.htb -p 'Summer2025!' -ca escapade-CA -template VulnTemplate -upn administrator@escapade.htb
certipy auth -pfx administrator.pfx -dc-ip 10.10.11.202
```

## Root

The resulting TGT authenticates as Domain Administrator over WinRM,
completing the chain from an anonymous file share to full domain
compromise.

## Takeaways

- Anonymous shares are worth enumerating even when they look like
  housekeeping scripts — naming conventions leak more than people expect.
- AS-REP roasting remains effective wherever pre-auth is disabled for
  "legacy compatibility."
- ESC1-class ADCS misconfigurations are still common in the wild; auditing
  template permissions should be part of every AD review.
