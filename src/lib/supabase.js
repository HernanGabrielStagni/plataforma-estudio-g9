import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

export const APP_URL = import.meta.env.VITE_APP_URL || 'https://hernangabrielstagni.github.io/plataforma-estudio-g9/'
export const DIAS_TRIAL = Number(import.meta.env.VITE_DIAS_TRIAL) || 7
export const REGISTRO_ABIERTO = import.meta.env.VITE_REGISTRO_ABIERTO !== 'false'

export function getSessionId() {
  let sessionId = localStorage.getItem('espacio_semillas_session_id_g9')
  if (!sessionId) {
    sessionId = crypto.randomUUID()
    localStorage.setItem('espacio_semillas_session_id_g9', sessionId)
  }
  return sessionId
}

export async function recordVisit(sectionName) {
  if (!supabase) {
    const visits = JSON.parse(localStorage.getItem('visited_sections_g9') || '[]')
    if (!visits.includes(sectionName)) {
      visits.push(sectionName)
      localStorage.setItem('visited_sections_g9', JSON.stringify(visits))
    }
    return
  }

  try {
    const sessionId = getSessionId()
    await supabase.from('student_progress').insert({
      session_id: sessionId,
      section_visited: `g9_${sectionName}`,
      visited_at: new Date().toISOString()
    })
  } catch (error) {
    console.warn('Supabase error:', error.message)
    const visits = JSON.parse(localStorage.getItem('visited_sections_g9') || '[]')
    if (!visits.includes(sectionName)) {
      visits.push(sectionName)
      localStorage.setItem('visited_sections_g9', JSON.stringify(visits))
    }
  }
}

export async function removeVisit(sectionName) {
  if (!supabase) {
    const visits = JSON.parse(localStorage.getItem('visited_sections_g9') || '[]')
    localStorage.setItem('visited_sections_g9', JSON.stringify(visits.filter(v => v !== sectionName)))
    return
  }

  try {
    const sessionId = getSessionId()
    await supabase.from('student_progress').delete()
      .eq('session_id', sessionId)
      .eq('section_visited', `g9_${sectionName}`)
  } catch (error) {
    console.warn('Supabase error:', error.message)
    const visits = JSON.parse(localStorage.getItem('visited_sections_g9') || '[]')
    localStorage.setItem('visited_sections_g9', JSON.stringify(visits.filter(v => v !== sectionName)))
  }
}

export async function getVisitedSections() {
  if (!supabase) {
    return JSON.parse(localStorage.getItem('visited_sections_g9') || '[]')
  }

  try {
    const sessionId = getSessionId()
    const { data, error } = await supabase
      .from('student_progress')
      .select('section_visited')
      .eq('session_id', sessionId)
      .like('section_visited', 'g9_%')

    if (error) throw error
    return [...new Set(data.map(d => d.section_visited.replace('g9_', '')))]
  } catch (error) {
    return JSON.parse(localStorage.getItem('visited_sections_g9') || '[]')
  }
}
