// Source: ramigb.com (pages/about.md, index.html) and pages/cv.md.

export const profile = {
  name: 'Rami GB',
  role: 'Technical lead / Applied AI',
  location: 'Stockholm, Sweden',
  tagline: 'Still curious, still building.',
}

export interface AboutBlock {
  title: string
  body: string
}

export const about: { lead: string; blocks: AboutBlock[] } = {
  lead: 'Technical lead and hands-on software engineer in Stockholm, currently at Leyra. Nearly two decades of building software, and still happiest when making something useful.',
  blocks: [
    {
      title: 'Roots',
      body: "The name is Middle Eastern. Jordanian on my father's side, Palestinian on my mother's side. Swedish by naturalization. World citizen by heart.",
    },
    {
      title: 'The engineering part',
      body: 'Full-stack roots, back when the web stack was the full stack. Moved to frontend over a decade ago thinking it would mean fewer headaches. That was optimistic. Web and Smart TV platforms since 2020.',
    },
    {
      title: 'What keeps me curious',
      body: 'Applied AI, agentic development, LLM evaluation, MCP and developer tooling. Most of my coding workflow is agent-driven. I build tools, test models, and care about what the evidence says, including when an experiment does not work.',
    },
  ],
}
