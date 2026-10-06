# ramigb.com — The Room

My own brief, inspired by `prompt.txt` and the two reference images.

## The idea in one line

The site is a single room at night. You don't navigate a website; you look around a
place and walk up to things.

The first reaction should be "what is this place?" and the second "oh, the room *is*
the site." Everything below serves that.

## Ground rules

1. **The overview is the picture.** At rest, the screen shows `room-background.png`
   pixel-for-pixel (cropped to fit). No permanent cards, no navbar, no hero copy.
2. **Movement means something.** Opening a section moves the camera through the
   room toward the object. Nothing slides in from the side because websites do that.
3. **UI is quiet.** It shows up when you reach for it: a hover, a focus, an arrival.
4. **Real content only.** Copy comes from the current ramigb.com. Nothing invented.
5. **Keyboard, screen reader and reduced motion work fully.** The room is a bonus
   layer on top of a usable site, not a barrier in front of it.

## How depth works (the 2.5D trick)

There is only one flat image, so:

- A depth map is estimated offline with Depth Anything V2 (`scripts/make_depth.py`)
  and post-processed (smoothed, far city clamped).
- The image is draped over a dense grid mesh. Each vertex is pushed **along the ray
  from the overview camera** to its estimated depth. From the overview position the
  mesh projects to exactly the original image; move the camera and real
  perspective appears: the chair slides against the rug, the city stays far away.
- The camera never rotates. It translates, and the projection is **off-axis**:
  each view is a window rectangle on a focal plane. That keeps framing exact,
  makes mouse parallax a lateral shift around the focal plane, and makes
  "fit this object on screen at this aspect ratio" simple, testable math.
- Mesh edges extend past the image with clamped sampling, so moving the camera
  never reveals a border.

## Map of the room

| Object                      | Route          | What happens                                                      |
| --------------------------- | -------------- | ----------------------------------------------------------------- |
| Workstation / CRT (left)    | `/projects`    | Dolly into the monitor; a working terminal boots *in the screen*. |
| Armchair (front left)       | `/about`       | Quiet, close framing of the chair; About sits beside it.          |
| Bed                         | `/hobbies`     | Warm framing of the bed; music, gaming, social media.             |
| Shelves / gear (right wall) | `/skills`      | Skills hang as tags on the shelves themselves.                    |
| City / window               | `/contact`     | Push toward the skyline; the room falls into blur; links float.   |
| Gadgets on the rug          | `/experiments` | Field notes on the two experiments that ended interestingly.     |

All of this is one config (`src/areas.ts`): id, route, label, hotspot polygon,
camera framing, panel placement. Content is in `src/content/*`, separate from
everything else.

Project split: **Projects** = Epoptes, Outpost, smolBro, semantic_skeletonizer,
Promachos, RetroMan. **Experiments** = Progressive Decode, HamadaBlog.

## Interaction

- **Discover.** Hovering an object gives it a soft localized light lift (shader
  mask) and a single small label with a hairline leader. One label at a time.
  The cursor becomes a ring. A one-time hint reads "Click an object to explore".
- **Enter.** Click/tap/Enter → interactions lock → ~900ms eased camera move,
  depth of field pulls focus to the object → content fades in, connected to the
  object by a hairline that tracks it.
- **Leave.** `Esc`, browser Back, or the small "← Room" control. Focus returns to
  the object you came from.
- **URLs.** Every area has a real route. Deep links settle straight into the area
  (no long fly-in). Back/forward behave like a normal site. On GitHub Pages, a
  `404.html` redirect restores clean URLs.
- **Rapid clicks.** Transitions are interruptible: a new target tweens from wherever
  the camera currently is. State can't get stuck mid-way.

## Sections

- **Projects terminal.** A DOM terminal is mapped onto the CRT's screen quad with
  a CSS `matrix3d` homography, so it sits in the glass while the camera moves.
  Phosphor teal and scanlines, matching the screen's existing glow. Browsable by
  click (project list → detail), and by typing: `help`, `ls`, `open <name>`,
  `whoami`, `cv`, `contact`, `clear`, `exit`, plus a few secrets.
- **About.** Roots, the engineering part, what keeps me curious, current role.
- **Hobbies.** Music since 2000, ARPGs, a careful relationship with social media.
- **Skills.** Three clusters (Applied AI, Engineering, Leadership) pinned to
  shelf levels. Plain tags, no percentages.
- **Experiments.** Two field notes, with honest status stamps taken from the copy
  ("negative result, documented", "published without human review").
- **Contact.** One line, Stockholm, remote/hybrid, LinkedIn, GitHub, CV, CV PDF.
  Existing `/pages/cv.html` and the PDF move over unchanged so old links still work.

## Ambience

- Subtle and stationary-safe: city lights twinkle, CRT glow breathes, a tiny
  camera drift. Off under `prefers-reduced-motion`.
- **Lamp easter egg:** click the ceiling spotlight to switch it off/on.
- **Sound** (opt-in only, never autoplays): rain and electrical hum made in the
  browser with Web Audio, no files.
- **Last:** rain outside the window (shader, only on far depth so it's behind the
  glass) and a small tape player for real lofi tracks dropped into
  `public/audio/` (hidden until tracks exist).

## Mobile

- Portrait: the room fills the height; drag sideways to look around. Objects get
  small always-visible markers with short labels, since there's no hover.
- Sections use the same camera moves with tighter framing; panels become a sheet
  under the object, still linked by the leader line.
- `100dvh`, safe-area insets, no page scroll or rubber-banding on the room.

## Stack

Vite + React + strict TypeScript. Plain `three` for the scene, kept
framework-free in `src/scene/` so it's testable and replaceable (e.g. real glTF
models later). React only for DOM UI. No router library, no animation library, no
state library. Vitest for the math, routing and terminal logic; Playwright
screenshots for visual QA at 1920×1080, 1440×900, 1366×768, 1024×768, 390×844 and
375×667.

Performance: DPR capped at 1.5 (the source is 1448px wide, so more is wasted),
WebP plate, a small depth texture, one draw call for the room. Rendering pauses
when the tab is hidden; ambient animation is cheap and stops entirely under
reduced motion.

## Deploy

GitHub Actions builds and publishes to GitHub Pages with `CNAME` = `ramigb.com`,
replacing the current static site. Nothing is pushed until Rami says so.
