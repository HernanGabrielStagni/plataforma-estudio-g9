import { supabase, DIAS_TRIAL } from './supabase'

export async function checkUserAccess(email) {
  try {
    const { data, error } = await supabase
      .from('registered_users')
      .select('status, trial_end')
      .eq('email', email)
      .maybeSingle()
    if (error || !data) return 'ok'
    if (data.status === 'vip') return 'ok'
    if (['activo', 'pro', 'trial'].includes(data.status)) {
      if (!data.trial_end) return 'ok'
      return new Date() > new Date(data.trial_end) ? 'expired' : 'ok'
    }
    return 'ok'
  } catch { return 'ok' }
}

export async function registrarOActualizarUsuario(email, nombre) {
  try {
    const { data: existing } = await supabase
      .from('registered_users')
      .select('status').eq('email', email).maybeSingle()
    if (!existing) {
      const now = new Date()
      const { data: adminRow } = await supabase
        .from('admin_emails').select('email').eq('email', email).maybeSingle()
      const esAdmin = !!adminRow
      const trialEnd = new Date(now.getTime() + DIAS_TRIAL * 24 * 60 * 60 * 1000)
      await supabase.from('registered_users').insert({
        email,
        nombre: nombre || null,
        status: esAdmin ? 'vip' : 'trial',
        trial_start: now.toISOString(),
        trial_end: esAdmin ? null : trialEnd.toISOString(),
        ultimo_login: now.toISOString()
      })
    } else {
      const update = { ultimo_login: new Date().toISOString() }
      if (nombre) update.nombre = nombre
      await supabase.from('registered_users').update(update).eq('email', email)
    }
  } catch(e) { console.warn(e) }
}

export async function checkIsAdmin(email) {
  try {
    const { data } = await supabase
      .from('admin_emails').select('email')
      .eq('email', email).maybeSingle()
    return !!data
  } catch { return false }
}
