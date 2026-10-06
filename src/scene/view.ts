import { IMAGE_ASPECT, PLANE_H, PLANE_W, pixelToWorld, type Vec3 } from './space'

/**
 * A camera view. The camera never rotates: it always looks down -Z and is
 * described by its position plus an off-axis window expressed in tangent space
 * (x / distance, y / distance). That makes "frame this object at this aspect
 * ratio" plain 2D math, keeps the overview pixel-exact, and lets parallax be a
 * lateral eye shift that pivots around the focal plane.
 */
export interface View {
  eye: Vec3
  /** Window center in tangent space (y up). */
  cx: number
  cy: number
  /** Window half-width in tangent space; half-height is halfW / aspect. */
  halfW: number
  /** Distance to the plane that stays put under parallax. */
  focal: number
}

export interface Frustum {
  left: number
  right: number
  top: number
  bottom: number
}

/** How much of the image's vertical slack is cropped from the top in wide viewports. */
const OVERVIEW_TOP_BIAS = 0.15
/** Overview focal distance: around the bed, so the chair and city move in opposite directions. */
const OVERVIEW_FOCAL = 3.4

export function overviewView(aspect: number, pan = 0): View {
  if (aspect >= IMAGE_ASPECT) {
    const halfW = PLANE_W / 2
    const slack = PLANE_H / 2 - halfW / aspect
    // Positive cy moves the window up; the bias keeps the ceiling lamp in frame.
    return { eye: [0, 0, 0], cx: 0, cy: slack * (1 - 2 * OVERVIEW_TOP_BIAS), halfW, focal: OVERVIEW_FOCAL }
  }
  const halfW = (PLANE_H / 2) * aspect
  return { eye: [0, 0, 0], cx: panToCx(pan, aspect), cy: 0, halfW, focal: OVERVIEW_FOCAL }
}

/** Largest horizontal pan (in tangent units) available at a narrow aspect ratio. */
export function maxPan(aspect: number): number {
  return Math.max(0, PLANE_W / 2 - (PLANE_H / 2) * aspect)
}

/** pan is -1 (left edge) .. 1 (right edge). */
function panToCx(pan: number, aspect: number): number {
  return Math.min(Math.max(pan, -1), 1) * maxPan(aspect)
}

export interface Framing {
  /** Image-pixel box that should be framed: [x0, y0, x1, y1]. */
  box: readonly [number, number, number, number]
  /** Fraction of the way from the overview eye to the subject (0 = stay put). */
  dolly: number
  /** Fraction of the viewport the box should fill in its limiting dimension. */
  fill: number
  /** Where the box center lands, in NDC with y pointing down (-1..1). */
  anchor: readonly [number, number]
  /** Extra eye offset in world units, e.g. to look slightly down onto a bed. */
  lift?: Vec3
}

export function framedView(f: Framing, aspect: number, depthAt: (px: number, py: number) => number): View {
  const [x0, y0, x1, y1] = f.box
  const mx = (x0 + x1) / 2
  const my = (y0 + y1) / 2
  const depth = depthAt(mx, my)
  const subject = pixelToWorld(mx, my, depth)
  const lift = f.lift ?? [0, 0, 0]
  const eye: Vec3 = [subject[0] * f.dolly + lift[0], subject[1] * f.dolly + lift[1], subject[2] * f.dolly + lift[2]]
  const dist = depth + eye[2]

  // The box, placed on the subject's depth plane, in the new eye's tangent space.
  const a = pixelToWorld(x0, y0, depth)
  const b = pixelToWorld(x1, y1, depth)
  const tx0 = (a[0] - eye[0]) / dist
  const tx1 = (b[0] - eye[0]) / dist
  const ty0 = (b[1] - eye[1]) / dist
  const ty1 = (a[1] - eye[1]) / dist
  const boxHalfW = (tx1 - tx0) / 2
  const boxHalfH = (ty1 - ty0) / 2

  let halfW = Math.max(boxHalfW / f.fill, (boxHalfH * aspect) / f.fill)
  let cx = (tx0 + tx1) / 2 - f.anchor[0] * halfW
  let cy = (ty0 + ty1) / 2 + (f.anchor[1] * halfW) / aspect

  // Keep the window inside the plate at the subject's depth so the image edge never shows.
  const plateL = ((-PLANE_W / 2) * depth - eye[0]) / dist
  const plateR = ((PLANE_W / 2) * depth - eye[0]) / dist
  const plateB = ((-PLANE_H / 2) * depth - eye[1]) / dist
  const plateT = ((PLANE_H / 2) * depth - eye[1]) / dist
  halfW = Math.min(halfW, (plateR - plateL) / 2, ((plateT - plateB) / 2) * aspect)
  const halfH = halfW / aspect
  cx = clamp(cx, plateL + halfW, plateR - halfW)
  cy = clamp(cy, plateB + halfH, plateT - halfH)

  return { eye, cx, cy, halfW, focal: dist }
}

/** Shift the eye sideways while keeping the focal plane fixed on screen. */
export function withParallax(v: View, dx: number, dy: number): View {
  return {
    eye: [v.eye[0] + dx, v.eye[1] + dy, v.eye[2]],
    cx: v.cx - dx / v.focal,
    cy: v.cy - dy / v.focal,
    halfW: v.halfW,
    focal: v.focal,
  }
}

export function lerpView(a: View, b: View, t: number): View {
  return {
    eye: [lerp(a.eye[0], b.eye[0], t), lerp(a.eye[1], b.eye[1], t), lerp(a.eye[2], b.eye[2], t)],
    cx: lerp(a.cx, b.cx, t),
    cy: lerp(a.cy, b.cy, t),
    // Interpolating the zoom geometrically keeps the apparent speed even.
    halfW: Math.exp(lerp(Math.log(a.halfW), Math.log(b.halfW), t)),
    focal: lerp(a.focal, b.focal, t),
  }
}

export function frustum(v: View, aspect: number, near: number): Frustum {
  const halfH = v.halfW / aspect
  return {
    left: (v.cx - v.halfW) * near,
    right: (v.cx + v.halfW) * near,
    top: (v.cy + halfH) * near,
    bottom: (v.cy - halfH) * near,
  }
}

/** Project a world point to CSS pixels for a view. */
export function projectToScreen(v: View, p: Vec3, width: number, height: number): [number, number] {
  const dist = v.eye[2] - p[2]
  const tx = (p[0] - v.eye[0]) / dist
  const ty = (p[1] - v.eye[1]) / dist
  const halfH = v.halfW / (width / height)
  return [((tx - v.cx) / v.halfW + 1) * 0.5 * width, (1 - (ty - v.cy) / halfH) * 0.5 * height]
}

/** Inverse of the overview projection for an image pixel, for tests and sanity checks. */
export function overviewPixelToScreen(px: number, py: number, width: number, height: number): [number, number] {
  return projectToScreen(overviewView(width / height), pixelToWorld(px, py, 1), width, height)
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t
}

function clamp(x: number, lo: number, hi: number): number {
  return lo > hi ? (lo + hi) / 2 : Math.min(Math.max(x, lo), hi)
}

export function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
}
