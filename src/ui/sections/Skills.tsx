import { useEffect, useRef, useSyncExternalStore } from 'react'
import { SHELF_SPOTS, type Area } from '../../areas'
import { skillGroups } from '../../content/skills'
import { useRoom } from '../../state/store'
import { useFrame } from '../useScene'
import { Panel } from './Panel'

const portrait = window.matchMedia('(max-aspect-ratio: 1/1)')
const subscribePortrait = (cb: () => void) => {
  portrait.addEventListener('change', cb)
  return () => portrait.removeEventListener('change', cb)
}

/** Wide screens: each skill group hangs off a shelf. Narrow: a regular sheet. */
export function Skills({ area }: { area: Area }) {
  const narrow = useSyncExternalStore(subscribePortrait, () => portrait.matches)
  if (narrow) {
    return (
      <Panel area={area} kicker="On the shelves" title="Skills & tooling">
        {skillGroups.map((g) => (
          <div className="panel__block" key={g.title}>
            <h3>{g.title}</h3>
            <ul className="tags">
              {g.items.map((i) => (
                <li key={i}>{i}</li>
              ))}
            </ul>
          </div>
        ))}
      </Panel>
    )
  }
  return <ShelfTags />
}

function ShelfTags() {
  const groupRefs = useRef<(HTMLDivElement | null)[]>([])
  const lineRefs = useRef<(SVGLineElement | null)[]>([])
  const headingRef = useRef<HTMLHeadingElement>(null)
  const moving = useRoom((s) => s.moving)

  useEffect(() => {
    if (!moving) headingRef.current?.focus({ preventScroll: true })
  }, [moving])

  useFrame((_f, r) => {
    SHELF_SPOTS.forEach((spot, i) => {
      const el = groupRefs.current[i]
      const line = lineRefs.current[i]
      if (!el || !line) return
      const [x, y] = r.project(spot[0], spot[1])
      // The group sits to the left of its shelf spot, vertically centered on it.
      el.style.transform = `translate3d(${x - 56}px, ${y}px, 0) translate(-100%, -50%)`
      el.dataset.placed = 'true'
      line.setAttribute('x1', String(x - 56))
      line.setAttribute('y1', String(y))
      line.setAttribute('x2', String(x))
      line.setAttribute('y2', String(y))
    })
  })

  return (
    <section className="shelves" aria-labelledby="skills-title">
      <div className="shelves__head">
        <p className="panel__kicker">On the shelves</p>
        <h2 id="skills-title" ref={headingRef} tabIndex={-1}>
          Skills &amp; tooling
        </h2>
      </div>
      <svg className="tether" aria-hidden="true">
        {SHELF_SPOTS.map((_, i) => (
          <line key={i} ref={(el) => void (lineRefs.current[i] = el)} />
        ))}
      </svg>
      {skillGroups.map((g, i) => (
        <div
          className="shelf-group"
          key={g.title}
          ref={(el) => void (groupRefs.current[i] = el)}
          style={{ animationDelay: `${i * 90}ms` }}
        >
          <h3>{g.title}</h3>
          <ul className="tags">
            {g.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      ))}
    </section>
  )
}
