import { useState, useEffect } from 'react'
import { content } from './data/content'
import { ui as uiText } from './data/ui'
import useSiteData from './lib/useSiteData'
import Cube from './components/Cube'
import CvButton from './components/CvButton'

const gold = 'border border-gold/60 text-gold hover:bg-gold hover:text-ink transition-colors'
const isPlaceholder = (v) => !v || v.includes('your-email@example.com') || v.includes('your-username')

function Heading({ children }) {
  return <h2 className="font-display text-4xl sm:text-5xl text-gold mb-10 pb-4 border-b border-gold/30 max-w-xs">{children}</h2>
}

export default function Portfolio() {
  const [lang, setLang] = useState(() => { try { return localStorage.getItem('lang') || 'en' } catch { return 'en' } })
  const [open, setOpen] = useState(false)
  const { profile, skills, projects, error } = useSiteData()
  const t = content[lang]
  const u = uiText[lang]
  useEffect(() => {
    document.documentElement.lang = lang
    try { localStorage.setItem('lang', lang) } catch {}
  }, [lang])
  const keys = ['about', 'skills', 'projects', 'contact']
  const pick = (o) => (o && (o[lang] || o.en)) || ''
  const link = (url, label) => isPlaceholder(url)
    ? <span className="px-6 py-3 rounded-sm border border-gold/20 text-gold/50">{label}: {u.notSet}</span>
    : <a href={url} target="_blank" rel="noopener noreferrer" className={`px-6 py-3 rounded-sm ${gold}`}>{label}</a>

  return (
    <div className="min-h-screen bg-ink">
      <header className="fixed top-0 inset-x-0 z-20 bg-ink/90 backdrop-blur border-b border-gold/20">
        <nav className="max-w-5xl mx-auto px-5 h-16 flex items-center justify-between">
          <a href="#top" className="font-display text-xl text-gold">FKR</a>
          <div className="hidden md:flex gap-8">
            {keys.map((k) => <a key={k} href={`#${k}`} className="hover:text-gold">{t.nav[k]}</a>)}
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setLang(lang === 'en' ? 'bn' : 'en')} className={`px-3 py-1 text-sm rounded-sm ${gold}`} aria-label="Switch language">
              {lang === 'en' ? 'বাংলা' : 'English'}
            </button>
            <button className="md:hidden text-gold text-2xl w-10 h-10" onClick={() => setOpen(!open)} aria-label={u.menu} aria-expanded={open}>{open ? '✕' : '☰'}</button>
          </div>
        </nav>
        {open && (
          <div className="md:hidden px-5 pb-4 flex flex-col gap-1 border-t border-gold/20">
            {keys.map((k) => <a key={k} href={`#${k}`} onClick={() => setOpen(false)} className="py-3">{t.nav[k]}</a>)}
          </div>
        )}
      </header>

      {error && <p role="alert" className="fixed bottom-4 inset-x-4 z-30 bg-ink border border-gold/60 text-gold-soft px-4 py-3 text-sm text-center">{u.loadError}</p>}

      <main id="top">
        <section className="min-h-screen pt-16 flex items-center">
          <div className="max-w-5xl mx-auto px-5 w-full grid md:grid-cols-[1fr_auto] gap-12 items-center py-16">
            <div>
              <p className="text-gold/80 mb-3">{t.role}</p>
              <h1 className="font-display font-bold text-5xl sm:text-7xl text-gold-soft leading-tight">{t.name}</h1>
              <p className="mt-6 max-w-md text-lg text-[#EDE6D3]/80">{t.intro}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a href="#projects" className="px-6 py-3 bg-gold text-ink font-medium rounded-sm hover:bg-gold-soft">{t.viewWork}</a>
                <CvButton url={profile.cvEn} label={t.cvEn} ui={u} />
                <CvButton url={profile.cvBn} label={t.cvBn} ui={u} />
              </div>
              <p className="mt-4 text-sm text-gold/50">{u.cvNote}</p>
            </div>
            <div className="mx-auto md:mx-0 py-6"><Cube /></div>
          </div>
        </section>

        <section id="about" className="py-20 px-5 scroll-mt-16"><div className="max-w-5xl mx-auto">
          <Heading>{t.aboutTitle}</Heading>
          <p className="max-w-2xl text-lg leading-relaxed text-[#EDE6D3]/85">{t.about}</p>
        </div></section>

        <section id="skills" className="py-20 px-5 scroll-mt-16"><div className="max-w-5xl mx-auto">
          <Heading>{t.skillsTitle}</Heading>
          <ul className="flex flex-wrap gap-3">
            {skills.map((s, i) => <li key={i} className="px-4 py-2 border border-gold/40 text-gold-soft rounded-sm">{pick(s)}</li>)}
          </ul>
        </div></section>

        <section id="projects" className="py-20 px-5 scroll-mt-16"><div className="max-w-5xl mx-auto">
          <Heading>{t.projectsTitle}</Heading>
          <div className="grid gap-6 md:grid-cols-3">
            {projects.map((p) => (
              <article key={p.id} className="p-6 border border-gold/30 hover:border-gold transition-colors flex flex-col">
                <h3 className="font-display text-2xl text-gold-soft">{pick(p.title)}</h3>
                <p className="mt-3 text-[#EDE6D3]/75 flex-1">{pick(p.desc)}</p>
                {p.tags.length > 0 && <p className="mt-4 text-sm text-gold/70">{p.tags.join(', ')}</p>}
                <div className="mt-4 flex gap-4 text-sm">
                  {p.live && p.live !== '#' && <a href={p.live} target="_blank" rel="noopener noreferrer" className="text-gold underline underline-offset-4">{t.live}</a>}
                  {p.repo && p.repo !== '#' && <a href={p.repo} target="_blank" rel="noopener noreferrer" className="text-gold underline underline-offset-4">{t.repo}</a>}
                </div>
              </article>
            ))}
          </div>
        </div></section>

        <section id="contact" className="py-20 px-5 scroll-mt-16"><div className="max-w-5xl mx-auto">
          <Heading>{t.contactTitle}</Heading>
          <p className="mb-6 text-lg">{t.contactText}</p>
          <div className="flex flex-wrap gap-3">
            {isPlaceholder(profile.email)
              ? <span className="px-6 py-3 rounded-sm border border-gold/20 text-gold/50">{u.emailLabel}: {u.notSet}</span>
              : <a href={`mailto:${profile.email}`} className={`px-6 py-3 rounded-sm break-all ${gold}`}>{u.emailLabel}: {profile.email}</a>}
            {link(profile.github, t.github)}
            {profile.linkedin && link(profile.linkedin, 'LinkedIn')}
          </div>
        </div></section>
      </main>

      <footer className="py-8 text-center text-sm text-gold/60 border-t border-gold/20">
        © {new Date().getFullYear()} {t.name}. {t.rights}
      </footer>
    </div>
  )
}
