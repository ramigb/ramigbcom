// Source: ramigb.com pages/side-projects.md, with stack notes from pages/cv.md.

export interface Project {
  /** Terminal-friendly id: `open <slug>`. */
  slug: string
  name: string
  focus: string
  about: string
  stack?: string
  link: string
}

export const projects: Project[] = [
  {
    slug: 'epoptes',
    name: 'Epoptes',
    focus: 'Coding agent harness',
    about:
      'TypeScript harness for long-running Claude Code and Codex sessions, with fresh-context cycles, live steering, completion checks, and token reporting.',
    stack: 'Agent orchestration / TypeScript / Claude Code / Codex',
    link: 'https://github.com/ramigb/epoptes',
  },
  {
    slug: 'outpost',
    name: 'Outpost',
    focus: 'AI deployment',
    about:
      'AI-first deployment harness that plans, provisions, deploys, and rolls back apps on infrastructure you control.',
    stack: 'AI deployment workflows / TypeScript / Infrastructure tooling',
    link: 'https://github.com/ramigb/outpost',
  },
  {
    slug: 'smolbro',
    name: 'smolBro',
    focus: 'Local-first AI assistant',
    about:
      'Local-first chat assistant and background agent with local models, SQLite-backed memory, scheduled jobs, and MCP tool support.',
    link: 'https://github.com/ramigb/smolBro',
  },
  {
    slug: 'semantic_skeletonizer',
    name: 'semantic_skeletonizer',
    focus: 'Semantic code analysis',
    about:
      'Rust-based MCP server that builds and maintains an in-memory semantic graph of a TypeScript/React codebase.',
    stack: 'MCP / Rust / TypeScript and React code intelligence',
    link: 'https://github.com/ramigb/semantic_skeletonizer',
  },
  {
    slug: 'promachos',
    name: 'Promachos',
    focus: 'Human-AI protocol',
    about: 'Protocol for more consistent, trackable, and collaborative work between humans and AI agents.',
    link: 'https://github.com/ramigb/promachos',
  },
  {
    slug: 'retroman',
    name: 'RetroMan',
    focus: 'Team retrospectives',
    about: 'Collaborative retrospectives platform for product development teams.',
    link: 'https://github.com/ramigb/RetroMan',
  },
]
