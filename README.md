# Offensive security blog — Jekyll, GitHub Pages ready

Dark "ink & ember" theme: deep indigo background, ember-orange / cyan accents,
Space Grotesk + JetBrains Mono. Built to run on GitHub Pages with zero build
step on your side (GitHub builds it for you).

## 1. Put it on GitHub

Create a repo named **exactly** `Overd0se9.github.io`, then push these
files to its `main` branch. GitHub Pages will build and serve it
automatically at `https://overd0se9.github.io`.

`_config.yml` is already set up for this repo (`title: overd0se`,
`github: Overd0se9`, `url: https://overd0se9.github.io`) — no changes
needed to go live. Just fill in `twitter`/`linkedin`/`email` if you want
those links in the footer.

## 2. Edit `_config.yml`

## 3. Write a post

Add a file to `_posts/` named `YYYY-MM-DD-slug.md`:

```yaml
---
layout: post
title: "Your title"
category: research   # research | cve | ctf | technique
tags: [tag-one, tag-two]
excerpt: "One or two sentences — used on the homepage card and in SEO."
# optional, shown in the post header if set:
cve: "CVE-2026-XXXXX"
platform: "Hack The Box"
difficulty: Medium   # Easy | Medium | Hard | Insane
---

Your markdown content here. Headings become the sidebar table of contents
automatically. Fenced code blocks get syntax highlighting for free.
```

Delete the three sample posts in `_posts/` once you have your own.

## 4. Run it locally (optional)

```bash
bundle install
bundle exec jekyll serve
```

Visit `http://localhost:4000`.

## Structure

```
_config.yml        site settings
_layouts/           default.html (shell), post.html (article template)
_posts/             your writing, one file per post
assets/css/style.css  the whole theme
assets/js/main.js     terminal intro, search/filter, table of contents
index.html          homepage: hero + post grid with filter & search
archive/index.html  full chronological list
about/index.md       about page — edit this
404.html
```

## Notes

- The homepage filter buttons map to `category:` in each post's front
  matter (`research`, `cve`, `ctf`, `technique`). Add a new category by
  adding a button in `index.html`'s `#filters` and a matching `.chip.c-x`
  / `.card.k-x` rule in `style.css` if you want it color-coded.
- Press `/` on the homepage to jump into search.
- RSS feed is generated automatically at `/feed.xml` via `jekyll-feed`.
