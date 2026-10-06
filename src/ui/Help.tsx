import { useEffect, useRef, useState } from 'react'
import { AREAS } from '../areas'
import { loadTapes, type Tape } from '../audio/tapes'
import { openArea } from '../state/controller'

const PROMPT = 'rami@room:~$'

/** A "?" in the corner that opens a terminal-style page on how the room works and whose things are in it. */
export function Help() {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const [open, setOpen] = useState(false)
  const [tapes, setTapes] = useState<Tape[]>([])

  useEffect(() => {
    if (!open) return
    let alive = true
    void loadTapes().then((t) => alive && setTapes(t))
    return () => {
      alive = false
    }
  }, [open])

  const show = () => {
    dialogRef.current?.showModal()
    setOpen(true)
  }
  const hide = () => dialogRef.current?.close()

  return (
    <>
      <button type="button" className="control control--icon" aria-label="Help" aria-haspopup="dialog" onClick={show}>
        <span aria-hidden="true">?</span>
      </button>

      <dialog
        ref={dialogRef}
        className="help"
        aria-labelledby="help-title"
        onClose={() => setOpen(false)}
        // A click on the backdrop lands on the dialog itself, not on its contents.
        onClick={(e) => e.target === e.currentTarget && hide()}
      >
        <div className="help__screen">
          <header className="help__bar">
            <h2 id="help-title">help.txt</h2>
            <button type="button" className="help__close" onClick={hide}>
              [esc] close
            </button>
          </header>

          <div className="help__body">
            <Cmd>man room</Cmd>
            <h3>How to use</h3>
            <dl className="help__keys">
              <dt>click</dt>
              <dd>Hover the room to see what is there, click to walk over.</dd>
              <dt>touch</dt>
              <dd>Drag to look around, tap things.</dd>
              <dt>esc</dt>
              <dd>Back to the whole room (or the &#8592; Room button).</dd>
              <dt>tab</dt>
              <dd>Move between places with the keyboard, enter to go.</dd>
            </dl>

            <h3>Places</h3>
            <dl className="help__keys">
              {AREAS.map((a) => (
                <div key={a.id}>
                  <dt>{a.label}</dt>
                  <dd>
                    {a.hint}
                    {a.id === 'projects' && <span className="t--dim">. The screen takes commands, try help.</span>}
                  </dd>
                </div>
              ))}
            </dl>

            <h3>Small things</h3>
            <p>
              The lamp switches off. The tablet has messages. Sit still long enough and the room shows you around. An
              old cheat code still works.
            </p>
            <p>
              Bottom right: &#9654; plays the tapes, &#8250; skips to the next one, and the bars toggle the rain, which
              is synthesized live in your browser.
            </p>

            <Cmd>cat credits/room.txt</Cmd>
            <p>
              The whole idea started with the background image. I did not make it, and unfortunately I do not know who
              did. It is a very popular illustration that has been shared all over the internet, I found it online like
              everyone else, and I am borrowing it. Everything here grew out of it: the depth, the rain, the light, a
              room you can walk around in.
            </p>
            <p>
              If it is yours, I would love to credit you properly, or take it down if you prefer.{' '}
              <button
                type="button"
                className="help__link"
                onClick={() => {
                  hide()
                  openArea('contact')
                }}
              >
                Get in touch
              </button>
              .
            </p>

            <Cmd>ls audio/</Cmd>
            <p>Royalty-free lofi. The artist and the track name are literally in the file name:</p>
            {tapes.length > 0 ? (
              <ul className="help__files">
                {tapes.map((t) => (
                  <li key={t.src}>
                    {t.src.split('/').pop()}
                    <span className="t--dim"> # {t.title}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="t--dim">(no tapes loaded)</p>
            )}

            <p className="help__cursor">
              <span className="t__ps">{PROMPT}</span> <span className="help__caret" aria-hidden="true" />
            </p>
          </div>
        </div>
      </dialog>
    </>
  )
}

function Cmd({ children }: { children: string }) {
  return (
    <p className="help__cmd">
      <span className="t__ps">{PROMPT}</span> {children}
    </p>
  )
}
