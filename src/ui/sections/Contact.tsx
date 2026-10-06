import { useEffect, useRef } from 'react'
import { contact } from '../../content/links'
import { profile } from '../../content/profile'
import { useRoom } from '../../state/store'

/** Written over the skyline. The city stays visible behind it. */
export function Contact() {
  const headingRef = useRef<HTMLHeadingElement>(null)
  const moving = useRoom((s) => s.moving)

  useEffect(() => {
    if (!moving) headingRef.current?.focus({ preventScroll: true })
  }, [moving])

  return (
    <section className="skyline" aria-labelledby="contact-title">
      <p className="panel__kicker">{profile.location}</p>
      <h2 id="contact-title" ref={headingRef} tabIndex={-1}>
        {contact.heading}
      </h2>
      <p className="skyline__body">{contact.body}</p>
      <ul className="skyline__links">
        {contact.links.map((l) => (
          <li key={l.label}>
            <a
              href={l.href}
              {...(l.kind === 'external' ? { target: '_blank', rel: 'noreferrer' } : {})}
              {...(l.kind === 'download' ? { download: true } : {})}
            >
              {l.label}
              <span aria-hidden="true">{l.kind === 'external' ? '↗' : l.kind === 'download' ? '↓' : '→'}</span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  )
}
