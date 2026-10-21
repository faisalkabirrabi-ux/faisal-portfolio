import { useEffect, useState } from 'react'

// 'checking' | 'ready' | 'missing'. Local files are verified by content-type because
// hosting often answers 200 with index.html for missing files.
function useCvState(url) {
  const [state, setState] = useState('checking')
  useEffect(() => {
    let alive = true
    if (!url) { setState('missing'); return }
    if (/^https?:/.test(url)) { setState('ready'); return }
    fetch(url, { method: 'HEAD' })
      .then((r) => alive && setState(r.ok && (r.headers.get('content-type') || '').includes('pdf') ? 'ready' : 'missing'))
      .catch(() => alive && setState('missing'))
    return () => { alive = false }
  }, [url])
  return state
}

export default function CvButton({ url, label, ui }) {
  const state = useCvState(url)
  const base = 'px-6 py-3 rounded-sm text-center '
  if (state === 'ready')
    return <a href={url} download target="_blank" rel="noopener" className={base + 'border border-gold/60 text-gold hover:bg-gold hover:text-ink transition-colors'}>{label}</a>
  return (
    <button type="button" disabled aria-disabled="true" className={base + 'border border-gold/20 text-gold/40 cursor-not-allowed'}>
      {state === 'checking' ? ui.cvChecking : `${label}: ${ui.cvMissing}`}
    </button>
  )
}
