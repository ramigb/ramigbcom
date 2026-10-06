import { useEffect, useEffectEvent, useSyncExternalStore } from 'react'
import type { FrameInfo, RoomRenderer } from '../scene/RoomRenderer'

/** The live renderer, published by RoomStage once WebGL is up. */
let current: RoomRenderer | null = null
const listeners = new Set<() => void>()

export function publishRenderer(r: RoomRenderer | null): void {
  current = r
  for (const l of listeners) l()
}

export function useRendererInstance(): RoomRenderer | null {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l)
      return () => listeners.delete(l)
    },
    () => current,
  )
}

/**
 * Run a callback after every rendered frame. Used to pin DOM elements to points
 * in the room without re-rendering React.
 */
export function useFrame(cb: (f: FrameInfo, r: RoomRenderer) => void): void {
  const renderer = useRendererInstance()
  const onFrame = useEffectEvent(cb)
  useEffect(() => {
    if (!renderer) return
    return renderer.onFrame((f) => onFrame(f, renderer))
  }, [renderer])
}

export const isNarrow = (f: { width: number; height: number }) => f.width / f.height < 1
