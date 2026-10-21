import { useEffect, useState } from 'react'
import { supabase } from './lib/supabase'

const inp = 'w-full bg-black border border-gold/40 px-3 py-2 text-[#EDE6D3] rounded-sm'
const btn = 'px-4 py-2 border border-gold/60 text-gold hover:bg-gold hover:text-ink rounded-sm disabled:opacity-50'

function Shell({ title, children }) {
  return (
    <div className="min-h-screen bg-ink p-5"><div className="max-w-3xl mx-auto">
      <h1 className="font-display text-3xl text-gold mb-6">{title}</h1>{children}
    </div></div>
  )
}
const Msg = ({ m }) => m ? <p role="status" className={`my-3 text-sm ${m.startsWith('Error') ? 'text-red-400' : 'text-gold-soft'}`}>{m}</p> : null

function Setup() {
  return (
    <Shell title="Admin setup needed">
      <p className="mb-3">Supabase is not configured, so the admin panel is disabled. Nothing is faked or saved locally.</p>
      <ol className="list-decimal pl-5 space-y-2 text-[#EDE6D3]/85">
        <li>Create a Supabase project and run <code>supabase/schema.sql</code> in its SQL Editor.</li>
        <li>Copy <code>.env.example</code> to <code>.env</code> and fill in <code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_ANON_KEY</code>.</li>
        <li>Restart <code>npm run dev</code>. On Vercel, add the same two variables and redeploy.</li>
      </ol>
      <p className="mt-4 text-sm text-gold/70">Full steps are in README.md.</p>
    </Shell>
  )
}

function Login() {
  const [f, setF] = useState({ email: '', password: '' })
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)
  const submit = async (e) => {
    e.preventDefault(); setBusy(true); setErr('')
    const { error } = await supabase.auth.signInWithPassword(f)
    if (error) setErr('Error: ' + error.message)
    setBusy(false)
  }
  return (
    <Shell title="Admin login">
      <form onSubmit={submit} className="space-y-4 max-w-sm">
        <input className={inp} type="email" required placeholder="Email" autoComplete="username" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} />
        <input className={inp} type="password" required placeholder="Password" autoComplete="current-password" value={f.password} onChange={(e) => setF({ ...f, password: e.target.value })} />
        <button className={btn} disabled={busy}>{busy ? 'Signing in...' : 'Sign in'}</button>
        <Msg m={err} />
      </form>
    </Shell>
  )
}

function ProfileEditor() {
  const [p, setP] = useState(null)
  const [msg, setMsg] = useState('')
  useEffect(() => {
    supabase.from('profile').select('*').eq('id', 1).maybeSingle()
      .then(({ data, error }) => error ? setMsg('Error: ' + error.message) : setP(data || {}))
  }, [])
  if (!p) return <><p>Loading...</p><Msg m={msg} /></>
  const save = async () => {
    const { error } = await supabase.from('profile').upsert({ id: 1, email: p.email || '', github: p.github || '', linkedin: p.linkedin || '' })
    setMsg(error ? 'Error: ' + error.message : 'Saved.')
  }
  const upload = async (col, file) => {
    if (!file) return
    if (file.type !== 'application/pdf') return setMsg('Error: only PDF files are allowed.')
    if (file.size > 5 * 1024 * 1024) return setMsg('Error: file is larger than 5 MB.')
    const name = col === 'cv_en_url' ? 'cv-english.pdf' : 'cv-bangla.pdf'
    setMsg('Uploading...')
    const up = await supabase.storage.from('cv').upload(name, file, { upsert: true, contentType: 'application/pdf' })
    if (up.error) return setMsg('Error: ' + up.error.message)
    const url = supabase.storage.from('cv').getPublicUrl(name).data.publicUrl + '?v=' + Date.now()
    const { error } = await supabase.from('profile').upsert({ id: 1, [col]: url })
    if (error) return setMsg('Error: ' + error.message)
    setP({ ...p, [col]: url }); setMsg('CV uploaded and saved.')
  }
  const field = (k, label) => (
    <label className="block">{label}<input className={inp} value={p[k] || ''} onChange={(e) => setP({ ...p, [k]: e.target.value })} /></label>
  )
  return (
    <div className="space-y-4">
      {field('email', 'Email')}{field('github', 'GitHub URL')}{field('linkedin', 'LinkedIn URL (optional)')}
      <button className={btn} onClick={save}>Save contact details</button>
      {[['cv_en_url', 'English CV (PDF)'], ['cv_bn_url', 'Bangla CV (PDF)']].map(([col, label]) => (
        <div key={col} className="border border-gold/30 p-4">
          <p className="mb-2">{label}: {p[col] ? <a className="text-gold underline" href={p[col]} target="_blank" rel="noreferrer">uploaded, open</a> : 'not uploaded yet'}</p>
          <input type="file" accept="application/pdf" onChange={(e) => upload(col, e.target.files[0])} />
        </div>
      ))}
      <Msg m={msg} />
    </div>
  )
}

