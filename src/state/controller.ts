import { areaById, type AreaId } from '../areas'
import { overviewShot, type RoomRenderer, type ShotFn } from '../scene/RoomRenderer'
import { framedView } from '../scene/view'
import { areaFromPath, leaveArea, pathForArea, pushArea } from './router'
import { room } from './store'

/**
 * Navigation lives here: URL, store and camera stay in lockstep. Components call
 * openArea/closeArea; the browser's Back button arrives through popstate.
 */

export const TRAVEL_MS = 950

let renderer: RoomRenderer | null = null
let pan = 0
let reducedMotion = false

export function attachRenderer(r: RoomRenderer): () => void {
  renderer = r
  const off = r.onFrame((f) => {
    if (!f.moving && room.get().moving) room.set({ moving: false })
  })
  goTo(areaFromPath(window.location.pathname), true)
  const onPop = () => goTo(areaFromPath(window.location.pathname), false)
  window.addEventListener('popstate', onPop)
  return () => {
    off()
    window.removeEventListener('popstate', onPop)
    renderer = null
  }
}

export function getRenderer(): RoomRenderer | null {
  return renderer
}

export function setReducedMotion(reduced: boolean): void {
  reducedMotion = reduced
  renderer?.setReducedMotion(reduced)
}

export function openArea(id: AreaId): void {
  const current = room.get().area
  if (current === id) return
  if (current) window.history.replaceState({ fromRoom: true }, '', pathForArea(id))
  else pushArea(id)
  goTo(id, false)
}

export function closeArea(): void {
  if (!room.get().area) return
  if (!leaveArea()) goTo(null, false)
}

export function shotForArea(id: AreaId): ShotFn {
  const area = areaById(id)
  return (aspect) => {
    if (!renderer) throw new Error('renderer missing')
    const depth = renderer.depth
    const framing = aspect < 1 ? area.narrow : area.wide
    const [x0, y0, x1, y1] = framing.box
    return {
      view: framedView(framing, aspect, (x, y) => depth.depth(x, y)),
      dof: area.dof,
      focusDepth: depth.depth((x0 + x1) / 2, (y0 + y1) / 2),
      vignette: 0.6,
    }
  }
}

/** Narrow screens: look around the room by dragging. pan is -1..1. */
export function setPan(next: number): void {
  pan = Math.min(Math.max(next, -1), 1)
  if (!room.get().area) renderer?.setTarget((a) => overviewShot(a, pan), 0)
}

export function getPan(): number {
  return pan
}

function goTo(id: AreaId | null, instant: boolean): void {
  if (!renderer) return
  const duration = instant || reducedMotion ? 0 : TRAVEL_MS
  renderer.setHover(null)
  renderer.setParallaxScale(id ? 0.35 : 1)
  renderer.setTarget(id ? shotForArea(id) : (a) => overviewShot(a, pan), duration)
  room.set({ area: id, hovered: null, moving: duration > 0, ...(id ? { visited: true } : {}) })
}
