import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

const ADMIN_EMAIL = 'psicologohernanstagni@gmail.com'

const PLANES = [
  {
    key: 'trial',
    label: 'Trial',
    icon: '☀️',
    color: '#F97316',
    descripcion: 'Acceso por 7 días de prueba',
  },
  {
    key: 'pro',
    label: 'Pro',
    icon: '🌞',
    color: '#2E7D32',
    descripcion: 'Acceso por tiempo limitado con fecha definida',
  },
  {
    key: 'vip',
    label: 'VIP',
    icon: '✅',
    color: '#7B2FBE',
    descripcion: 'Acceso completo y permanente',
  },
]

export default function Configuracion({ isAdminUser, userEmail: emailProp = '' }) {
  const [registeredUsers, setRegisteredUsers] = useState([])
  const [adminEmails, setAdminEmails] = useState([])
  const [nuevoAdmin, setNuevoAdmin] = useState('')
  const [showRegistered, setShowRegistered] = useState(true)
  const [userEmail, setUserEmail] = useState(emailProp)
  const [userStatus, setUserStatus] = useState(null)
  const [userTrialEnd, setUserTrialEnd] = useState(null)
  const [planClickeado, setPlanClickeado] = useState(null)

  useEffect(() => {
    loadCurrentUser()
    if (isAdminUser) {
      fetchRegisteredUsers()
      fetchAdminEmails()
    }
  }, [isAdminUser])

  async function loadCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    setUserEmail(user.email)
    // Cargar datos del plan del usuario actual
    try {
      const { data } = await supabase
        .from('registered_users')
        .select('status, trial_end')
        .eq('email', user.email)
        .maybeSingle()
      if (data) {
        setUserStatus(data.status)
        setUserTrialEnd(data.trial_end)
      }
    } catch(e) { console.warn(e) }
  }

  async function fetchRegisteredUsers() {
    try {
      const { data, error } = await supabase
        .from('registered_users')
        .select('email, ultimo_login, status, trial_start, trial_end, puede_descargar')
        .order('ultimo_login', { ascending: false })
      if (!error && data) setRegisteredUsers(data)
    } catch(e) { console.warn(e) }
  }

  async function fetchAdminEmails() {
    try {
      const { data, error } = await supabase.from('admin_emails').select('email, added_at')
      if (!error) setAdminEmails(data || [])
    } catch(e) { console.warn(e) }
  }

  async function cambiarPlan(email, plan) {
    const campos = { status: plan }
    if (plan === 'trial') { campos.trial_end = new Date(Date.now() + 7*24*60*60*1000).toISOString(); campos.puede_descargar = false }
    if (plan === 'vip') { campos.trial_end = null; campos.puede_descargar = true }

    setRegisteredUsers(prev => prev.map(u =>
      u.email === email
        ? { ...u, status: plan, trial_end: campos.trial_end !== undefined ? campos.trial_end : u.trial_end, puede_descargar: campos.puede_descargar !== undefined ? campos.puede_descargar : u.puede_descargar }
        : u
    ))

    const { error } = await supabase.from('registered_users').update(campos).eq('email', email)
    if (error) { console.error(error); fetchRegisteredUsers() }
  }

  async function toggleDescarga(email, valor) {
    setRegisteredUsers(prev => prev.map(u =>
      u.email === email ? { ...u, puede_descargar: valor } : u
    ))
    const { error } = await supabase.from('registered_users')
      .update({ puede_descargar: valor })
      .eq('email', email)
    if (error) { console.error(error); fetchRegisteredUsers() }
  }

  async function actualizarTrialEnd(email, nuevaFecha) {
    if (!nuevaFecha) return
    const { error } = await supabase.from('registered_users')
      .update({ trial_end: nuevaFecha, status: 'trial' })
      .eq('email', email)
    if (error) { console.error(error); return }
    fetchRegisteredUsers()
  }

  async function addAdminEmail(emailParam) {
    const email = (emailParam || nuevoAdmin).trim().toLowerCase()
    if (!email || !email.includes('@')) return
    if (adminEmails.some(a => a.email === email)) return

    const { error } = await supabase.from('admin_emails').insert({ email })
    if (error) { console.error('Sin permiso:', error); return }

    await supabase.from('registered_users')
      .update({ status: 'vip', trial_end: null })
      .eq('email', email)

    setRegisteredUsers(prev =>
      prev.map(u => u.email === email ? { ...u, status: 'vip', trial_end: null } : u)
    )
    setNuevoAdmin('')
    fetchAdminEmails()
  }

  async function removeAdminEmail(email) {
    if (adminEmails.length <= 1) return
    const { error } = await supabase.from('admin_emails').delete().eq('email', email)
    if (!error) fetchAdminEmails()
  }

  async function handleLogout() {
    if (window.cerrarSesion) window.cerrarSesion()
  }

  const cardStyle = {
    background: 'white',
    borderRadius: 16,
    padding: '24px',
    boxShadow: '0 4px 20px rgba(26,61,43,0.12)',
    marginBottom: 20
  }

  const btnPlan = (active, color) => ({
    fontSize: '10px', fontWeight: 700,
    padding: '3px 9px', borderRadius: 20,
    border: active ? 'none' : '1.5px solid rgba(0,0,0,.15)',
    cursor: 'pointer',
    background: active ? color : 'rgba(255,255,255,.6)',
    color: active ? '#fff' : '#999',
    display: 'flex', alignItems: 'center', gap: 3,
    boxShadow: active ? `0 2px 6px ${color}66` : 'none',
  })

  return (
    <div style={{ maxWidth: 680, margin: '0 auto', fontFamily: 'sans-serif' }}>
      <h2 style={{ color: '#1a3d2b', fontWeight: 900, fontSize: '1.6rem', marginBottom: 6 }}>
        ⚙️ Configuración
      </h2>

      {/* Identificación del usuario */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap',
        background: 'white', borderRadius: 12, padding: '12px 18px',
        boxShadow: '0 2px 12px rgba(26,61,43,0.10)', marginBottom: 20,
        border: '1px solid rgba(26,61,43,0.08)'
      }}>
        <div style={{
          width: 36, height: 36, borderRadius: '50%',
          background: 'linear-gradient(135deg, #1a3d2b, #2d6a4f)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0, fontSize: 16
        }}>👤</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: '11px', color: '#999', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Usuario conectado
          </div>
          <div style={{ fontSize: '14px', color: '#1a3d2b', fontWeight: 700, wordBreak: 'break-all' }}>
            {userEmail}
          </div>
        </div>
        {isAdminUser && (
          <span style={{
            fontSize: '11px', fontWeight: 700,
            background: '#1565C0', color: '#fff',
            borderRadius: 20, padding: '4px 12px', flexShrink: 0
          }}>👑 Admin</span>
        )}
      </div>

      {/* Plan actual */}
      {!isAdminUser && (
        <div style={cardStyle}>
          {/* Encabezado "Mi plan" con email */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 8 }}>
            <h3 style={{ margin: 0, color: '#1a3d2b', fontSize: '1rem' }}>Mi plan</h3>
            <span style={{
              fontSize: '12px', color: '#555', fontWeight: 600,
              background: '#f0f7f3', border: '1px solid #b2d8c2',
              borderRadius: 20, padding: '3px 12px', wordBreak: 'break-all'
            }}>
              {userEmail}
            </span>
          </div>

          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 16 }}>
            {PLANES.map(plan => {
              const esActual = userStatus === plan.key || (plan.key === 'pro' && userStatus === 'activo')
              const activo = esActual

              return (
                <div
                  key={plan.key}
                  onClick={() => !activo && setPlanClickeado(plan.key === planClickeado ? null : plan.key)}
                  style={{
                    flex: 1, minWidth: 120,
                    border: activo ? `2px solid ${plan.color}` : '2px solid #e0e0e0',
                    borderRadius: 12,
                    padding: '14px 12px',
                    textAlign: 'center',
                    cursor: activo ? 'default' : 'pointer',
                    background: activo ? `${plan.color}15` : '#f9f9f9',
                    opacity: activo ? 1 : 0.55,
                    transition: 'all 0.2s',
                    position: 'relative',
                  }}
                >
                  {activo && (
                    <div style={{
                      position: 'absolute', top: -10, left: '50%', transform: 'translateX(-50%)',
                      background: plan.color, color: 'white',
                      fontSize: '10px', fontWeight: 700,
                      borderRadius: 20, padding: '2px 10px', whiteSpace: 'nowrap'
                    }}>
                      TU PLAN ACTUAL
                    </div>
                  )}
                  <div style={{ fontSize: 28, marginBottom: 4 }}>{plan.icon}</div>
                  <div style={{ fontWeight: 700, color: activo ? plan.color : '#999', fontSize: '0.95rem' }}>
                    {plan.label}
                  </div>
                  <div style={{ fontSize: '11px', color: '#aaa', marginTop: 4, lineHeight: 1.4 }}>
                    {plan.descripcion}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Fecha de vencimiento */}
          {userTrialEnd && userStatus !== 'vip' && (() => {
            const end = new Date(userTrialEnd)
            const dias = Math.ceil((end - new Date()) / 86400000)
            const fecha = end.toLocaleDateString('es-AR', { day: '2-digit', month: 'long', year: 'numeric' })
            return (
              <div style={{
                background: dias <= 3 ? '#fdecea' : '#f0f7f3',
                border: `1px solid ${dias <= 3 ? '#f5c6c6' : '#b2d8c2'}`,
                borderRadius: 8, padding: '10px 14px',
                fontSize: '13px', color: dias <= 3 ? '#c0392b' : '#2d6a4f',
                marginBottom: 12
              }}>
                {dias > 0
                  ? `⏳ Tu acceso vence el ${fecha} (${dias} día${dias !== 1 ? 's' : ''} restante${dias !== 1 ? 's' : ''})`
                  : `⚠️ Tu acceso venció el ${fecha}`
                }
              </div>
            )
          })()}

          {/* Mensaje al hacer clic en otro plan */}
          {planClickeado && (
            <div style={{
              background: '#f0f4ff',
              border: '1px solid #c0cdf5',
              borderRadius: 10, padding: '14px 16px',
              fontSize: '13px', color: '#333', lineHeight: 1.6
            }}>
              <div style={{ fontWeight: 700, marginBottom: 6, color: '#1a3d2b' }}>
                ¿Querés cambiar al plan {PLANES.find(p => p.key === planClickeado)?.icon} {PLANES.find(p => p.key === planClickeado)?.label}?
              </div>
              Comunicate con el administrador para solicitar tu cambio de plan:<br />
              <a href={`mailto:${ADMIN_EMAIL}`} style={{ color: '#2d5a3d', fontWeight: 700 }}>
                {ADMIN_EMAIL}
              </a>
            </div>
          )}
        </div>
      )}

      {/* Botón cerrar sesión */}
      <div style={cardStyle}>
        <h3 style={{ margin: '0 0 12px', color: '#1a3d2b', fontSize: '1rem' }}>Sesión</h3>
        <button onClick={handleLogout} style={{
          padding: '10px 20px', background: '#c0392b', color: 'white',
          border: 'none', borderRadius: 8, cursor: 'pointer',
          fontWeight: 600, fontSize: '0.9rem'
        }}>
          Cerrar sesión
        </button>
      </div>

      {/* Panel admin */}
      {isAdminUser && (
        <div style={cardStyle}>
          <button
            onClick={() => setShowRegistered(v => !v)}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              width: '100%', cursor: 'pointer', padding: '11px 16px',
              background: showRegistered
                ? 'linear-gradient(135deg, #2E7D32 0%, #388E3C 100%)'
                : 'linear-gradient(135deg, #1B4332 0%, #2D6A4F 100%)',
              border: 'none', borderRadius: 12,
              marginBottom: showRegistered ? 16 : 0,
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span>👥</span>
              <span style={{ fontWeight: 700, color: '#fff', fontSize: '12px' }}>USUARIOS</span>
              <span style={{
                fontSize: '11px', fontWeight: 800,
                background: 'rgba(255,255,255,0.22)', color: '#fff',
                borderRadius: 20, padding: '2px 9px'
              }}>{registeredUsers.length}</span>
            </span>
            <span style={{
              fontSize: '12px', color: 'rgba(255,255,255,0.85)',
              transform: showRegistered ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform .25s'
            }}>▼</span>
          </button>

          {showRegistered && (
            <>
              <div style={{ borderRadius: 10, overflow: 'hidden', marginBottom: 12 }}>
                {registeredUsers.length === 0
                  ? <div style={{ fontSize: '12px', color: '#999', padding: 10 }}>Sin usuarios aún</div>
                  : registeredUsers
                    .sort((a, b) => {
                      const aA = adminEmails.some(x => x.email === a.email) ? 0 : 1
                      const bA = adminEmails.some(x => x.email === b.email) ? 0 : 1
                      if (aA !== bA) return aA - bA
                      return a.email.localeCompare(b.email)
                    })
                    .map((u, i) => {
                      const esAdmin = adminEmails.some(a => a.email === u.email)
                      const esVip = u.status === 'vip'
                      const esPro = u.status === 'pro' || u.status === 'activo'
                      const endDate = u.trial_end ? new Date(u.trial_end) : null
                      const diasRestantes = endDate ? Math.ceil((endDate - new Date()) / 86400000) : null
                      const fechaCorta = endDate
                        ? endDate.toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: '2-digit' })
                        : null

                      let badge = { label: '☀️ Trial', bg: '#F97316' }
                      if (esVip) {
                        badge = { label: '✅ VIP', bg: '#7B2FBE' }
                      } else if (esPro) {
                        if (diasRestantes !== null && diasRestantes <= 0)
                          badge = { label: '⚠️ Pro vencido', bg: '#C0392B' }
                        else if (diasRestantes !== null && diasRestantes <= 2)
                          badge = { label: `🌞 Pro · vence en ${diasRestantes}d`, bg: '#E65100' }
                        else
                          badge = { label: fechaCorta ? `🌞 Pro · hasta ${fechaCorta}` : '🌞 Pro', bg: '#2E7D32' }
                      } else {
                        if (diasRestantes !== null && diasRestantes <= 0)
                          badge = { label: '⚠️ Vencido', bg: '#C0392B' }
                        else if (diasRestantes !== null && diasRestantes <= 3)
                          badge = { label: `☀️ Trial +${diasRestantes}d`, bg: '#DC2626' }
                        else if (diasRestantes !== null)
                          badge = { label: `☀️ Trial +${diasRestantes}d`, bg: '#F97316' }
                      }

                      return (
                        <div key={u.email} style={{
                          background: i % 2 === 0 ? 'rgba(0,0,0,.02)' : 'rgba(0,0,0,.05)',
                          padding: '9px 12px',
                          borderBottom: '1px solid rgba(0,0,0,.05)'
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                            <span style={{ fontSize: '11px', color: '#555', flex: 1, wordBreak: 'break-all' }}>
                              {u.email}
                            </span>
                            <span style={{
                              fontSize: '10px', fontWeight: 700,
                              background: badge.bg, color: '#fff',
                              borderRadius: 20, padding: '2px 9px', whiteSpace: 'nowrap'
                            }}>{badge.label}</span>
                            {esAdmin && (
                              <span style={{
                                fontSize: '10px', fontWeight: 700,
                                background: '#1565C0', color: '#fff',
                                borderRadius: 20, padding: '2px 10px'
                              }}>👑 Admin</span>
                            )}
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6, flexWrap: 'wrap' }}>
                            {!esAdmin && (
                              <>
                                {[
                                  { k: 'trial', l: 'Trial', icon: '☀️', bg: '#F97316' },
                                  { k: 'pro',   l: 'Pro',   icon: '🌞', bg: '#2E7D32' },
                                  { k: 'vip',   l: 'VIP',   icon: '✅', bg: '#7B2FBE' },
                                ].map(p => {
                                  const activo = u.status === p.k || (p.k === 'pro' && u.status === 'activo')
                                  return (
                                    <button key={p.k}
                                      onClick={() => cambiarPlan(u.email, p.k)}
                                      style={btnPlan(activo, p.bg)}
                                    >
                                      {activo && <span style={{ fontSize: '9px' }}>✔</span>}
                                      {p.icon} {p.l}
                                    </button>
                                  )
                                })}

                                {esPro && (
                                  <input type="date"
                                    defaultValue={u.trial_end ? u.trial_end.slice(0, 10) : ''}
                                    onChange={e => actualizarTrialEnd(u.email, e.target.value)}
                                    style={{ fontSize: '10px', border: '1px solid #ccc', borderRadius: 5, padding: '1px 5px' }}
                                  />
                                )}

                                {/* Toggle descarga — solo para plan Pro */}
                                {esPro && (
                                  <label style={{
                                    display: 'flex', alignItems: 'center', gap: 5,
                                    fontSize: '10px', cursor: 'pointer',
                                    background: u.puede_descargar ? '#e8f5e9' : '#f5f5f5',
                                    border: `1px solid ${u.puede_descargar ? '#81c784' : '#ddd'}`,
                                    borderRadius: 20, padding: '3px 10px',
                                    fontWeight: 600,
                                    color: u.puede_descargar ? '#2E7D32' : '#999',
                                    transition: 'all 0.2s', whiteSpace: 'nowrap'
                                  }}>
                                    <input
                                      type="checkbox"
                                      checked={!!u.puede_descargar}
                                      onChange={e => toggleDescarga(u.email, e.target.checked)}
                                      style={{ display: 'none' }}
                                    />
                                    {u.puede_descargar ? '📥 Descarga: ON' : '📥 Descarga: OFF'}
                                  </label>
                                )}
                              </>
                            )}

                            <span style={{ marginLeft: 'auto' }}>
                              {!esAdmin
                                ? <span
                                    onClick={() => addAdminEmail(u.email)}
                                    style={{ color: '#2E7D32', fontSize: '10px', cursor: 'pointer' }}
                                  >+ admin</span>
                                : adminEmails.length > 1 &&
                                  <span
                                    onClick={() => removeAdminEmail(u.email)}
                                    style={{ color: '#C0392B', fontSize: '10px', cursor: 'pointer' }}
                                  >✕ admin</span>
                              }
                            </span>
                          </div>
                        </div>
                      )
                    })
                }
              </div>

              <div style={{ fontSize: '11px', color: '#999', marginBottom: 6 }}>
                Dar acceso admin a un email no registrado aún:
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <input
                  placeholder="nuevo@email.com"
                  value={nuevoAdmin}
                  onChange={e => setNuevoAdmin(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && addAdminEmail()}
                  style={{
                    flex: 1, fontSize: '13px', padding: '8px 12px',
                    border: '1.5px solid #ccc', borderRadius: 8
                  }}
                />
                <button onClick={() => addAdminEmail()} style={{
                  padding: '8px 14px', background: '#2D5A3D', color: '#fff',
                  border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600
                }}>
                  + Admin
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}