function ListEditor({ table, fields }) {
  const [rows, setRows] = useState(null)
  const [msg, setMsg] = useState('')
  const load = () => supabase.from(table).select('*').order('id')
    .then(({ data, error }) => error ? setMsg('Error: ' + error.message) : setRows(data))
  useEffect(() => { load() }, [table])
  const set = (id, k, v) => setRows((rs) => rs.map((r) => (r.id === id ? { ...r, [k]: v } : r)))
  const save = async ({ id, ...rest }) => {
    const { error } = await supabase.from(table).update(rest).eq('id', id)
    setMsg(error ? 'Error: ' + error.message : 'Saved.')
  }
  const add = async () => {
    const { error } = await supabase.from(table).insert({})
    if (error) setMsg('Error: ' + error.message); else load()
  }
  const del = async (id) => {
    if (!window.confirm('Delete this item?')) return
    const { error } = await supabase.from(table).delete().eq('id', id)
    if (error) setMsg('Error: ' + error.message); else load()
  }
  if (!rows) return <><p>Loading...</p><Msg m={msg} /></>
  return (
    <div className="space-y-6">
      <button className={btn} onClick={add}>Add new</button><Msg m={msg} />
      {rows.length === 0 && <p className="text-gold/70">Nothing here yet. The public site shows placeholders until you add items.</p>}
      {rows.map((r) => (
        <div key={r.id} className="border border-gold/30 p-4 space-y-3">
          {fields.map(([k, label, area]) => (
            <label key={k} className="block text-sm">{label}
              {area ? <textarea rows="3" className={inp} value={r[k] || ''} onChange={(e) => set(r.id, k, e.target.value)} />
                : <input className={inp} value={r[k] || ''} onChange={(e) => set(r.id, k, e.target.value)} />}
            </label>
          ))}
          <div className="flex gap-3"><button className={btn} onClick={() => save(r)}>Save</button><button className={btn} onClick={() => del(r.id)}>Delete</button></div>
        </div>
      ))}
    </div>
  )
}

const skillFields = [['name_en', 'Skill (English)'], ['name_bn', 'Skill (Bangla)']]
const projectFields = [['title_en', 'Title (English)'], ['title_bn', 'Title (Bangla)'], ['desc_en', 'Description (English)', 1], ['desc_bn', 'Description (Bangla)', 1],
  ['tags', 'Tags, separated by commas'], ['live_url', 'Live site URL'], ['repo_url', 'Source code URL']]

function Panel() {
  const [session, setSession] = useState(undefined)
  const [isAdmin, setIsAdmin] = useState(null)
  const [tab, setTab] = useState('profile')
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => setSession(s))
    return () => subscription.unsubscribe()
  }, [])
  useEffect(() => {
    setIsAdmin(null)
    if (!session) return
    supabase.from('admins').select('user_id').eq('user_id', session.user.id).maybeSingle()
      .then(({ data, error }) => setIsAdmin(!error && !!data))
  }, [session])
  if (session === undefined) return <Shell title="Admin"><p>Loading...</p></Shell>
  if (!session) return <Login />
  if (isAdmin === null) return <Shell title="Admin"><p>Checking permissions...</p></Shell>
  const out = <button className={btn} onClick={() => supabase.auth.signOut()}>Sign out</button>
  if (!isAdmin) return (
    <Shell title="Not authorized">
      <p className="mb-4">This account is signed in but is not in the admins table, so it cannot edit anything. See README step "Make yourself admin".</p>{out}
    </Shell>
  )
  return (
    <Shell title="Admin panel">
      <div className="flex flex-wrap gap-2 mb-6">
        {[['profile', 'Contact & CVs'], ['skills', 'Skills'], ['projects', 'Projects']].map(([k, l]) => (
          <button key={k} className={btn + (tab === k ? ' bg-gold text-ink' : '')} onClick={() => setTab(k)}>{l}</button>
        ))}
        {out}<a href="/" className={btn}>View site</a>
      </div>
      {tab === 'profile' && <ProfileEditor />}
      {tab === 'skills' && <ListEditor key="s" table="skills" fields={skillFields} />}
      {tab === 'projects' && <ListEditor key="p" table="projects" fields={projectFields} />}
    </Shell>
  )
}

export default function Admin() { return supabase ? <Panel /> : <Setup /> }
