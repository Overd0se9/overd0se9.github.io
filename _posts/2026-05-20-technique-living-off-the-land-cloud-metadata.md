---
layout: post
title: "Technique: pivoting through cloud metadata services in SSRF chains"
category: technique
tags: [ssrf, cloud, aws, imds, tradecraft]
excerpt: "A field checklist for turning a blind SSRF into credential theft across AWS, Azure and GCP metadata endpoints, and what it looks like from the defender's side."
---

## Why this still works

Server-side request forgery keeps landing on engagement after engagement
because metadata endpoints are, by design, reachable without authentication
from inside the host. If an application can be coerced into making an
outbound request on your behalf, the metadata service is usually the
highest-value target in reach.

## Endpoints worth memorizing

```text
AWS   http://169.254.169.254/latest/meta-data/iam/security-credentials/
Azure http://169.254.169.254/metadata/instance?api-version=2021-02-01
GCP   http://metadata.google.internal/computeMetadata/v1/
```

Azure and GCP both require a specific header on the request
(`Metadata: true` and `Metadata-Flavor: Google` respectively), which matters
when the SSRF only controls the URL and not the headers — that constraint
alone can rule a target in or out.

## From blind SSRF to credentials

1. Confirm out-of-band interaction with a request to a host you control.
2. Redirect to the metadata IP, watching for differences in response time
   or size that indicate the request landed internally.
3. Walk the IAM role name, then request temporary credentials for it.
4. Validate scope immediately with a low-noise call before doing anything
   that would show up in CloudTrail as unusual.

```bash
curl http://169.254.169.254/latest/meta-data/iam/security-credentials/
curl http://169.254.169.254/latest/meta-data/iam/security-credentials/<role-name>
```

## What defenders should actually do

- Enforce IMDSv2 on AWS; it requires a session token fetched via a `PUT`,
  which most naive SSRF primitives cannot replicate.
- Block the link-local range at the network layer for workloads that have
  no legitimate reason to reach it.
- Treat any outbound request feature (webhooks, URL previews, PDF
  renderers, image proxies) as a potential SSRF surface during design
  review, not just during testing.

## Takeaway

This is not a new technique, but it is still the fastest path from "the app
fetches a URL" to "I have cloud credentials," and it belongs in the first
five minutes of testing any feature that makes server-side HTTP requests.
