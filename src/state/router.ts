import { AREAS, type AreaId } from '../areas'

export function areaFromPath(pathname: string): AreaId | null {
  const clean = pathname.replace(/\/index\.html$/, '/').replace(/\/+$/, '') || '/'
  return AREAS.find((a) => a.route === clean)?.id ?? null
}

export function pathForArea(id: AreaId | null): string {
  return id ? (AREAS.find((a) => a.id === id)?.route ?? '/') : '/'
}

/**
 * GitHub Pages serves 404.html for unknown paths; ours bounces to /?p=<path>.
 * Put the real path back before anything reads the location.
 */
export function restoreRedirectedPath(): void {
  const params = new URLSearchParams(window.location.search)
  const p = params.get('p')
  if (p && p.startsWith('/')) window.history.replaceState(null, '', p)
}

interface HistoryState {
  /** Set on entries we pushed, so "close" can go back instead of stacking entries. */
  fromRoom?: boolean
}

export function pushArea(id: AreaId): void {
  const state: HistoryState = { fromRoom: true }
  window.history.pushState(state, '', pathForArea(id))
}

/** Returns true if it navigated back (a popstate will follow). */
export function leaveArea(): boolean {
  const state = window.history.state as HistoryState | null
  if (state?.fromRoom) {
    window.history.back()
    return true
  }
  window.history.replaceState(null, '', '/')
  return false
}
