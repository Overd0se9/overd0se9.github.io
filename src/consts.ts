export const SITE = {
  title: 'overd0se',
  tagline: 'Offensive security research, CVE disclosures & CTF write-ups',
  description:
    'Red team techniques, vulnerability research, CVE root-cause analysis and CTF solutions by Overd0se9.',
  author: 'Overd0se9',
  url: 'https://overd0se9.github.io',
  github: 'https://github.com/Overd0se9',
  email: '',
} as const;

export const CATEGORIES = {
  research: { label: 'Research', blurb: 'Deep dives into bug classes and attack surface' },
  cve: { label: 'CVEs', blurb: 'Disclosures, root-cause analysis and patches' },
  ctf: { label: 'CTF', blurb: 'Write-ups with the dead ends left in' },
  technique: { label: 'Techniques', blurb: 'Tradecraft, tooling and detection notes' },
} as const;

export type Category = keyof typeof CATEGORIES;
