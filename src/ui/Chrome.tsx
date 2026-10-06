import { useEffect, useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import { Ambience } from '../audio/ambience'
import { loadTapes, type Tape } from '../audio/tapes'
import { profile } from '../content/profile'
import { closeArea } from '../state/controller'
import { room, useRoom } from '../state/store'
import { Help } from './Help'
import { useFrame } from './useScene'

const HINT_KEY = 'room.explored'

function explored(): boolean {
  try {
    return localStorage.getItem(HINT_KEY) === '1'
  } catch {
    return false
  }
}

export function Chrome() {
  const area = useRoom((s) => s.area)
  const ready = useRoom((s) => s.ready)
  const visited = useRoom((s) => s.visited)
  const [firstTime] = useState(() => !explored())
  const showHint = firstTime && !visited

  useEffect(() => {
    if (!visited) return
    try {
      localStorage.setItem(HINT_KEY, '1')
    } catch {
      // Storage blocked: the hint will show again next visit, which is fine.
    }
  }, [visited])

  return (
    <div className="chrome" data-ready={ready}>
      <header className="chrome__brand">
        <h1>
          <a href="/" onClick={(e) => (e.preventDefault(), closeArea())}>
            {profile.name}
          </a>
        </h1>
        <span className="chrome__rule" aria-hidden="true" />
        <p>{profile.role}</p>
      </header>

      <div className="chrome__top-right">
        {area ? (
          <button type="button" className="back" onClick={closeArea}>
            <span aria-hidden="true">&#8592;</span> Room <kbd>Esc</kbd>
          </button>
        ) : (
          showHint && (
            <p className="hint">
              <span className="hint__fine">Click an object to explore</span>
              <span className="hint__touch">Drag to look. Tap things.</span>
            </p>
          )
        )}
      </div>

      <div className="chrome__bottom-left">
        <Help />
      </div>

      <div className="chrome__bottom-right">
        <TapeDeck />
        <SoundToggle />
      </div>

      <Toast />
    </div>
  )
}

const ambience = new Ambience()

function SoundToggle() {
  const sound = useRoom((s) => s.sound)
  const toggle = () => {
    const next = !sound
    room.set({ sound: next })
    if (next) void ambience.start()
    else ambience.stop()
  }
  return (
    <button type="button" className="control" aria-pressed={sound} onClick={toggle}>
      <span className="control__bars" data-on={sound} aria-hidden="true">
        <i />
        <i />
        <i />
      </span>
      {sound ? 'Rain on' : 'Sound off'}
    </button>
  )
}

function TapeDeck() {
  const [tapes, setTapes] = useState<Tape[]>([])
  const [index, setIndex] = useState(0)
  const [playing, setPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    let alive = true
    void loadTapes().then((t) => alive && setTapes(t))
    return () => {
      alive = false
    }
  }, [])

  const tape = tapes[index]
  if (!tape) return null

  const play = (a: HTMLAudioElement) =>
    void a.play().then(
      () => setPlaying(true),
      () => setPlaying(false),
    )

  const toggle = () => {
    const a = audioRef.current
    if (!a) return
    if (a.paused) play(a)
    else {
      a.pause()
      setPlaying(false)
    }
  }

  // Commit the new src synchronously so play() runs inside the click's user gesture
  // (autoplay policies, iOS especially, reject play() from a later tick).
  const next = () => {
    flushSync(() => setIndex((i) => (i + 1) % tapes.length))
    const a = audioRef.current
    if (a) play(a)
  }

  return (
    <div className="tape">
      <audio
        ref={audioRef}
        src={tape.src}
        preload="none"
        onEnded={next}
      />
      <button type="button" className="control" aria-pressed={playing} onClick={toggle}>
        <span aria-hidden="true">{playing ? '❚❚' : '▶'}</span>
        <span className="tape__title">{tape.title}</span>
      </button>
      {tapes.length > 1 && (
        <button type="button" className="control control--icon" aria-label="Next track" onClick={next}>
          <span aria-hidden="true">&#8250;</span>
        </button>
      )}
    </div>
  )
}

function Toast() {
  const toast = useRoom((s) => s.toast)
  const ref = useRef<HTMLParagraphElement>(null)

  useFrame((_f, r) => {
    const el = ref.current
    if (!el || !toast) return
    if (toast.at[0] < 0) {
      el.style.transform = ''
    } else {
      const [x, y] = r.project(toast.at[0], toast.at[1])
      el.style.transform = `translate3d(${x}px, ${y}px, 0)`
    }
    el.dataset.placed = 'true'
  })

  if (!toast) return null
  return (
    <p ref={ref} key={toast.key} className="toast" data-center={toast.at[0] < 0} role="status">
      {toast.text}
    </p>
  )
}
