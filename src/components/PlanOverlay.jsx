const ADMIN_EMAIL = 'psicologohernanstagni@gmail.com'

// Overlay inline que aparece sobre el contenido restringido sin sacar al usuario de la sección
export default function PlanOverlay({ tipo = 'video', onClose }) {
  const mensajes = {
    video: { emoji: '🎬', titulo: 'Vista previa finalizada', desc: 'Has llegado al límite de 4 minutos del plan Trial.' },
    audio: { emoji: '🎵', titulo: 'Vista previa finalizada', desc: 'Has llegado al límite de 4 minutos del plan Trial.' },
    descarga: { emoji: '📥', titulo: 'Descarga no disponible', desc: 'Tu plan actual no incluye la descarga de archivos.' },
  }
  const { emoji, titulo, desc } = mensajes[tipo] || mensajes.video

  return (
    <div style={{
      position: 'absolute', inset: 0,
      background: 'rgba(26,61,43,0.92)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 20, borderRadius: 'inherit',
      backdropFilter: 'blur(4px)',
    }}>
      <div style={{
        background: 'white', borderRadius: 16,
        padding: '28px 28px 24px',
        maxWidth: 340, width: '90%',
        textAlign: 'center',
        display: 'flex', flexDirection: 'column', gap: 12,
        boxShadow: '0 8px 40px rgba(0,0,0,0.35)',
      }}>
        <div style={{ fontSize: 40 }}>{emoji}</div>
        <div style={{ fontWeight: 800, fontSize: '1.05rem', color: '#1a3d2b' }}>{titulo}</div>
        <div style={{ fontSize: '0.88rem', color: '#555', lineHeight: 1.6 }}>
          {desc}<br />
          Para continuar, mejorá tu plan o contactate con el administrador:
        </div>
        <a
          href={`mailto:${ADMIN_EMAIL}`}
          style={{
            color: '#2d5a3d', fontWeight: 700,
            fontSize: '0.88rem', wordBreak: 'break-all',
          }}
        >
          {ADMIN_EMAIL}
        </a>
        {onClose && (
          <button
            onClick={onClose}
            style={{
              marginTop: 4, padding: '8px 0',
              background: 'none', border: '1.5px solid #ccc',
              borderRadius: 8, cursor: 'pointer',
              fontSize: '0.85rem', color: '#888',
            }}
          >
            Cerrar
          </button>
        )}
      </div>
    </div>
  )
}
