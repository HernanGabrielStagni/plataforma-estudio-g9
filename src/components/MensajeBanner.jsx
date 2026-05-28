import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

const DISMISSED_KEY = 'g9_mensajes_vistos'

function getDismissed() {
  try { return JSON.parse(localStorage.getItem(DISMISSED_KEY) || '[]') } catch { return [] }
}
function addDismissed(id) {
  const list = getDismissed()
  if (!list.includes(id)) localStorage.setItem(DISMISSED_KEY, JSON.stringify([...list, id]))
}

export default function MensajeBanner({ userEmail, userName }) {
  const [mensajes, setMensajes] = useState([])
  const [idx, setIdx] = useState(0)
  const [respuesta, setRespuesta] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [enviado, setEnviado] = useState(false)

  useEffect(() => {
    if (!userEmail || !supabase) return
    async function cargar() {
      const { data } = await supabase
        .from('mensajes_admin')
        .select('id, contenido, created_at')
        .eq('activo', true)
        .or(`destinatario.eq.todos,destinatario.eq.${userEmail}`)
        .order('created_at', { ascending: false })
      if (!data) return
      const vistos = getDismissed()
      setMensajes(data.filter(m => !vistos.includes(m.id)))
    }
    cargar()
  }, [userEmail])

  if (!mensajes.length) return null
  const msg = mensajes[idx]

  function cerrar() {
    addDismissed(msg.id)
    const resto = mensajes.filter(m => m.id !== msg.id)
    setMensajes(resto)
    setIdx(0)
    setRespuesta('')
    setEnviado(false)
  }

  async function enviarRespuesta() {
    if (!respuesta.trim()) return
    setEnviando(true)
    await supabase.from('mensajes_usuarios').insert({
      de_email: userEmail,
      de_nombre: userName || null,
      contenido: respuesta.trim(),
    })
    setEnviando(false)
    setEnviado(true)
    setRespuesta('')
    setTimeout(cerrar, 1800)
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 20,
    }}>
      <div style={{
        background: 'linear-gradient(135deg, #1a3d2b 0%, #2d5a3d 100%)',
        borderRadius: 20, padding: '32px 28px', maxWidth: 460, width: '100%',
        boxShadow: '0 20px 60px rgba(0,0,0,0.5), 0 0 0 2px rgba(201,168,76,0.4)',
        animation: 'msgPulse 2s ease-in-out infinite',
        display: 'flex', flexDirection: 'column', gap: 18,
      }}>
        <style>{`
          @keyframes msgPulse {
            0%, 100% { box-shadow: 0 20px 60px rgba(0,0,0,0.5), 0 0 0 2px rgba(201,168,76,0.4); }
            50%       { box-shadow: 0 20px 60px rgba(0,0,0,0.5), 0 0 0 4px rgba(201,168,76,0.8), 0 0 30px rgba(201,168,76,0.2); }
          }
        `}</style>

        {/* Encabezado */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 40, height: 40, borderRadius: '50%', flexShrink: 0,
            background: 'rgba(201,168,76,0.2)', border: '2px solid rgba(201,168,76,0.5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20
          }}>✉️</div>
          <div>
            <div style={{ color: '#c9a84c', fontWeight: 700, fontSize: 13, letterSpacing: '0.1em' }}>
              MENSAJE DE HERNÁN STAGNI
            </div>
            <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 10 }}>
              {new Date(msg.created_at).toLocaleDateString('es-AR', { day: '2-digit', month: 'long', year: 'numeric' })}
            </div>
          </div>
          {mensajes.length > 1 && (
            <div style={{ marginLeft: 'auto', color: 'rgba(255,255,255,0.4)', fontSize: 11 }}>
              {idx + 1}/{mensajes.length}
            </div>
          )}
        </div>

        {/* Mensaje */}
        <div style={{
          background: 'rgba(255,255,255,0.07)', borderRadius: 12,
          padding: '16px 18px', color: 'white', fontSize: 14, lineHeight: 1.7,
          borderLeft: '3px solid rgba(201,168,76,0.6)',
          whiteSpace: 'pre-wrap',
        }}>
          {msg.contenido}
        </div>

        {/* Respuesta */}
        {!enviado ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: 11, fontWeight: 600, letterSpacing: '0.1em' }}>
              TU RESPUESTA (opcional)
            </label>
            <textarea
              value={respuesta}
              onChange={e => setRespuesta(e.target.value)}
              placeholder="Escribí tu respuesta aquí..."
              rows={3}
              style={{
                background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: 10, padding: '10px 14px', color: 'white',
                fontSize: 13, resize: 'none', outline: 'none', fontFamily: 'sans-serif',
              }}
            />
          </div>
        ) : (
          <div style={{
            background: 'rgba(201,168,76,0.15)', borderRadius: 10, padding: '12px 16px',
            color: '#c9a84c', fontWeight: 600, textAlign: 'center', fontSize: 13,
          }}>
            ✅ Respuesta enviada. ¡Gracias!
          </div>
        )}

        {/* Botones */}
        {!enviado && (
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={cerrar} style={{
              flex: 1, padding: '10px', borderRadius: 10,
              background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)',
              color: 'rgba(255,255,255,0.7)', cursor: 'pointer', fontSize: 13, fontWeight: 600,
            }}>
              Cerrar sin responder
            </button>
            {respuesta.trim() && (
              <button onClick={enviarRespuesta} disabled={enviando} style={{
                flex: 1, padding: '10px', borderRadius: 10,
                background: enviando ? '#666' : '#c9a84c', border: 'none',
                color: '#1a3d2b', cursor: enviando ? 'not-allowed' : 'pointer',
                fontSize: 13, fontWeight: 700,
              }}>
                {enviando ? 'Enviando...' : 'Enviar respuesta'}
              </button>
            )}
          </div>
        )}

        {/* Navegación si hay varios mensajes */}
        {mensajes.length > 1 && !enviado && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: 8 }}>
            {mensajes.map((_, i) => (
              <button key={i} onClick={() => setIdx(i)} style={{
                width: 8, height: 8, borderRadius: '50%', border: 'none', cursor: 'pointer',
                background: i === idx ? '#c9a84c' : 'rgba(255,255,255,0.2)',
                padding: 0,
              }} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
