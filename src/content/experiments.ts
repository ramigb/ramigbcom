// Source: ramigb.com pages/side-projects.md and pages/cv.md.

export interface Experiment {
  name: string
  /** Honest one-line status, taken from the project's own write-up. */
  stamp: string
  about: string
  detail?: string
  link: string
}

export const experiments: Experiment[] = [
  {
    name: 'Progressive Decode',
    stamp: 'Negative result, documented',
    about:
      'Model evaluation prototype exploring progressive quantized-weight refinement, with a research gate that stopped further runtime development.',
    detail:
      '1,000 prefixes and 55,000 selector/budget observations. The tested design failed its research gate, so I documented it and stopped. No runtime speedup is claimed.',
    link: 'https://github.com/ramigb/prog-decoding-research',
  },
  {
    name: 'HamadaBlog',
    stamp: 'Published without human review',
    about:
      'Autonomous AI writing experiment where an agent chose topics, wrote posts, and published on an hourly schedule without human review.',
    link: 'https://github.com/ramigb/HamadaBlog',
  },
]
