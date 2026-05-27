import { useState, useEffect } from 'react'
import { supabase, APP_URL, REGISTRO_ABIERTO, DIAS_TRIAL } from '../lib/supabase'
import { checkUserAccess, registrarOActualizarUsuario, checkIsAdmin } from '../lib/auth'

export let isAdmin = false

export default function AuthGate({ children, onAuthReady }) {
  const [estado, setEstado] = useState('cargando') // 'cargando'|'login'|'app'|'vencido'
  const [modo, setModo] = useState('login') // 'login'|'register'|'reset'|'newpassword'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [nombre, setNombre] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [error, setError] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [cargando, setCargando] = useState(false)
  const [mostrarPwd, setMostrarPwd] = useState(false)
  const [isAdminUser, setIsAdminUser] = useState(false)

  useEffect(() => { inicializar() }, [])

  async function inicializar() {
    if (!supabase) {
      // Sin Supabase configurado, dejar pasar (modo desarrollo)
      setEstado('app')
      return
    }

    // Detectar recovery desde hash
    const h = window.location.hash.slice(1)
    if (h.includes('type=recovery') && h.includes('access_token=')) {
      try {
        const params = new URLSearchParams(h)
        const accessToken = params.get('access_token')
        const refreshToken = params.get('refresh_token') || ''
        if (accessToken) await supabase.auth.setSession({ access_token: accessToken, refresh_token: refreshToken })
      } catch(e) { console.warn(e) }
      setModo('newpassword')
      setEstado('login')
      return
    }

    const { data: { session } } = await supabase.auth.getSession()
    if (session) {
      await registrarOActualizarUsuario(session.user.email)
      const access = await checkUserAccess(session.user.email)
      const adminResult = await checkIsAdmin(session.user.email)
      isAdmin = adminResult
      setIsAdminUser(adminResult)
      if (onAuthReady) onAuthReady(adminResult, session.user.email)
      setEstado(access === 'expired' ? 'vencido' : 'app')
    } else {
      setEstado('login')
    }
  }

  async function handleSubmit() {
    if (!email || !password) { setError('Completá email y contraseña.'); return }
    if (password.length < 6) { setError('La contraseña debe tener al menos 6 caracteres.'); return }
    if (modo === 'register' && !nombre.trim()) { setError('Ingresá tu nombre y apellido.'); return }
    if (modo === 'register' && !REGISTRO_ABIERTO) {
      setError('El registro está deshabilitado. Contactá al administrador.'); return
    }
    setError(''); setMensaje(''); setCargando(true)

    let result
    if (modo === 'login') {
      result = await supabase.auth.signInWithPassword({ email, password })
    } else {
      result = await supabase.auth.signUp({ email, password, options: { emailRedirectTo: APP_URL } })
    }

    setCargando(false)
    if (result.error) { setError(tradAuth(result.error.message)); return }

    if (modo === 'register' && !result.data.session) {
      setMensaje('✅ Cuenta creada. Revisá tu email para confirmar.')
      return
    }

    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      await registrarOActualizarUsuario(user.email, modo === 'register' ? nombre.trim() : undefined)
      const access = await checkUserAccess(user.email)
      const adminResult = await checkIsAdmin(user.email)
      isAdmin = adminResult
      setIsAdminUser(adminResult)
      if (onAuthReady) onAuthReady(adminResult, user.email)
      setEstado(access === 'expired' ? 'vencido' : 'app')
    }
  }

  async function handleReset() {
    if (!email) { setError('Ingresá tu email primero.'); return }
    setCargando(true)
    const [{ error: err }] = await Promise.all([
      supabase.auth.resetPasswordForEmail(email, { redirectTo: APP_URL }),
      new Promise(r => setTimeout(r, 1500))
    ])
    setCargando(false)
    if (err) setError('Error al enviar. Verificá el email.')
    else setMensaje('✅ Revisá tu email para restablecer la contraseña.')
  }

  async function handleNewPassword() {
    if (!newPassword || newPassword.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.'); return
    }
    setCargando(true)
    const { error: err } = await supabase.auth.updateUser({ password: newPassword })
    setCargando(false)
    if (err) { setError('Error: ' + err.message); return }
    setMensaje('✅ Contraseña actualizada. Iniciando sesión...')
    window.history.replaceState(null, '', window.location.pathname)
    setTimeout(async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const adminResult = await checkIsAdmin(user.email)
        isAdmin = adminResult
        setIsAdminUser(adminResult)
        if (onAuthReady) onAuthReady(adminResult)
      }
      setEstado('app')
    }, 1500)
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    isAdmin = false
    setIsAdminUser(false)
    setEstado('login')
    setModo('login')
    setEmail(''); setPassword(''); setNombre(''); setError(''); setMensaje('')
  }

  window.cerrarSesion = handleLogout

  // ── PANTALLA CARGANDO ──
  if (estado === 'cargando') return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      height: '100vh', background: '#1e3d2b', color: 'white',
      fontSize: '1.1rem', fontFamily: 'sans-serif', gap: '12px'
    }}>
      <div style={{
        width: 28, height: 28, border: '3px solid rgba(255,255,255,0.3)',
        borderTop: '3px solid white', borderRadius: '50%',
        animation: 'spin 0.8s linear infinite'
      }} />
      Verificando acceso...
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )

  // ── APP ACTIVA ──
  if (estado === 'app') return children

  // ── TRIAL VENCIDO ──
  if (estado === 'vencido') return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      height: '100vh', background: '#1e3d2b', fontFamily: 'sans-serif'
    }}>
      <div style={{
        background: 'white', borderRadius: 16, padding: '40px 36px',
        maxWidth: 400, width: '100%', textAlign: 'center',
        display: 'flex', flexDirection: 'column', gap: 20
      }}>
        <div style={{ fontSize: 48 }}>⏰</div>
        <h2 style={{ margin: 0, color: '#1e3d2b' }}>Período de prueba vencido</h2>
        <p style={{ margin: 0, lineHeight: 1.6, color: '#666' }}>
          Tu acceso de {DIAS_TRIAL} días ha finalizado.<br />
          Contactá al administrador para continuar:<br />
          <strong>psicologohernanstagni@gmail.com</strong>
        </p>
        <button onClick={handleLogout} style={{
          padding: 12, background: '#2d5a3d', color: 'white',
          border: 'none', borderRadius: 8, cursor: 'pointer',
          fontWeight: 600, fontSize: '0.95rem'
        }}>
          Cerrar sesión
        </button>
      </div>
    </div>
  )

  // ── PANTALLA LOGIN / REGISTRO / RESET ──
  const inputStyle = {
    padding: '10px 14px', border: '1.5px solid #ccc',
    borderRadius: 8, fontSize: '0.95rem', outline: 'none',
    width: '100%', boxSizing: 'border-box', fontFamily: 'sans-serif'
  }
  const labelStyle = { fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', color: '#444' }

  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      minHeight: '100vh', background: '#1e3d2b', fontFamily: 'sans-serif',
      padding: '20px'
    }}>
      <div style={{
        background: 'white', borderRadius: 16, padding: '40px 36px',
        width: '100%', maxWidth: 380, display: 'flex', flexDirection: 'column', gap: 18,
        boxShadow: '0 8px 40px rgba(0,0,0,0.35)'
      }}>
        {/* Título */}
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>🌿</div>
          <h2 style={{ margin: '0 0 4px', fontSize: '1.4rem', color: '#1e3d2b' }}>
            {modo === 'login' ? 'Bienvenido'
              : modo === 'register' ? 'Crear cuenta'
              : modo === 'reset' ? 'Recuperar contraseña'
              : 'Nueva contraseña'}
          </h2>
          <p style={{ margin: 0, color: '#666', fontSize: '0.85rem' }}>
            {modo === 'login' ? 'Ingresá con tu cuenta'
              : modo === 'register' ? 'Creá tu cuenta gratuita'
              : modo === 'reset' ? 'Te enviaremos un link a tu email'
              : 'Elegí tu nueva contraseña'}
          </p>
        </div>

        {/* Campo email */}
        {modo !== 'newpassword' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={labelStyle}>Email</label>
            <input
              type="email" value={email}
              onChange={e => setEmail(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && (modo === 'reset' ? handleReset() : handleSubmit())}
              placeholder="tu@email.com"
              style={inputStyle}
            />
          </div>
        )}

        {/* Campo nombre (solo registro) */}
        {modo === 'register' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={labelStyle}>Nombre y Apellido</label>
            <input
              type="text" value={nombre}
              onChange={e => setNombre(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()}
              placeholder="Juan Pérez"
              style={inputStyle}
            />
          </div>
        )}

        {/* Campo contraseña */}
        {(modo === 'login' || modo === 'register') && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={labelStyle}>Contraseña</label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <input
                type={mostrarPwd ? 'text' : 'password'} value={password}
                onChange={e => setPassword(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                style={{ ...inputStyle, paddingRight: 42 }}
              />
              <button type="button" onClick={() => setMostrarPwd(!mostrarPwd)}
                style={{
                  position: 'absolute', right: 0, width: 40,
                  background: 'none', border: 'none', cursor: 'pointer', fontSize: 18
                }}>
                {mostrarPwd ? '🙈' : '👁'}
              </button>
            </div>
          </div>
        )}

        {/* Campo nueva contraseña */}
        {modo === 'newpassword' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={labelStyle}>Nueva contraseña</label>
            <input
              type="password" value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleNewPassword()}
              autoFocus
              style={inputStyle}
            />
          </div>
        )}

        {/* Error */}
        {error && (
          <div style={{
            color: '#c0392b', background: '#fdecea', borderRadius: 6,
            padding: '8px 12px', fontSize: '0.85rem', textAlign: 'center'
          }}>
            {error}
          </div>
        )}

        {/* Mensaje éxito */}
        {mensaje && (
          <div style={{
            color: '#2d5a3d', background: '#d4e6da', borderRadius: 6,
            padding: '8px 12px', fontSize: '0.85rem', textAlign: 'center'
          }}>
            {mensaje}
          </div>
        )}

        {/* Botón principal */}
        <button
          disabled={cargando}
          onClick={
            modo === 'reset' ? handleReset
              : modo === 'newpassword' ? handleNewPassword
              : handleSubmit
          }
          style={{
            padding: 12,
            background: cargando ? '#aaa' : '#2d5a3d',
            color: 'white', border: 'none', borderRadius: 8,
            fontSize: '0.95rem', fontWeight: 600,
            cursor: cargando ? 'not-allowed' : 'pointer',
            transition: 'background 0.2s'
          }}
        >
          {cargando ? 'Procesando...'
            : modo === 'login' ? 'Ingresar'
            : modo === 'register' ? 'Crear cuenta'
            : modo === 'reset' ? 'Enviar link'
            : 'Guardar contraseña'}
        </button>

        {/* Toggle login/registro */}
        {REGISTRO_ABIERTO && (modo === 'login' || modo === 'register') && (
          <p style={{ margin: 0, fontSize: '0.83rem', color: '#666', textAlign: 'center' }}>
            {modo === 'login' ? '¿No tenés cuenta? ' : '¿Ya tenés cuenta? '}
            <a onClick={() => { setModo(modo === 'login' ? 'register' : 'login'); setError(''); setMensaje('') }}
              style={{ color: '#2d5a3d', cursor: 'pointer', fontWeight: 600 }}>
              {modo === 'login' ? 'Registrate' : 'Ingresá'}
            </a>
          </p>
        )}

        {/* Olvidé mi contraseña */}
        {(modo === 'login' || modo === 'register') && (
          <p style={{ margin: 0, fontSize: '0.83rem', color: '#666', textAlign: 'center' }}>
            <a onClick={() => { setModo('reset'); setError(''); setMensaje('') }}
              style={{ color: '#2d5a3d', cursor: 'pointer' }}>
              ¿Olvidaste tu contraseña?
            </a>
          </p>
        )}

        {/* Volver al login */}
        {modo === 'reset' && (
          <p style={{ margin: 0, fontSize: '0.83rem', color: '#666', textAlign: 'center' }}>
            <a onClick={() => { setModo('login'); setError(''); setMensaje('') }}
              style={{ color: '#2d5a3d', cursor: 'pointer' }}>
              ← Volver al login
            </a>
          </p>
        )}
      </div>
    </div>
  )
}

function tradAuth(msg) {
  const map = {
    'Invalid login credentials': 'Email o contraseña incorrectos.',
    'Email not confirmed': 'Confirmá tu email antes de ingresar.',
    'User already registered': 'Ese email ya está registrado.',
    'Password should be': 'La contraseña debe tener al menos 6 caracteres.',
    'Unable to validate email address': 'Email inválido.',
    'Signup is disabled': 'El registro está deshabilitado.',
    'Email rate limit exceeded': 'Demasiados intentos. Esperá unos minutos.',
  }
  for (const [key, val] of Object.entries(map)) {
    if (msg.includes(key)) return val
  }
  return msg
}
