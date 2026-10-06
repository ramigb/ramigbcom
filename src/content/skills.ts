// Source: ramigb.com pages/cv.md, "Core expertise".

export interface SkillGroup {
  title: string
  items: string[]
}

export const skillGroups: SkillGroup[] = [
  {
    title: 'Applied AI',
    items: ['Agentic coding', 'LLM evaluation', 'MCP', 'Local models', 'RAG', 'Developer automation', 'Team enablement'],
  },
  {
    title: 'Engineering',
    items: [
      'TypeScript',
      'JavaScript',
      'React',
      'Next.js',
      'Node.js',
      'GraphQL',
      'SQLite',
      'AWS',
      'Smart TV (Tizen, webOS, Chromecast)',
      'Python',
      'Rust',
    ],
  },
  {
    title: 'Leadership',
    items: ['Technical direction', 'Hands-on architecture', 'Cross-functional delivery', 'Startup leadership'],
  },
]
