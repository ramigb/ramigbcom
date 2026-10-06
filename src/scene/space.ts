/**
 * The room's coordinate system.
 *
 * The reference image is treated as what an "overview" camera at the origin,
 * looking down -Z, sees through a virtual image plane at z = -1. A pixel (px, py)
 * of the image therefore defines a ray from the origin, and the depth map says how
 * far along that ray the surface is. Pushing every vertex of the plate along its
 * own ray keeps the overview projection identical to the source image while giving
 * the mesh real depth for every other camera position.
 */

export type Vec2 = readonly [number, number]
export type Vec3 = readonly [number, number, number]

export const IMAGE_W = 1448
export const IMAGE_H = 1086
export const IMAGE_ASPECT = IMAGE_W / IMAGE_H

/** Horizontal field of view the image is assumed to have been "shot" with. */
const OVERVIEW_HFOV = (70 * Math.PI) / 180

/** Size of the image on the z = -1 plane. */
export const PLANE_W = 2 * Math.tan(OVERVIEW_HFOV / 2)
export const PLANE_H = PLANE_W / IMAGE_ASPECT

/**
 * Depth Anything outputs relative inverse depth (disparity, 1 = nearest). This maps
 * it to scene units so the foreground sits ~1 unit away and the city ~11.
 */
const DEPTH_A = 0.048
const DEPTH_B = 0.952

export function disparityToDepth(disparity: number): number {
  return 1 / (DEPTH_A + DEPTH_B * disparity)
}

/** Image pixel -> position on the z = -1 plane. */
export function pixelToPlane(px: number, py: number): Vec2 {
  return [(px / IMAGE_W - 0.5) * PLANE_W, (0.5 - py / IMAGE_H) * PLANE_H]
}

/** Image pixel at a given depth -> world position. */
export function pixelToWorld(px: number, py: number, depth: number): Vec3 {
  const [x, y] = pixelToPlane(px, py)
  return [x * depth, y * depth, -depth]
}

/** World position -> image pixel as seen by the overview camera. */
export function worldToPixel(p: Vec3): Vec2 {
  const depth = -p[2]
  return [(p[0] / depth / PLANE_W + 0.5) * IMAGE_W, (0.5 - p[1] / depth / PLANE_H) * IMAGE_H]
}
