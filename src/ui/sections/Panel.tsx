import { useEffect, useRef, type ReactNode } from 'react'
import type { Area } from '../../areas'
import { useRoom } from '../../state/store'
import { isNarrow, useFrame } from '../useScene'

/**
 * A content panel that stays attached to its object: a hairline runs from the
 * panel to the object's anchor and follows it as the camera settles and drifts.
 * Side panel on wide screens, bottom sheet on narrow ones.
 */
export function Panel({
  area,
  title,
  kicker,
  children,
  className = '',
}: {
  area: Area
  title: string
  kicker: string
  children: ReactNode
  className?: string
}) {
  const panelRef = useRef<HTMLElement>(null)
  const lineRef = useRef<SVGLineElement>(null)
  const dotRef = useRef<SVGCircleElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const moving = useRoom((s) => s.moving)

  useEffect(() => {
    if (!moving) headingRef.current?.focus({ preventScroll: true })
  }, [moving])

  useFrame((f, r) => {
    const panel = panelRef.current
    const line = lineRef.current
    const dot = dotRef.current
    if (!panel || !line || !dot) return
    const narrow = isNarrow(f)
    panel.dataset.layout = narrow ? 'sheet' : area.panel
    const [ax, ay] = r.project(area.anchor[0], area.anchor[1])
    const b = panel.getBoundingClientRect()
    let sx: number
    let sy: number
    if (narrow) {
      sx = Math.min(Math.max(ax, b.left + 24), b.right - 24)
      sy = b.top
    } else if (area.panel === 'left') {
      sx = b.right
      sy = Math.min(Math.max(ay, b.top + 32), b.bottom - 32)
    } else {
      sx = b.left
      sy = Math.min(Math.max(ay, b.top + 32), b.bottom - 32)
    }
    line.setAttribute('x1', String(sx))
    line.setAttribute('y1', String(sy))
    line.setAttribute('x2', String(ax))
    line.setAttribute('y2', String(ay))
    dot.setAttribute('cx', String(ax))
    dot.setAttribute('cy', String(ay))
  })

  return (
    <>
      <svg className="tether" aria-hidden="true">
        <line ref={lineRef} />
        <circle ref={dotRef} r="3.5" />
      </svg>
      <section
        ref={panelRef}
        className={`panel ${className}`}
        data-layout={window.innerWidth < window.innerHeight ? 'sheet' : area.panel}
        aria-labelledby={`${area.id}-title`}
      >
        <p className="panel__kicker">{kicker}</p>
        <h2 id={`${area.id}-title`} ref={headingRef} tabIndex={-1}>
          {title}
        </h2>
        {children}
      </section>
    </>
  )
}
