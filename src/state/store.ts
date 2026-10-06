import { useSyncExternalStore } from 'react'
import type { AreaId } from '../areas'

export interface RoomState {
  /** The area the camera is at (or heading to); null = overview. */
  area: AreaId | null
  /** True while the camera is travelling. Interactions are locked. */
  moving: boolean
  hovered: AreaId | null
  /** Has any area been opened this session. */
  visited: boolean
  ready: boolean
  lamp: boolean
  rain: boolean
  sound: boolean
  /** A short-lived line of text near an object (easter eggs). */
  toast: { text: string; at: readonly [number, number]; key: number } | null
}

type Listener = () => void

function createStore<T>(initial: T) {
  let state = initial
  const listeners = new Set<Listener>()
  return {
    get: () => state,
    set(patch: Partial<T>) {
      state = { ...state, ...patch }
      for (const l of listeners) l()
    },
    subscribe(l: Listener) {
      listeners.add(l)
      return () => listeners.delete(l)
    },
  }
}

export const room = createStore<RoomState>({
  area: null,
  moving: false,
  hovered: null,
  visited: false,
  ready: false,
  lamp: true,
  rain: true,
  sound: false,
  toast: null,
})

export function useRoom<S>(select: (s: RoomState) => S): S {
  return useSyncExternalStore(room.subscribe, () => select(room.get()))
}
