export interface ContactLink {
  label: string
  href: string
  kind: 'external' | 'page' | 'download'
}

export const contact = {
  heading: "Let's build something useful.",
  body: 'Based in Stockholm. Interested in remote or hybrid work in applied AI, developer tooling, and technical leadership.',
  links: [
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/ramigb/', kind: 'external' },
    { label: 'GitHub', href: 'https://github.com/ramigb', kind: 'external' },
    { label: 'CV', href: '/pages/cv.html', kind: 'page' },
    { label: 'CV PDF', href: '/pages/rami-gb-cv.pdf', kind: 'download' },
  ] satisfies ContactLink[],
}
