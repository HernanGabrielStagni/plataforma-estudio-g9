import { useState, useEffect } from 'react'
import { supabase } from './supabase'

const ADMIN_EMAIL = 'psicologohernanstagni@gmail.com'
const TRIAL_LIMIT_SECONDS = 4 * 60 // 4 minutos

// Devuelve el plan efectivo del usuario y si puede descargar
// VIP siempre puede descargar. Pro depende del flag puede_descargar. Trial nunca.
export function usePlan(isAdminUser) {
  const [plan, setPlan] = useState(null) // null = cargando
  const [puedeDescargar, setPuedeDescargar] = useState(false)

  useEffect(() => {
    if (isAdminUser) { setPlan('vip'); setPuedeDescargar(true); return }
    if (!supabase) { setPlan('vip'); setPuedeDescargar(true); return }

    async function load() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) { setPlan('trial'); return }
        const { data } = await supabase
          .from('registered_users')
          .select('status, trial_end, puede_descargar')
          .eq('email', user.email)
          .maybeSingle()
        if (!data) { setPlan('trial'); return }
        if (data.status === 'vip') {
          setPlan('vip'); setPuedeDescargar(true); return
        }
        if (data.status === 'pro' || data.status === 'activo') {
          setPlan('pro')
          setPuedeDescargar(!!data.puede_descargar)
          return
        }
        setPlan('trial'); setPuedeDescargar(false)
      } catch { setPlan('trial'); setPuedeDescargar(false) }
    }
    load()
  }, [isAdminUser])

  return { plan, puedeDescargar, TRIAL_LIMIT_SECONDS, ADMIN_EMAIL }
}
