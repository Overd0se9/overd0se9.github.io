import { getCollection, type CollectionEntry } from 'astro:content';

/** Published posts, newest first. */
export async function getPosts() {
  return (await getCollection('posts', ({ data }) => !data.draft)).sort(
    (a, b) => b.data.date.getTime() - a.data.date.getTime()
  );
}

/** Case number for a post: its position in publishing order, oldest = 001. */
export async function caseNumber(post: CollectionEntry<'posts'>) {
  const oldestFirst = (await getPosts()).reverse();
  const i = oldestFirst.findIndex((p) => p.id === post.id);
  return String(i + 1).padStart(3, '0');
}

/** The "cause" line on a case file: CVE id, CTF platform, or the most specific tag. */
export function causeOf(post: CollectionEntry<'posts'>) {
  const { cve, platform, tags } = post.data;
  return cve ?? platform ?? tags.find((t) => !['ctf', 'appsec', 'penetration-testing'].includes(t)) ?? '—';
}

export const isoDate = (d: Date) => d.toISOString().slice(0, 10);
