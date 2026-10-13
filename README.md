# overd0se9.github.io

Personal offensive-security blog — research, CVE disclosures, CTF write-ups and techniques.
Built with [Astro](https://astro.build), deployed to GitHub Pages via GitHub Actions.

## Local development

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # output to ./dist
npm run preview  # serve the built site locally
```

## Writing a post

Add a Markdown/MDX file under `src/content/posts/`. The filename becomes the URL slug
(`/posts/<filename>/`). Frontmatter schema:

```yaml
---
title: "Post title"
date: 2026-10-13
category: research   # research | cve | ctf | technique
excerpt: "One-line summary shown in listings and meta description."
tags: [tag-one, tag-two]
draft: false         # true = excluded from build
# optional, category-specific:
cve: "CVE-2026-1234" # for category: cve
platform: "Hack The Box"   # for category: ctf
difficulty: "Hard"         # for category: ctf
updated: 2026-10-20        # optional "last updated" date
---
```

## Deployment

Push to `main` → the `Deploy to GitHub Pages` workflow builds and publishes automatically.

> **One-time repo setting:** Settings → Pages → *Build and deployment* → **Source: GitHub Actions**.

## Structure

```
src/
  consts.ts            site config + categories
  content.config.ts    post collection schema
  content/posts/       the posts
  components/          Header, Footer, BaseHead, PostRow
  layouts/             Base, Post
  pages/               index, about, archive, tags, posts/[...slug], rss.xml, 404
  styles/global.css    the theme
```
