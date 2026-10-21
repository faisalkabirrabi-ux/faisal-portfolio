import { useEffect, useState } from 'react'
import { supabase } from './supabase'
import { profile as defProfile, skills as defSkills, projects as defProjects } from '../data/content'

// Starts with defaults from content.js, then replaces them with Supabase data when available.
export default function useSiteData() {
  const [data, setData] = useState({ profile: defProfile, skills: defSkills, projects: defProjects })
  const [error, setError] = useState(false)
  useEffect(() => {
    if (!supabase) return
    let alive = true
    Promise.all([
      supabase.from('profile').select('*').eq('id', 1).maybeSingle(),
      supabase.from('skills').select('*').order('id'),
      supabase.from('projects').select('*').order('id')
    ]).then(([p, s, pr]) => {
      if (!alive) return
      if (p.error || s.error || pr.error) { setError(true); return }
      setData({
        profile: p.data ? {
          email: p.data.email || defProfile.email, github: p.data.github || defProfile.github,
          linkedin: p.data.linkedin || '', cvEn: p.data.cv_en_url || defProfile.cvEn, cvBn: p.data.cv_bn_url || defProfile.cvBn
        } : defProfile,
        skills: s.data.length ? s.data.map((r) => ({ en: r.name_en, bn: r.name_bn })) : defSkills,
        projects: pr.data.length ? pr.data.map((r) => ({
          id: r.id, title: { en: r.title_en, bn: r.title_bn }, desc: { en: r.desc_en, bn: r.desc_bn },
          tags: (r.tags || '').split(',').map((x) => x.trim()).filter(Boolean), live: r.live_url, repo: r.repo_url
        })) : defProjects
      })
    }).catch(() => alive && setError(true))
    return () => { alive = false }
  }, [])
  return { ...data, error }
}
