import { worldToPixel, type Vec2, type Vec3 } from './space'
import type { View } from './view'

/**
 * Find the image pixel under a screen point by marching the view ray through the
 * depth field. The plate is a height field along overview rays, so a short march
 * plus bisection is exact enough and far cheaper than raycasting 100k triangles.
 *
 * ndc: -1..1, y up.
 */
export function pickPixel(
  view: View,
  aspect: number,
  ndcX: number,
  ndcY: number,
  depthAt: (px: number, py: number) => number,
): Vec2 | null {
  const halfH = view.halfW / aspect
  const dir: Vec3 = [view.cx + ndcX * view.halfW, view.cy + ndcY * halfH, -1]
  const at = (s: number): Vec3 => [view.eye[0] + dir[0] * s, view.eye[1] + dir[1] * s, view.eye[2] - s]
  // Negative while the ray point is still in front of the surface.
  const gap = (s: number): number => {
    const p = at(s)
    const [px, py] = worldToPixel(p)
    return -p[2] - depthAt(px, py)
  }

  let prev = 0.05
  let prevGap = gap(prev)
  for (let i = 1; i <= 64; i++) {
    const s = 0.05 * Math.pow(400, i / 64)
    const g = gap(s)
    if (prevGap < 0 && g >= 0) {
      let lo = prev
      let hi = s
      for (let k = 0; k < 14; k++) {
        const mid = (lo + hi) / 2
        if (gap(mid) < 0) lo = mid
        else hi = mid
      }
      return worldToPixel(at(hi))
    }
    prev = s
    prevGap = g
  }
  return null
}
