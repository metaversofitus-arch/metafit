'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function Home() {
  const [mode, setMode] = useState('landing')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleLogin = async (e) => {
    e.preventDefault(); setLoading(true); setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) { setError(error.message); setLoading(false); return }
    router.push('/dashboard')
  }

  const handleSignup = async (e) => {
    e.preventDefault(); setLoading(true); setError('')
    const { data, error } = await supabase.auth.signUp({ email, password })
    if (error) { setError(error.message); setLoading(false); return }
    if (data.user) {
      await supabase.from('profiles').upsert({ id: data.user.id, email, name, plan: 'basic', gender: 'male', frequency: 'F3', archetype: 'street', training_level: 'beginner', goal: 'volume' }, { onConflict: 'id' })
      router.push('/onboarding')
    }
  }

  const inp = { background: '#0a0404', border: '1px solid #2a1010', color: '#e8edf2', padding: '0.75rem 1rem', width: '100%', fontFamily: 'Barlow,sans-serif', fontSize: '0.95rem', outline: 'none', display: 'block' }
  const lbl = { fontSize: '0.68rem', letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: '#6b4040', display: 'block', marginBottom: '6px' }

  // ── AUTH SCREEN ──
  if (mode !== 'landing') return (
    <div style={{ minHeight: '100vh', background: '#050202', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'fixed', inset: 0, backgroundImage: 'radial-gradient(ellipse at 50% -10%, rgba(183,28,28,0.15) 0%, transparent 60%)', pointerEvents: 'none' }} />
      <div style={{ position: 'fixed', inset: 0, backgroundImage: 'linear-gradient(rgba(42,16,16,0.5) 1px,transparent 1px),linear-gradient(90deg,rgba(42,16,16,0.5) 1px,transparent 1px)', backgroundSize: '40px 40px', pointerEvents: 'none', opacity: 0.4 }} />

      <div style={{ width: '100%', maxWidth: '400px', position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{ marginBottom: '8px' }}>
            <span style={{ fontFamily: 'Barlow Condensed,sans-serif', fontWeight: 900, fontSize: '2.5rem', color: '#e8edf2', letterSpacing: '0.05em' }}>META</span>
            <span style={{ fontFamily: 'Barlow Condensed,sans-serif', fontWeight: 900, fontSize: '2.5rem', color: '#b71c1c', letterSpacing: '0.05em', textShadow: '0 0 30px rgba(183,28,28,0.6)' }}>FIT</span>
          </div>
          <p style={{ color: '#6b4040', fontSize: '0.75rem', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
            {mode === 'login' ? 'Accede a tu protocolo' : 'Activa tu mutación'}
          </p>
        </div>

        <div style={{ background: '#0a0404', border: '1px solid #2a1010', padding: '2rem', position: 'relative' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'linear-gradient(90deg,transparent,#b71c1c,transparent)' }} />
          <form onSubmit={mode === 'login' ? handleLogin : handleSignup}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {mode === 'signup' && <div>
                <label style={lbl}>Nombre</label>
                <input value={name} onChange={e => setName(e.target.value)} placeholder="Tu nombre" required style={inp} />
              </div>}
              <div>
                <label style={lbl}>Email</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="tu@email.com" required style={inp} />
              </div>
              <div>
                <label style={lbl}>Contraseña</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required style={inp} />
              </div>
              {error && <div style={{ background: 'rgba(183,28,28,0.1)', border: '1px solid rgba(183,28,28,0.3)', padding: '0.75rem', color: '#ff5252', fontSize: '0.82rem' }}>{error}</div>}
              <button type="submit" disabled={loading} style={{ background: loading ? '#2a1010' : '#b71c1c', color: '#fff', fontFamily: 'Barlow Condensed,sans-serif', fontWeight: 700, fontSize: '1rem', letterSpacing: '0.1em', textTransform: 'uppercase', padding: '0.9rem', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', marginTop: '0.5rem', clipPath: 'polygon(8px 0%,100% 0%,calc(100% - 8px) 100%,0% 100%)', boxShadow: loading ? 'none' : '0 0 20px rgba(183,28,28,0.3)', transition: 'all 0.2s' }}>
                {loading ? 'Cargando...' : mode === 'login' ? 'Entrar al protocolo' : 'Iniciar mutación'}
              </button>
            </div>
          </form>
          <p style={{ textAlign: 'center', marginTop: '1.5rem', color: '#6b4040', fontSize: '0.82rem' }}>
            {mode === 'login' ? '¿Sin cuenta? ' : '¿Ya tienes cuenta? '}
            <button onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError('') }} style={{ color: '#b71c1c', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'Barlow,sans-serif' }}>
              {mode === 'login' ? 'Crear cuenta' : 'Iniciar sesión'}
            </button>
          </p>
        </div>
        <p style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <button onClick={() => setMode('landing')} style={{ color: '#3d2020', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'Barlow,sans-serif', fontSize: '0.82rem' }}>← Volver</button>
        </p>
      </div>
    </div>
  )

  // ── LANDING ──
  return (
    <div style={{ minHeight: '100vh', background: '#050202', overflowX: 'hidden', fontFamily: 'Barlow,sans-serif', color: '#e8edf2' }}>

      {/* Organic fiber BG SVG */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', overflow: 'hidden' }}>
        <svg viewBox="0 0 1000 1000" preserveAspectRatio="xMidYMid slice" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.12 }}>
          <defs>
            <radialGradient id="rg1" cx="50%" cy="40%" r="60%">
              <stop offset="0%" stopColor="#b71c1c" stopOpacity="1" />
              <stop offset="100%" stopColor="#050202" stopOpacity="0" />
            </radialGradient>
            <filter id="blur1"><feGaussianBlur stdDeviation="8" /></filter>
          </defs>
          <ellipse cx="500" cy="400" rx="300" ry="200" fill="url(#rg1)" filter="url(#blur1)" />
          {/* Fiber lines */}
          {[...Array(12)].map((_, i) => {
            const angle = (i / 12) * Math.PI * 2
            const x1 = 500 + Math.cos(angle) * 80, y1 = 400 + Math.sin(angle) * 60
            const x2 = 500 + Math.cos(angle) * 480, y2 = 400 + Math.sin(angle) * 400
            const cx1 = 500 + Math.cos(angle + 0.5) * 200, cy1 = 400 + Math.sin(angle + 0.5) * 150
            return <path key={i} d={`M ${x1} ${y1} Q ${cx1} ${cy1} ${x2} ${y2}`} stroke="#b71c1c" strokeWidth="1.5" fill="none" opacity="0.6" />
          })}
          {[...Array(8)].map((_, i) => {
            const angle = (i / 8) * Math.PI * 2 + 0.2
            const x1 = 500 + Math.cos(angle) * 60, y1 = 400 + Math.sin(angle) * 45
            const x2 = 500 + Math.cos(angle) * 420, y2 = 400 + Math.sin(angle) * 360
            const cx1 = 500 + Math.cos(angle - 0.4) * 180, cy1 = 400 + Math.sin(angle - 0.4) * 130
            return <path key={i} d={`M ${x1} ${y1} Q ${cx1} ${cy1} ${x2} ${y2}`} stroke="#ff1744" strokeWidth="0.8" fill="none" opacity="0.3" />
          })}
        </svg>
        {/* Central glow */}
        <div style={{ position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(183,28,28,0.15) 0%, transparent 65%)', borderRadius: '50%' }} />
        {/* Grid */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(42,16,16,0.4) 1px,transparent 1px),linear-gradient(90deg,rgba(42,16,16,0.4) 1px,transparent 1px)', backgroundSize: '60px 60px', opacity: 0.5 }} />
      </div>

      {/* NAV */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.25rem 2rem', borderBottom: '1px solid rgba(42,16,16,0.8)', background: 'rgba(5,2,2,0.88)', backdropFilter: 'blur(16px)' }}>
        <div>
          <span style={{ fontFamily: 'Barlow Condensed,sans-serif', fontWeight: 900, fontSize: '1.7rem', color: '#e8edf2', letterSpacing: '0.05em' }}>META</span>
          <span style={{ fontFamily: 'Barlow Condensed,sans-serif', fontWeight: 900, fontSize: '1.7rem', color: '#b71c1c', letterSpacing: '0.05em', textShadow: '0 0 20px rgba(183,28,28,0.5)' }}>FIT</span>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <button onClick={() => setMode('login')} style={{ background: 'transparent', color: '#e8edf2', fontFamily: 'Barlow Condensed,sans-serif', fontWeight: 600, fontSize: '0.9rem', letterSpacing: '0.08em', textTransform: 'uppercase', padding: '0.5rem 1.25rem', border: '1px solid #2a1010', cursor: 'pointer' }}>Log in</button>
          <button onClick={() => setMode('signup')} style={{ background: '#b71c1c', color: '#fff', fontFamily: 'Barlow Condensed,sans-serif', fontWeight: 700, fontSize: '0.9rem', letterSpacing: '0.08em', textTransform: 'uppercase', padding: '0.5rem 1.25rem', border: 'none', cursor: 'pointer', clipPath: 'polygon(6px 0%,100% 0%,calc(100% - 6px) 100%,0% 100%)', boxShadow: '0 0 15px rgba(183,28,28,0.3)' }}>Empezar</button>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ position: 'relative', zIndex: 1, paddingTop: '9rem', paddingBottom: '5rem', textAlign: 'center', padding: '9rem 2rem 5rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(183,28,28,0.08)', border: '1px solid rgba(183,28,28,0.2)', padding: '4px 16px', marginBottom: '2rem' }}>
          <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#b71c1c', boxShadow: '0 0 8px #b71c1c' }} />
          <span style={{ fontFamily: 'Barlow Condensed,sans-serif', fontSize: '0.72rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: '#b71c1c' }}>LeanGain Protocol — Activo</span>
        </div>

        <h1 style={{ fontFamily: 'Barlow Condensed,sans-serif', fontWeight: 900, fontSize: 'clamp(3.5rem,12vw,9rem)', lineHeight: 0.85, letterSpacing: '-0.02em', marginBottom: '1.75rem', textTransform: 'uppercase' }}>
          <span style={{ color: '#e8edf2', display: 'block' }}>Activa</span>
          <span style={{ color: '#b71c1c', display: 'block', textShadow: '0 0 60px rgba(183,28,28,0.6), 0 0 120px rgba(183,28,28,0.3)' }}>tu</span>
          <span style={{ color: '#e8edf2', display: 'block' }}>mutación</span>
        </h1>

        <p style={{ color: '#8b5a5a', fontSize: '1.05rem', maxWidth: '480px', margin: '0 auto 2.5rem', lineHeight: 1.75 }}>
          Protocolo F3/F4 + nutrición LeanGain. Coach IA con identidad propia. Corrección de técnica en tiempo real.
        </p>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button onClick={() => setMode('signup')} style={{ background: '#b71c1c', color: '#fff', fontFamily: 'Barlow Condensed,sans-serif', fontWeight: 700, fontSize: '1.1rem', letterSpacing: '0.1em', textTransform: 'uppercase', padding: '0.95rem 2.5rem', border: 'none', cursor: 'pointer', clipPath: 'polygon(10px 0%,100% 0%,calc(100% - 10px) 100%,0% 100%)', boxShadow: '0 0 40px rgba(183,28,28,0.4), 0 0 80px rgba(183,28,28,0.2)' }}>
            Empezar gratis 3 días
          </button>
          <button onClick={() => setMode('login')} style={{ background: 'transparent', color: '#8b5a5a', fontFamily: 'Barlow Condensed,sans-serif', fontWeight: 600, fontSize: '1rem', letterSpacing: '0.08em', textTransform: 'uppercase', padding: '0.95rem 2rem', border: '1px solid #2a1010', cursor: 'pointer' }}>
            Ya tengo cuenta →
          </button>
        </div>

        {/* Stats */}
        <div style={{ display: 'flex', gap: '3rem', justifyContent: 'center', marginTop: '4.5rem', flexWrap: 'wrap' }}>
          {[['F3/F4','Frecuencia pierna'],['150-260g','Proteína diaria'],['90 días','Resultados reales'],['6','Arquetipos']].map(([v, l]) => (
            <div key={l} style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'Barlow Condensed,sans-serif', fontWeight: 900, fontSize: '2rem', color: '#b71c1c', textShadow: '0 0 20px rgba(183,28,28,0.4)' }}>{v}</div>
              <div style={{ fontSize: '0.68rem', color: '#6b4040', letterSpacing: '0.08em', textTransform: 'uppercase', marginTop: '3px' }}>{l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ARQUETIPOS */}
      <section style={{ position: 'relative', zIndex: 1, padding: '4rem 2rem', maxWidth: '1000px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div style={{ display: 'inline-block', background: 'rgba(183,28,28,0.06)', border: '1px solid rgba(183,28,28,0.15)', padding: '3px 14px', marginBottom: '1rem' }}>
            <span style={{ fontFamily: 'Barlow Condensed,sans-serif', fontSize: '0.68rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#b71c1c' }}>Sistema de evolución</span>
          </div>
          <h2 style={{ fontFamily: 'Barlow Condensed,sans-serif', fontWeight: 900, fontSize: 'clamp(2rem,5vw,3.5rem)', textTransform: 'uppercase', lineHeight: 0.95 }}>
            6 arquetipos.<br /><span style={{ color: '#b71c1c' }}>Un camino.</span>
          </h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(150px,1fr))', gap: '0.75rem' }}>
          {[
            {e:'🌑',n:'Street Dark',m:'No me detengo.'},
            {e:'🧪',n:'Biohacker',m:'Todo se mide.'},
            {e:'🧠',n:'Neural Elite',m:'Me reprogramo.'},
            {e:'🧬',n:'Symbionte',m:'Me adapto.'},
            {e:'⚔️',n:'Cyber-Gladiator',m:'Compito para ganar.'},
            {e:'🔱',n:'Titán',m:'Dejo marca.'},
          ].map((a, i) => (
            <div key={a.n} style={{ background: '#080404', border: '1px solid #1a0a0a', padding: '1.25rem 1rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '1px', background: 'linear-gradient(90deg,transparent,rgba(183,28,28,0.4),transparent)' }} />
              <div style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>{a.e}</div>
              <div style={{ fontFamily: 'Barlow Condensed,sans-serif', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#e8edf2', marginBottom: '3px' }}>{a.n}</div>
              <div style={{ fontFamily: 'Barlow Condensed,sans-serif', fontWeight: 600, fontSize: '0.7rem', color: '#b71c1c', fontStyle: 'italic' }}>"{a.m}"</div>
              {i < 5 && <div style={{ position: 'absolute', right: '-8px', top: '50%', transform: 'translateY(-50%)', color: '#2a1010', fontSize: '0.7rem', zIndex: 2 }}>→</div>}
            </div>
          ))}
        </div>
        <p style={{ textAlign: 'center', color: '#6b4040', fontSize: '0.8rem', marginTop: '1.25rem', letterSpacing: '0.05em' }}>Street Dark → Biohacker → Neural Elite → Symbionte → Cyber-Gladiator → Titán</p>
      </section>

      {/* FEATURES */}
      <section style={{ position: 'relative', zIndex: 1, padding: '3rem 2rem', maxWidth: '1000px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: '1.25rem' }}>
          {[
            {i:'🏋️',t:'Plan F3/F4',d:'Circuitos con carga progresiva. 6 semanas de entrenamiento fuerte + semana de descarga.'},
            {i:'🥩',t:'LeanGain Nutrición',d:'150-260g proteína diaria. Sincronizada con tu plan. Calculadora personalizada.'},
            {i:'🎮',t:'Coach con identidad',d:'Tu coach tiene un arquetipo, un mantra y un estilo de comunicación único.'},
            {i:'📸',t:'Corrección de técnica',d:'Grábate 60s o usa la cámara en vivo. Tu coach analiza y corrige tu postura.'},
          ].map(f => (
            <div key={f.t} style={{ background: '#080404', border: '1px solid #1a0a0a', padding: '1.5rem', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '1px', background: 'linear-gradient(90deg,transparent,rgba(183,28,28,0.3),transparent)' }} />
              <div style={{ fontSize: '1.75rem', marginBottom: '0.75rem' }}>{f.i}</div>
              <h3 style={{ fontFamily: 'Barlow Condensed,sans-serif', fontWeight: 700, fontSize: '1.1rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem', color: '#e8edf2' }}>{f.t}</h3>
              <p style={{ color: '#6b4040', fontSize: '0.85rem', lineHeight: 1.65 }}>{f.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PRICING */}
      <section style={{ position: 'relative', zIndex: 1, padding: '4rem 2rem', textAlign: 'center' }}>
        <h2 style={{ fontFamily: 'Barlow Condensed,sans-serif', fontWeight: 900, fontSize: 'clamp(2rem,5vw,3rem)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Planes</h2>
        <p style={{ color: '#6b4040', marginBottom: '3rem', fontSize: '0.9rem' }}>Sin tarjeta. 3 días gratis. Cancelas cuando quieras.</p>
        <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap', maxWidth: '680px', margin: '0 auto' }}>
          {[
            {n:'Básico',p:'$29',tag:null,f:['Plan F3/F4 completo','Nutrición LeanGain','Coach básico','Chat con coach IA']},
            {n:'Premium',p:'$69',tag:'RECOMENDADO',f:['Todo lo básico','Coach personalizado','Video llamada con coach','Corrección técnica por cámara','Soporte <24h']},
          ].map(plan => (
            <div key={plan.n} style={{ background: '#080404', border: `1px solid ${plan.tag ? '#b71c1c' : '#1a0a0a'}`, padding: '2rem', flex: '1', minWidth: '250px', position: 'relative', boxShadow: plan.tag ? '0 0 40px rgba(183,28,28,0.15)' : 'none' }}>
              {plan.tag && <div style={{ position: 'absolute', top: '-11px', left: '50%', transform: 'translateX(-50%)', background: '#b71c1c', color: '#fff', fontFamily: 'Barlow Condensed,sans-serif', fontWeight: 700, fontSize: '0.65rem', letterSpacing: '0.15em', padding: '2px 14px' }}>{plan.tag}</div>}
              <h3 style={{ fontFamily: 'Barlow Condensed,sans-serif', fontWeight: 900, fontSize: '1.4rem', textTransform: 'uppercase', marginBottom: '0.5rem' }}>{plan.n}</h3>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '1.5rem', justifyContent: 'center' }}>
                <span style={{ fontFamily: 'Barlow Condensed,sans-serif', fontWeight: 900, fontSize: '2.5rem', color: plan.tag ? '#b71c1c' : '#e8edf2', textShadow: plan.tag ? '0 0 20px rgba(183,28,28,0.4)' : 'none' }}>{plan.p}</span>
                <span style={{ color: '#6b4040', fontSize: '0.9rem' }}>/mes</span>
              </div>
              <ul style={{ listStyle: 'none', textAlign: 'left', marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
                {plan.f.map(f => <li key={f} style={{ fontSize: '0.85rem', color: '#8b5a5a', display: 'flex', gap: '8px' }}><span style={{ color: '#b71c1c' }}>✓</span>{f}</li>)}
              </ul>
              <button onClick={() => setMode('signup')} style={{ width: '100%', background: plan.tag ? '#b71c1c' : 'transparent', color: plan.tag ? '#fff' : '#b71c1c', fontFamily: 'Barlow Condensed,sans-serif', fontWeight: 700, fontSize: '0.95rem', letterSpacing: '0.08em', textTransform: 'uppercase', padding: '0.75rem', border: '1px solid #b71c1c', cursor: 'pointer', clipPath: plan.tag ? 'polygon(8px 0%,100% 0%,calc(100% - 8px) 100%,0% 100%)' : 'none', transition: 'all 0.2s' }}>
                Empezar gratis
              </button>
            </div>
          ))}
        </div>
      </section>

      <footer style={{ borderTop: '1px solid #1a0a0a', padding: '2rem', textAlign: 'center', color: '#3d2020', fontSize: '0.78rem', position: 'relative', zIndex: 1 }}>
        <span style={{ fontFamily: 'Barlow Condensed,sans-serif', fontWeight: 700, color: '#6b4040', letterSpacing: '0.1em' }}>METAFIT</span> — LeanGain Protocol © 2025
      </footer>
    </div>
  )
}
