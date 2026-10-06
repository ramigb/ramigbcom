import { LAMP_ANCHOR, TABLET_ANCHOR } from '../areas'
import type { Vec2 } from '../scene/space'
import { getRenderer } from './controller'
import { room } from './store'

const TABLET_MESSAGES = [
  '1 unread message: "go to sleep."',
  'Battery 3%. As usual.',
  'Reminder: water the plants. They are right there.',
  'Build passed. Nobody believes it.',
]

let tabletIndex = 0
let toastTimer = 0

export function showToast(text: string, at: Vec2 | null, ms = 3200): void {
  window.clearTimeout(toastTimer)
  room.set({ toast: { text, at: at ?? [-1, -1], key: Date.now() } })
  toastTimer = window.setTimeout(() => room.set({ toast: null }), ms)
}

export function toggleLamp(): void {
  const lamp = !room.get().lamp
  room.set({ lamp })
  getRenderer()?.setLamp(lamp)
  if (!lamp) showToast('Better. Now the city can see in.', LAMP_ANCHOR, 2600)
}

export function toggleRain(): void {
  const rain = !room.get().rain
  room.set({ rain })
  getRenderer()?.setRain(rain ? 1 : 0)
}

export function tapTablet(): void {
  showToast(TABLET_MESSAGES[tabletIndex % TABLET_MESSAGES.length] ?? '', TABLET_ANCHOR)
  tabletIndex++
}

const KONAMI = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a']
let konamiPos = 0

/** Feed every keydown; returns true when the code completes. */
export function feedKonami(key: string): boolean {
  konamiPos = key === KONAMI[konamiPos] ? konamiPos + 1 : key === KONAMI[0] ? 1 : 0
  if (konamiPos < KONAMI.length) return false
  konamiPos = 0
  room.set({ lamp: false, rain: true })
  getRenderer()?.setLamp(false)
  getRenderer()?.setRain(1.8)
  showToast('lofi mode. stay a while.', null, 3600)
  return true
}
