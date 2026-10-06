/**
 * Real tracks, dropped into public/audio/ and listed in public/audio/tracks.json:
 *
 *   [{ "title": "Night shift", "src": "night-shift.mp3" }]
 *
 * With no manifest (or an empty one) the tape player simply doesn't appear.
 */
export interface Tape {
  title: string
  src: string
}

export async function loadTapes(): Promise<Tape[]> {
  try {
    const res = await fetch('/audio/tracks.json', { cache: 'no-cache' })
    if (!res.ok) return []
    const data: unknown = await res.json()
    if (!Array.isArray(data)) return []
    return data
      .filter((t): t is Tape => typeof t?.title === 'string' && typeof t?.src === 'string')
      .map((t) => ({ title: t.title, src: t.src.startsWith('/') ? t.src : `/audio/${t.src}` }))
  } catch {
    return []
  }
}
