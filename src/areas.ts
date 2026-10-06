import type { Polygon } from './scene/polygon'
import type { Vec2 } from './scene/space'
import type { Framing } from './scene/view'

/**
 * The room map: which object leads where, and how the camera frames it.
 * All coordinates are pixels of docs/room-background.png (1448 x 1086).
 */

export type AreaId = 'projects' | 'about' | 'hobbies' | 'skills' | 'contact' | 'experiments'

export type PanelPlacement = 'left' | 'right' | 'over' | 'screen' | 'shelves'

export interface Area {
  id: AreaId
  route: `/${string}`
  label: string
  /** Short secondary line shown under the label. */
  hint: string
  /** Clickable outline of the object. */
  hotspot: Polygon
  /** Where the label's leader line and the section's tether attach. */
  anchor: Vec2
  /** Camera framing for wide (landscape) and narrow (portrait) viewports. */
  wide: Framing
  narrow: Framing
  /** How the section's content is laid out once the camera arrives. */
  panel: PanelPlacement
  /** Depth-of-field strength when focused (0 = none). */
  dof: number
  /** Light tint used for the hover lift. */
  tint: readonly [number, number, number]
}

/** The CRT's glass, clockwise from top-left. */
export const MONITOR_SCREEN: readonly [Vec2, Vec2, Vec2, Vec2] = [
  [123, 388],
  [212, 371],
  [221, 456],
  [134, 484],
]

export const AREAS: readonly Area[] = [
  {
    id: 'projects',
    route: '/projects',
    label: 'Projects',
    hint: 'Things I have built',
    hotspot: [
      [92, 276], [180, 268], [238, 345], [300, 420], [350, 440], [352, 560],
      [300, 600], [200, 575], [105, 530], [95, 400],
    ],
    anchor: [214, 380],
    wide: { box: [118, 366, 225, 487], dolly: 0.5, fill: 0.6, anchor: [0, -0.04] },
    narrow: { box: [123, 371, 221, 484], dolly: 0.5, fill: 1, anchor: [0, -0.08] },
    panel: 'screen',
    dof: 0.85,
    tint: [0.55, 0.9, 1.0],
  },
  {
    id: 'about',
    route: '/about',
    label: 'About me',
    hint: 'The human behind the code',
    hotspot: [
      [12, 700], [60, 672], [150, 665], [240, 760], [345, 800], [410, 830], [432, 880],
      [410, 960], [360, 1020], [240, 1045], [120, 985], [30, 905], [8, 800],
    ],
    anchor: [300, 790],
    wide: { box: [10, 662, 436, 1046], dolly: 0.28, fill: 0.88, anchor: [-0.48, 0.02] },
    narrow: { box: [10, 662, 436, 1046], dolly: 0.28, fill: 0.95, anchor: [0, -0.55] },
    panel: 'right',
    dof: 0.6,
    tint: [1.0, 0.72, 0.55],
  },
  {
    id: 'hobbies',
    route: '/hobbies',
    label: 'Spare time',
    hint: 'Music, games, the rest',
    hotspot: [
      [700, 588], [1060, 590], [1180, 565], [1215, 578], [1250, 640], [1245, 720], [1105, 742],
      [1098, 830], [1000, 832], [800, 815], [640, 792], [595, 760], [620, 700], [660, 645],
    ],
    anchor: [930, 640],
    wide: { box: [595, 560, 1252, 835], dolly: 0.3, fill: 0.72, anchor: [0.3, 0.22], lift: [0, 0.12, 0] },
    narrow: { box: [595, 560, 1252, 835], dolly: 0.3, fill: 0.98, anchor: [0, -0.5], lift: [0, 0.12, 0] },
    panel: 'left',
    dof: 0.55,
    tint: [1.0, 0.6, 0.5],
  },
  {
    id: 'skills',
    route: '/skills',
    label: 'Skills & tooling',
    hint: 'What is on the shelves',
    hotspot: [
      [1210, 330], [1290, 250], [1448, 170], [1448, 720], [1345, 700], [1290, 650],
      [1258, 600], [1255, 520], [1215, 470],
    ],
    anchor: [1290, 420],
    wide: { box: [1200, 240, 1448, 720], dolly: 0.16, fill: 0.9, anchor: [0.62, 0] },
    narrow: { box: [1200, 240, 1448, 720], dolly: 0.16, fill: 0.8, anchor: [0.35, -0.3] },
    panel: 'shelves',
    dof: 0.5,
    tint: [1.0, 0.8, 0.5],
  },
  {
    id: 'contact',
    route: '/contact',
    label: 'Contact',
    hint: 'Out there, somewhere',
    hotspot: [
      [332, 100], [420, 68], [590, 62], [1385, 8], [1383, 240], [1290, 300], [1235, 380],
      [1195, 505], [1090, 545], [1060, 585], [700, 545], [545, 520], [440, 470], [385, 420], [345, 300],
    ],
    anchor: [760, 300],
    wide: { box: [420, 90, 1300, 520], dolly: 0.22, fill: 0.98, anchor: [0, 0] },
    narrow: { box: [560, 120, 1060, 520], dolly: 0.22, fill: 0.98, anchor: [0, 0] },
    panel: 'over',
    dof: 0.9,
    tint: [0.6, 0.85, 1.0],
  },
  {
    id: 'experiments',
    route: '/experiments',
    label: 'Experiments',
    hint: 'Odd ideas, honest results',
    hotspot: [
      [515, 545], [560, 528], [640, 535], [700, 540], [700, 588], [660, 645], [560, 652], [510, 615],
    ],
    anchor: [600, 560],
    wide: { box: [505, 525, 705, 655], dolly: 0.25, fill: 0.4, anchor: [-0.42, 0.08] },
    narrow: { box: [505, 525, 705, 655], dolly: 0.25, fill: 0.9, anchor: [0, -0.5] },
    panel: 'right',
    dof: 0.7,
    tint: [0.7, 0.75, 1.0],
  },
]

/** Hit-testing order: small things first, the window last since it surrounds the lamp. */
export const HIT_ORDER: readonly AreaId[] = ['projects', 'about', 'experiments', 'hobbies', 'skills', 'contact']

export function areaById(id: AreaId): Area {
  const area = AREAS.find((a) => a.id === id)
  if (!area) throw new Error(`Unknown area ${id}`)
  return area
}

/** Easter-egg objects: clickable, but not sections. */
export const LAMP: Polygon = [[842, 22], [905, 5], [940, 40], [925, 95], [880, 102], [848, 80]]
export const LAMP_ANCHOR: Vec2 = [884, 62]
export const TABLET: Polygon = [[1118, 770], [1182, 766], [1194, 802], [1128, 810]]
export const TABLET_ANCHOR: Vec2 = [1155, 785]

/** Screens that get a gentle glow pulse. */
export const SCREENS: readonly Polygon[] = [
  MONITOR_SCREEN,
  [[127, 287], [172, 284], [174, 336], [128, 338]],
  TABLET,
]

/** Shelf spots the skill clusters hang from. */
export const SHELF_SPOTS: readonly Vec2[] = [
  [1300, 330],
  [1290, 470],
  [1300, 610],
]
