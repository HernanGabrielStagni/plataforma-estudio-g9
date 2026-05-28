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
    if (emailProp) setUserEmail(emailProp)
  }, [emailProp])

  useEffect(() => {
    loadCurrentUser()
    const { data: listener } = supabase?.auth.onAuthStateChange((_event, session) => {
      if (session?.user?.email) setUserEmail(session.user.email)
    }) || {}
    return () => listener?.subscription?.unsubscribe()
  }, [])

  useEffect(() => {
    if (isAdminUser) {
      fetchRegisteredUsers()
      fetchAdminEmails()
    }
  }, [isAdminUser])

  async function loadCurrentUser() {
    const { data: { session } } = await supabase.auth.getSession()
    const email = session?.user?.email
    if (!email) return
    setUserEmail(email)
    // Cargar datos del plan del usuario actual
    try {
      const { data } = await supabase
        .from('registered_users')
        .select('status, trial_end')
        .eq('email', email)
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
        .select('email, nombre, ultimo_login, status, trial_start, trial_end, puede_descargar')
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

  async function actualizarNombre(emailUsuario, nuevoNombre) {
    setRegisteredUsers(prev => prev.map(u =>
      u.email === emailUsuario ? { ...u, nombre: nuevoNombre } : u
    ))
    await supabase.from('registered_users').update({ nombre: nuevoNombre || null }).eq('email', emailUsuario)
  }

  async function eliminarUsuario(emailAEliminar) {
    if (!window.confirm(`¿Eliminar la cuenta de ${emailAEliminar}?`)) return
    setRegisteredUsers(prev => prev.filter(u => u.email !== emailAEliminar))
    await supabase.from('registered_users').delete().eq('email', emailAEliminar)
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

  // ── MENSAJERÍA ──
  const [mensajeTexto, setMensajeTexto] = useState('')
  const [destinatariosMensaje, setDestinatariosMensaje] = useState([]) // emails seleccionados o 'todos'
  const [enviarATodos, setEnviarATodos] = useState(false)
  const [mensajesEnviados, setMensajesEnviados] = useState([])
  const [respuestasUsuarios, setRespuestasUsuarios] = useState([])
  const [enviandoMsg, setEnviandoMsg] = useState(false)

  useEffect(() => {
    if (!isAdminUser) return
    fetchMensajesEnviados()
    fetchRespuestas()
  }, [isAdminUser])

  async function fetchMensajesEnviados() {
    const { data } = await supabase.from('mensajes_admin').select('*').order('created_at', { ascending: false })
    if (data) setMensajesEnviados(data)
  }

  async function fetchRespuestas() {
    const { data } = await supabase.from('mensajes_usuarios').select('*').order('created_at', { ascending: false })
    if (data) setRespuestasUsuarios(data)
  }

  async function enviarMensaje() {
    if (!mensajeTexto.trim()) return
    const destinos = enviarATodos ? ['todos'] : destinatariosMensaje
    if (!destinos.length) return
    setEnviandoMsg(true)
    for (const dest of destinos) {
      await supabase.from('mensajes_admin').insert({ destinatario: dest, contenido: mensajeTexto.trim() })
    }
    setMensajeTexto(''); setDestinatariosMensaje([]); setEnviarATodos(false)
    setEnviandoMsg(false)
    fetchMensajesEnviados()
  }

  async function toggleActivoMensaje(id, activo) {
    await supabase.from('mensajes_admin').update({ activo: !activo }).eq('id', id)
    fetchMensajesEnviados()
  }

  async function eliminarMensaje(id) {
    await supabase.from('mensajes_admin').delete().eq('id', id)
    fetchMensajesEnviados()
  }

  async function marcarRespuestaLeida(id) {
    await supabase.from('mensajes_usuarios').update({ leido: true }).eq('id', id)
    setRespuestasUsuarios(prev => prev.map(r => r.id === id ? { ...r, leido: true } : r))
  }

  function toggleDestinatario(email) {
    setDestinatariosMensaje(prev =>
      prev.includes(email) ? prev.filter(e => e !== email) : [...prev, email]
    )
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
        display: 'flex', alignItems: 'center', gap: 10,
        background: 'white', borderRadius: 12, padding: '12px 18px',
        boxShadow: '0 2px 12px rgba(26,61,43,0.10)', marginBottom: 20,
        border: '1px solid rgba(26,61,43,0.08)', overflow: 'hidden'
      }}>
        <div style={{
          width: 36, height: 36, borderRadius: '50%',
          background: 'linear-gradient(135deg, #1a3d2b, #2d6a4f)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0, fontSize: 16
        }}>👤</div>
        <div style={{ flex: 1, minWidth: 0, overflow: 'hidden' }}>
          <div style={{ fontSize: '11px', color: '#999', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Sesión activa
          </div>
          <div style={{ fontSize: '13px', color: '#1a3d2b', fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
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
                          padding: '10px 12px',
                          borderBottom: '1px solid rgba(0,0,0,.05)'
                        }}>
                          {/* Fila 1: nombre editable + email + eliminar */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <input
                                type="text"
                                defaultValue={u.nombre || ''}
                                placeholder="Agregar nombre..."
                                onBlur={e => {
                                  const val = e.target.value.trim()
                                  if (val !== (u.nombre || '')) actualizarNombre(u.email, val)
                                }}
                                onKeyDown={e => e.key === 'Enter' && e.target.blur()}
                                style={{
                                  fontSize: '12px', fontWeight: 700, color: '#1a3d2b',
                                  border: 'none', borderBottom: '1px dashed #b2d8c2',
                                  background: 'transparent', outline: 'none',
                                  width: '100%', padding: '1px 0', display: 'block'
                                }}
                              />
                              <span style={{ fontSize: '11px', color: '#666' }}>
                                {u.email}
                              </span>
                            </div>
                            <button
                              onClick={() => eliminarUsuario(u.email)}
                              title="Eliminar cuenta"
                              style={{
                                background: 'none', border: 'none', cursor: 'pointer',
                                color: '#C0392B', fontSize: '15px', padding: '0 2px',
                                lineHeight: 1, flexShrink: 0
                              }}
                            >🗑</button>
                          </div>

                          {/* Fila 2: badges + controles */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
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
                                    <input type="checkbox" checked={!!u.puede_descargar}
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
                                ? <span onClick={() => addAdminEmail(u.email)}
                                    style={{ color: '#2E7D32', fontSize: '10px', cursor: 'pointer' }}>
                                    + admin
                                  </span>
                                : adminEmails.length > 1 &&
                                  <span onClick={() => removeAdminEmail(u.email)}
                                    style={{ color: '#C0392B', fontSize: '10px', cursor: 'pointer' }}>
                                    ✕ admin
                                  </span>
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

      {/* ── PANEL MENSAJERÍA ADMIN ── */}
        {isAdminUser && (
          <div style={cardStyle}>
            <h3 style={{ margin: '0 0 16px', color: '#1a3d2b', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: 8 }}>
              ✉️ Mensajes a usuarios
            </h3>

            {/* Compositor */}
            <div style={{ background: '#f8faf9', borderRadius: 12, padding: 16, marginBottom: 20, border: '1px solid #d4e6da' }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#1a3d2b', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                Nuevo mensaje
              </div>

              {/* Destinatarios */}
              <div style={{ marginBottom: 12 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, cursor: 'pointer' }}>
                  <input type="checkbox" checked={enviarATodos} onChange={e => { setEnviarATodos(e.target.checked); setDestinatariosMensaje([]) }} />
                  <span style={{ fontSize: 13, fontWeight: 600, color: '#2d5a3d' }}>Enviar a TODOS los usuarios</span>
                </label>
                {!enviarATodos && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {registeredUsers.filter(u => !adminEmails.some(a => a.email === u.email)).map(u => (
                      <label key={u.email} style={{
                        display: 'flex', alignItems: 'center', gap: 5, cursor: 'pointer',
                        background: destinatariosMensaje.includes(u.email) ? '#d4e6da' : '#f0f0f0',
                        border: `1px solid ${destinatariosMensaje.includes(u.email) ? '#2d5a3d' : '#ddd'}`,
                        borderRadius: 20, padding: '4px 10px', fontSize: 11, fontWeight: 600,
                        transition: 'all 0.15s'
                      }}>
                        <input type="checkbox" style={{ display: 'none' }}
                          checked={destinatariosMensaje.includes(u.email)}
                          onChange={() => toggleDestinatario(u.email)}
                        />
                        {u.nombre ? `${u.nombre}` : u.email.split('@')[0]}
                      </label>
                    ))}
                  </div>
                )}
              </div>

              <textarea
                value={mensajeTexto}
                onChange={e => setMensajeTexto(e.target.value)}
                placeholder="Escribí el mensaje aquí..."
                rows={4}
                style={{
                  width: '100%', boxSizing: 'border-box', fontSize: 13, padding: '10px 12px',
                  border: '1.5px solid #ccc', borderRadius: 10, resize: 'vertical',
                  fontFamily: 'sans-serif', marginBottom: 10
                }}
              />
              <button
                onClick={enviarMensaje}
                disabled={enviandoMsg || !mensajeTexto.trim() || (!enviarATodos && !destinatariosMensaje.length)}
                style={{
                  padding: '9px 20px', background: '#2d5a3d', color: 'white',
                  border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 700, fontSize: 13,
                  opacity: enviandoMsg || !mensajeTexto.trim() || (!enviarATodos && !destinatariosMensaje.length) ? 0.5 : 1
                }}
              >
                {enviandoMsg ? 'Enviando...' : '📤 Enviar mensaje'}
              </button>
            </div>

            {/* Conversaciones por usuario */}
            {(() => {
              // Reunir todos los destinatarios únicos (excluye 'todos')
              const destinatariosIndividuales = [...new Set(
                mensajesEnviados.filter(m => m.destinatario !== 'todos').map(m => m.destinatario)
              )]
              // Mensajes "para todos" van a una sección aparte
              const paraTodos = mensajesEnviados.filter(m => m.destinatario === 'todos')
              // Buscar nombre en registeredUsers
              const getNombre = email => {
                const u = registeredUsers.find(r => r.email === email)
                return u?.nombre || null
              }
              const fmtFecha = d => new Date(d).toLocaleDateString('es-AR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })

              const renderMsgAdmin = m => (
                <div key={m.id} style={{
                  background: m.activo ? '#e8f4ed' : '#f5f5f5',
                  border: `1px solid ${m.activo ? '#b2d8c2' : '#ddd'}`,
                  borderRadius: 8, padding: '8px 12px', marginBottom: 6,
                  display: 'flex', gap: 8, alignItems: 'flex-start'
                }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 10, color: '#888', marginBottom: 3 }}>
                      📤 Vos · {fmtFecha(m.created_at)}
                      {' · '}<span style={{ color: m.activo ? '#2d5a3d' : '#999', fontWeight: 600 }}>{m.activo ? '🟢 Activo' : '⚫ Inactivo'}</span>
                    </div>
                    <div style={{ fontSize: 12, color: '#222', whiteSpace: 'pre-wrap' }}>{m.contenido}</div>
                  </div>
                  <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
                    <button onClick={() => toggleActivoMensaje(m.id, m.activo)} style={{
                      fontSize: 10, padding: '2px 7px', borderRadius: 5, cursor: 'pointer',
                      background: m.activo ? '#fff3e0' : '#e8f5e9',
                      border: `1px solid ${m.activo ? '#ffb74d' : '#81c784'}`,
                      color: m.activo ? '#e65100' : '#2e7d32', fontWeight: 600
                    }}>{m.activo ? 'Desactivar' : 'Activar'}</button>
                    <button onClick={() => eliminarMensaje(m.id)} style={{
                      fontSize: 10, padding: '2px 7px', borderRadius: 5, cursor: 'pointer',
                      background: '#fdecea', border: '1px solid #ef9a9a', color: '#c62828', fontWeight: 600
                    }}>✕</button>
                  </div>
                </div>
              )

              const renderRespuesta = r => (
                <div key={r.id} style={{
                  background: r.leido ? '#fafafa' : '#fffde7',
                  border: `1px solid ${r.leido ? '#eee' : '#f9a825'}`,
                  borderRadius: 8, padding: '8px 12px', marginBottom: 6,
                  display: 'flex', gap: 8, alignItems: 'flex-start'
                }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 10, color: '#888', marginBottom: 3 }}>
                      💬 {r.de_nombre ? <strong>{r.de_nombre}</strong> : r.de_email}
                      {r.de_nombre && <span style={{ color: '#bbb' }}> · {r.de_email}</span>}
                      {' · '}{fmtFecha(r.created_at)}
                    </div>
                    <div style={{ fontSize: 12, color: '#222', whiteSpace: 'pre-wrap' }}>{r.contenido}</div>
                  </div>
                  {!r.leido && (
                    <button onClick={() => marcarRespuestaLeida(r.id)} style={{
                      fontSize: 10, padding: '2px 7px', borderRadius: 5, cursor: 'pointer',
                      background: '#e8f5e9', border: '1px solid #81c784', color: '#2e7d32', fontWeight: 600, flexShrink: 0
                    }}>✓ Leída</button>
                  )}
                </div>
              )

              const totalNuevas = respuestasUsuarios.filter(r => !r.leido).length

              return (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: '#555', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                      Conversaciones
                    </span>
                    {totalNuevas > 0 && (
                      <span style={{ background: '#c0392b', color: 'white', borderRadius: 20, padding: '1px 8px', fontSize: 10, fontWeight: 700 }}>
                        {totalNuevas} nuevas respuestas
                      </span>
                    )}
                  </div>

                  {/* Mensajes para Todos */}
                  {paraTodos.length > 0 && (
                    <div style={{ marginBottom: 16, background: '#f8faf9', borderRadius: 10, padding: '10px 12px', border: '1px solid #d4e6da' }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: '#2d5a3d', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                        🌐 Para todos los usuarios
                      </div>
                      {paraTodos.map(renderMsgAdmin)}
                    </div>
                  )}

                  {/* Conversaciones individuales */}
                  {destinatariosIndividuales.length === 0 && paraTodos.length === 0 && respuestasUsuarios.length === 0 && (
                    <div style={{ color: '#aaa', fontSize: 12, fontStyle: 'italic' }}>Sin mensajes aún.</div>
                  )}

                  {destinatariosIndividuales.map(email => {
                    const nombre = getNombre(email)
                    const msgsEnviados = mensajesEnviados.filter(m => m.destinatario === email)
                    const respuestas = respuestasUsuarios.filter(r => r.de_email === email)
                    const tieneNuevas = respuestas.some(r => !r.leido)
                    // Mezclar y ordenar por fecha
                    const hilo = [
                      ...msgsEnviados.map(m => ({ tipo: 'enviado', data: m, ts: new Date(m.created_at) })),
                      ...respuestas.map(r => ({ tipo: 'respuesta', data: r, ts: new Date(r.created_at) }))
                    ].sort((a, b) => a.ts - b.ts)

                    return (
                      <div key={email} style={{ marginBottom: 16, border: `1.5px solid ${tieneNuevas ? '#f9a825' : '#e0ede6'}`, borderRadius: 10, overflow: 'hidden' }}>
                        <div style={{ background: tieneNuevas ? '#fffbea' : '#f0f7f3', padding: '8px 12px', display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span style={{ fontSize: 14 }}>👤</span>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            {nombre && <div style={{ fontSize: 12, fontWeight: 700, color: '#1a3d2b' }}>{nombre}</div>}
                            <div style={{ fontSize: 11, color: '#666', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{email}</div>
                          </div>
                          {tieneNuevas && <span style={{ background: '#c0392b', color: 'white', borderRadius: 20, padding: '1px 7px', fontSize: 10, fontWeight: 700, flexShrink: 0 }}>nueva</span>}
                        </div>
                        <div style={{ padding: '8px 10px' }}>
                          {hilo.map(item =>
                            item.tipo === 'enviado' ? renderMsgAdmin(item.data) : renderRespuesta(item.data)
                          )}
                        </div>
                      </div>
                    )
                  })}

                  {/* Respuestas sin mensaje previo (espontáneas) */}
                  {respuestasUsuarios.filter(r => !destinatariosIndividuales.includes(r.de_email)).map(r => {
                    const nombre = getNombre(r.de_email)
                    return (
                      <div key={r.id} style={{ marginBottom: 16, border: `1.5px solid ${r.leido ? '#e0ede6' : '#f9a825'}`, borderRadius: 10, overflow: 'hidden' }}>
                        <div style={{ background: r.leido ? '#f0f7f3' : '#fffbea', padding: '8px 12px', display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span style={{ fontSize: 14 }}>👤</span>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            {nombre && <div style={{ fontSize: 12, fontWeight: 700, color: '#1a3d2b' }}>{nombre}</div>}
                            <div style={{ fontSize: 11, color: '#666' }}>{r.de_email}</div>
                          </div>
                        </div>
                        <div style={{ padding: '8px 10px' }}>{renderRespuesta(r)}</div>
                      </div>
                    )
                  })}
                </div>
              )
            })()}
          </div>
        )}
    </div>
  )
}
