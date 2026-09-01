'use client'

import { useRef, useState } from 'react'
import {
  ChevronLeft,
  ChevronRight,
  Download,
  Heart,
  Images,
  LockKeyhole,
  PartyPopper,
  Sparkles,
  Volume2,
  VolumeX,
  X,
} from 'lucide-react'

const TOTAL_PHOTOS = 10
const photos = Array.from({ length: TOTAL_PHOTOS }, (_, index) => ({
  src: `/api/photos/${index + 1}`,
  number: index + 1,
}))

export function BirthdayGallery() {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [mediaVersion] = useState(() => Date.now().toString())
  const [code, setCode] = useState('')
  const [unlocked, setUnlocked] = useState(false)
  const [error, setError] = useState(false)
  const [selected, setSelected] = useState<number | null>(null)
  const [checking, setChecking] = useState(false)
  const [muted, setMuted] = useState(false)

  function playMusic() {
    audioRef.current?.play().catch(() => {})
  }

  function toggleMusic() {
    const nextMuted = !muted
    setMuted(nextMuted)

    if (!nextMuted) {
      playMusic()
    }
  }

  function freshMediaUrl(src: string) {
    return `${src}${src.includes('?') ? '&' : '?'}v=${mediaVersion}`
  }

  async function unlock(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setChecking(true)
    setError(false)

    const response = await fetch('/api/unlock', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code }),
    }).catch(() => null)

    if (response?.ok) {
      setUnlocked(true)
      setError(false)
    } else {
      setError(true)
    }

    setChecking(false)
  }

  function download(src: string, number: number) {
    const link = document.createElement('a')
    link.href = `${freshMediaUrl(src)}&download=1`
    link.download = `birthday-girl-photo-${number}.jpg`
    link.click()
  }

  function downloadAll() {
    photos.forEach((photo, index) => setTimeout(() => download(photo.src, photo.number), index * 140))
  }

  return (
    <main className="birthday-shell" onPointerDown={playMusic}>
      <audio ref={audioRef} src="/api/music" autoPlay loop muted={muted} playsInline />
      <div className="background-photo" style={{ backgroundImage: `url('${freshMediaUrl('/api/background')}')` }} aria-hidden="true" />
      <div className="background-shade" aria-hidden="true" />

      <header className="site-header">
        <span className="brand-mark"><PartyPopper size={16} /> Birthday Vault</span>
        <div className="header-actions">
          <span className="header-note">Private memories, happy hearts</span>
          <button className="music-toggle" type="button" onClick={toggleMusic} aria-label={muted ? 'Unmute music' : 'Mute music'}>
            {muted ? <VolumeX size={17} /> : <Volume2 size={17} />}
          </button>
        </div>
      </header>

      {!unlocked ? (
        <section className="welcome-panel" aria-labelledby="welcome-title">
          <div className="party-pill"><Sparkles size={15} /> 02/09</div>
          <div className="eyebrow"><span className="eyebrow-line" /> Birthday memories <span className="eyebrow-line" /></div>
          <h1 id="welcome-title">My birthday vault,<br /><em>my favorite moments.</em></h1>
          <p className="welcome-copy">I made this little party room so my people can open it, smile, and keep their favorite pictures from my big day.</p>

          <form className="code-form" onSubmit={unlock}>
            <label htmlFor="access-code">Private access code</label>
            <div className={`code-row ${error ? 'has-error' : ''}`}>
              <LockKeyhole size={18} aria-hidden="true" />
              <input
                id="access-code"
                inputMode="text"
                autoComplete="off"
                value={code}
                onChange={(event) => {
                  setCode(event.target.value)
                  setError(false)
                }}
                placeholder="Enter code"
                aria-invalid={error}
              />
              <button type="submit" disabled={checking}>{checking ? 'Checking' : 'Open'} <span aria-hidden="true">&rarr;</span></button>
            </div>
            {error && <p className="error-message" role="alert">ACCESS DENIED</p>}
          </form>

          <p className="small-note"><Heart size={14} /> Shared with invited friends only</p>
        </section>
      ) : (
        <section className="gallery-section" aria-labelledby="gallery-title">
          <div className="gallery-heading">
            <div>
              <div className="eyebrow eyebrow-left"><span className="eyebrow-line" /> The collection</div>
              <h1 id="gallery-title">Pick a memory,<br /><em>take the joy home.</em></h1>
              <p>{TOTAL_PHOTOS} birthday pictures, ready to download.</p>
            </div>
            <button className="download-all" onClick={downloadAll}><Download size={17} /> Download all</button>
          </div>

          <div className="gallery-grid">
            {photos.map((photo) => (
              <article className="photo-card" key={photo.number}>
                <button className="photo-open" onClick={() => setSelected(photo.number)} aria-label={`View photo ${photo.number}`}>
                  <img src={freshMediaUrl(photo.src)} alt={`Birthday girl memory ${photo.number}`} />
                  <span className="photo-number">{String(photo.number).padStart(2, '0')}</span>
                </button>
                <button className="photo-download" onClick={() => download(photo.src, photo.number)} aria-label={`Download photo ${photo.number}`}><Download size={16} /></button>
              </article>
            ))}
          </div>

          <div className="gallery-footer"><Images size={17} /> {TOTAL_PHOTOS} bright little keepsakes <span>/</span> Keep them close</div>
        </section>
      )}

      {selected !== null && (
        <div className="lightbox" role="dialog" aria-modal="true" aria-label={`Photo ${selected} preview`} onClick={() => setSelected(null)}>
          <button className="lightbox-close" onClick={() => setSelected(null)} aria-label="Close preview"><X /></button>
          <button className="lightbox-arrow left" onClick={(event) => { event.stopPropagation(); setSelected(selected === 1 ? TOTAL_PHOTOS : selected - 1) }} aria-label="Previous photo"><ChevronLeft /></button>
          <img src={freshMediaUrl(`/api/photos/${selected}`)} alt={`Birthday girl memory ${selected}`} onClick={(event) => event.stopPropagation()} />
          <button className="lightbox-arrow right" onClick={(event) => { event.stopPropagation(); setSelected(selected === TOTAL_PHOTOS ? 1 : selected + 1) }} aria-label="Next photo"><ChevronRight /></button>
          <button className="lightbox-download" onClick={(event) => { event.stopPropagation(); download(`/api/photos/${selected}`, selected) }}><Download size={16} /> Download</button>
        </div>
      )}
    </main>
  )
}

export default BirthdayGallery
