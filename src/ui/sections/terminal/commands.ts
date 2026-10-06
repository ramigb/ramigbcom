import type { AreaId } from '../../../areas'
import { contact } from '../../../content/links'
import { profile } from '../../../content/profile'
import { projects, type Project } from '../../../content/projects'

export type Line =
  | { kind: 'text'; text: string; tone?: 'dim' | 'warn' | 'ok' }
  | { kind: 'list' }
  | { kind: 'project'; project: Project }
  | { kind: 'links' }

export type Effect = { type: 'clear' } | { type: 'close' } | { type: 'goto'; area: AreaId } | { type: 'lamp' } | { type: 'rain' }

export interface Result {
  lines: Line[]
  effect?: Effect
}

const text = (t: string, tone?: 'dim' | 'warn' | 'ok'): Line => ({ kind: 'text', text: t, tone })

export const HELP: string[] = [
  'ls                 list projects',
  'open <name|n>      show a project',
  'whoami             who lives here',
  'contact            ways to reach me',
  'cv                 the long version',
  'clear              clear the screen',
  'exit               step back into the room',
]

export function findProject(arg: string): Project | undefined {
  const q = arg.trim().toLowerCase()
  if (!q) return undefined
  const n = Number(q)
  if (Number.isInteger(n) && n >= 1 && n <= projects.length) return projects[n - 1]
  return (
    projects.find((p) => p.slug === q || p.name.toLowerCase() === q) ??
    projects.find((p) => p.slug.startsWith(q) || p.name.toLowerCase().startsWith(q))
  )
}

export function run(input: string): Result {
  const raw = input.trim()
  if (!raw) return { lines: [] }
  const [cmdRaw = '', ...rest] = raw.split(/\s+/)
  const cmd = cmdRaw.toLowerCase()
  const arg = rest.join(' ')

  switch (cmd) {
    case 'help':
    case '?':
      return { lines: [...HELP.map((h) => text(h)), text('(there may be a few undocumented ones)', 'dim')] }
    case 'ls':
    case 'projects':
      if (rest.some((r) => r.startsWith('-') && r.includes('a')))
        return { lines: [text('.plans  .unfinished-ideas  .more-unfinished-ideas', 'dim'), { kind: 'list' }] }
      return { lines: [{ kind: 'list' }] }
    case 'open':
    case 'cat':
    case 'cd': {
      if (cmd === 'cd' && (arg === '..' || arg === '~' || arg === '')) return { lines: [], effect: { type: 'close' } }
      const p = findProject(arg)
      if (!p) return { lines: [text(`${cmd}: ${arg || '(nothing)'}: no such project. try \`ls\``, 'warn')] }
      return { lines: [{ kind: 'project', project: p }] }
    }
    case 'whoami':
      return { lines: [text(`${profile.name}. ${profile.role}. ${profile.location}.`), text(profile.tagline, 'dim')] }
    case 'about':
      return { lines: [text('the armchair knows more. walking over...', 'dim')], effect: { type: 'goto', area: 'about' } }
    case 'contact':
    case 'cv':
      return { lines: [{ kind: 'links' }] }
    case 'clear':
    case 'cls':
      return { lines: [], effect: { type: 'clear' } }
    case 'exit':
    case 'quit':
    case 'logout':
    case 'q':
      return { lines: [], effect: { type: 'close' } }
    case 'sudo':
      return { lines: [text(`rami is not in the sudoers file. This incident will be reported.`, 'warn')] }
    case 'rm':
      return { lines: [text('nice try.', 'warn')] }
    case 'matrix':
      return { lines: [text('No. The brief explicitly said no Matrix rain.', 'dim')] }
    case 'rain':
      return { lines: [text('toggling the weather.', 'ok')], effect: { type: 'rain' } }
    case 'lamp':
    case 'lights':
      return { lines: [text('click.', 'ok')], effect: { type: 'lamp' } }
    case 'coffee':
    case 'brew':
      return { lines: [text('418 I\'m a teapot.', 'warn')] }
    case 'hello':
    case 'hi':
    case 'hey':
      return { lines: [text('hi :) try `help`.')] }
    case 'vim':
    case 'vi':
    case 'nano':
      return { lines: [text('opening editor... just kidding. you would never get out.', 'dim')] }
    default:
      return { lines: [text(`command not found: ${cmdRaw}. try \`help\``, 'warn')] }
  }
}

export const CONTACT_LINKS = contact.links
