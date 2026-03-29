'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { ARCHETYPES, ARCHETYPE_ORDER, LEVELS, ArchetypeId, TrainingLevel } from '@/lib/archetypes'

export default function Onboarding() {
  const [step, setStep] = useState(0)
  const [gender, setGender] = useState('male')
  const [frequency, setFrequency] = useState('F3')
  const [goal, setGoal] = useState('volume')
  const [archetype, setArchetype] = useState<ArchetypeId>('street')
  const [level, setLevel] = useState<TrainingLevel>('beginner')
  const [loading, setLoading] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) { router.push('/'); return }
      setUserId(user.id)
    })
  }, [])

  const arc = ARCHETYPES[archetype]

  const save = async () => {
    if (!userId) { router.push('/'); return }
    setLoading(true)
    // upsert to handle both insert and update cases
    const { error } = await supabase.from('profiles').upsert({
      id: userId,
      gender,
      frequency,
      goal,
      archetype,
      training_level: level,
      plan: 'basic',
    }, { onConflict: 'id' })

    if (error) {
      console.error('Save error:', error)
      // try update as fallback
      await supabase.from('profiles').update({
        gender, frequency, goal, archetype, training_level: level,
      }).eq('id', userId)
    }
    router.push('/dashboard')
  }

  const Btn = ({ active, onClick, children }: any) => (
    <button onClick={onClick} style={{
      flex: 1, minWidth: '130px', padding: '0.85rem 1rem',
      border: `1px solid ${active ? arc.accent : '#2a1a1a'}`,
      background: active ? `rgba(${arc.accentRgb},0.1)` : 'transparent',
      color: active ? arc.accent : '#6b7f94',
      fontFamily: 'Barlow Condensed,sans-serif', fontWeight: 700,
      fontSize: '0.9rem', letterSpacing: '0.06em', textTransform: 'uppercase',
      cursor: 'pointer', transition: 'all 0.2s', textAlign: 'center',
    }}>{children}</button>
  )

  const NextBtn = ({ onClick, label = 'Siguiente →' }: any) => (
    <button onClick={onClick} style={{
      width: '100%', background: arc.accent, color: '#080c10',
      fontFamily: 'Barlow Condensed,sans-serif', fontWeight: 700,
      fontSize: '1rem', letterSpacing: '0.1em', textTransform: 'uppercase',
      padding: '0.9rem', border: 'none', cursor: 'pointer',
      clipPath: 'polygon(8px 0%,100% 0%,calc(100% - 8px) 100%,0% 100%)',
      transition: 'background 0.3s',
    }}>{label}</button>
  )

  return (
    <div style={{
      minHeight: '100vh', background: '#050404',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', padding: '1.5rem',
      fontFamily: 'Barlow, sans-serif', position: 'relative', overflow: 'hidden',
    }}>
      {/* Ambient */}
      <div style={{ position: 'fixed', inset: 0, background: `radial-gradient(ellipse at 50% 0%, rgba(${arc.accentRgb},0.1), transparent 60%)`, pointerEvents: 'none', transition: 'background 0.5s' }} />
      <div style={{ position: 'fixed', inset: 0, backgroundImage: 'linear-gradient(rgba(42,16,16,0.4) 1px,transparent 1px),linear-gradient(90deg,rgba(42,16,16,0.4) 1px,transparent 1px)', backgroundSize: '40px 40px', pointerEvents: 'none', opacity: 0.3 }} />

      <div style={{ width: '100%', maxWidth: '520px', position: 'relative', zIndex: 1 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <span style={{ fontFamily: 'Barlow Condensed,sans-serif', fontWeight: 900, fontSize: '1.8rem', color: '#e8edf2', letterSpacing: '0.05em' }}>META</span>
          <span style={{ fontFamily: 'Barlow Condensed,sans-serif', fontWeight: 900, fontSize: '1.8rem', color: arc.accent, letterSpacing: '0.05em', transition: 'color 0.4s' }}>FIT</span>
        </div>

        {/* Steps */}
        <div style={{ display: 'flex', gap: '6px', marginBottom: '1.75rem' }}>
          {['Tu Protocolo', 'Tu Arquetipo', 'Tu Nivel'].map((s, i) => (
            <div key={s} style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'center' }}>
              <div style={{ width: '100%', height: '3px', background: i <= step ? arc.accent : '#2a1a1a', borderRadius: '2px', transition: 'background 0.3s' }} />
              <span style={{ fontFamily: 'Barlow Condensed,sans-serif', fontSize: '0.6rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: i === step ? arc.accent : '#3d2020' }}>{s}</span>
            </div>
          ))}
        </div>

        {/* ── STEP 0 ── */}
        {step === 0 && (
          <div style={{ background: '#0f0808', border: '1px solid #2a1a1a', padding: '2rem', position: 'relative' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: `linear-gradient(90deg,transparent,${arc.accent},transparent)` }} />
            <h2 style={{ fontFamily: 'Barlow Condensed,sans-serif', fontWeight: 900, fontSize: '1.6rem', textTransform: 'uppercase', color: '#e8edf2', marginBottom: '0.2rem' }}>Tu Protocolo</h2>
            <p style={{ color: '#6b7f94', fontSize: '0.82rem', marginBottom: '1.75rem' }}>Define la base de tu entrenamiento.</p>

            <label style={{ fontSize: '0.65rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#6b7f94', display: 'block', marginBottom: '8px' }}>Género</label>
            <div style={{ display: 'flex', gap: '0.6rem', marginBottom: '1.25rem' }}>
              <Btn active={gender === 'male'} onClick={() => setGender('male')}>♂ Hombre</Btn>
              <Btn active={gender === 'female'} onClick={() => setGender('female')}>♀ Mujer</Btn>
            </div>

            <label style={{ fontSize: '0.65rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#6b7f94', display: 'block', marginBottom: '8px' }}>Frecuencia de pierna</label>
            <div style={{ display: 'flex', gap: '0.6rem', marginBottom: '1.25rem' }}>
              <Btn active={frequency === 'F3'} onClick={() => setFrequency('F3')}>
                <div>F3</div><div style={{ fontSize: '0.62rem', fontWeight: 400, marginTop: '2px' }}>3 días/sem</div>
              </Btn>
              <Btn active={frequency === 'F4'} onClick={() => setFrequency('F4')}>
                <div>F4</div><div style={{ fontSize: '0.62rem', fontWeight: 400, marginTop: '2px' }}>4 días/sem · Más intenso</div>
              </Btn>
            </div>

            <label style={{ fontSize: '0.65rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#6b7f94', display: 'block', marginBottom: '8px' }}>Objetivo</label>
            <div style={{ display: 'flex', gap: '0.6rem', marginBottom: '1.75rem' }}>
              <Btn active={goal === 'volume'} onClick={() => setGoal('volume')}>
                <div>Volumen</div><div style={{ fontSize: '0.62rem', fontWeight: 400, marginTop: '2px' }}>Ganar masa</div>
              </Btn>
              <Btn active={goal === 'definition'} onClick={() => setGoal('definition')}>
                <div>Definición</div><div style={{ fontSize: '0.62rem', fontWeight: 400, marginTop: '2px' }}>Perder grasa</div>
              </Btn>
            </div>

            <NextBtn onClick={() => setStep(1)} />
          </div>
        )}

        {/* ── STEP 1 ── */}
        {step === 1 && (
          <div>
            <div style={{ background: '#0f0808', border: '1px solid #2a1a1a', padding: '1.25rem 1.5rem', position: 'relative', marginBottom: '0.75rem' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: `linear-gradient(90deg,transparent,${arc.accent},transparent)`, transition: 'background 0.4s' }} />
              <h2 style={{ fontFamily: 'Barlow Condensed,sans-serif', fontWeight: 900, fontSize: '1.6rem', textTransform: 'uppercase', color: '#e8edf2', marginBottom: '0.2rem' }}>Elige tu Arquetipo</h2>
              <p style={{ color: '#6b7f94', fontSize: '0.82rem' }}>Define la estética de tu app y la personalidad de tu coach.</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '0.75rem' }}>
              {ARCHETYPE_ORDER.map(id => {
                const a = ARCHETYPES[id]; const isActive = archetype === id
                return (
                  <button key={id} onClick={() => setArchetype(id)} style={{
                    background: isActive ? a.surface : '#080404',
                    border: `1px solid ${isActive ? a.accent : '#1a0d0d'}`,
                    padding: '0.9rem 1.1rem', cursor: 'pointer', textAlign: 'left',
                    display: 'flex', alignItems: 'center', gap: '0.9rem',
                    transition: 'all 0.2s',
                    boxShadow: isActive ? `0 0 20px rgba(${a.accentRgb},0.15)` : 'none',
                  }}>
                    <span style={{ fontSize: '1.4rem', flexShrink: 0 }}>{a.emoji}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                        <span style={{ fontFamily: 'Barlow Condensed,sans-serif', fontWeight: 900, fontSize: '0.95rem', color: isActive ? a.accent : '#e8edf2', textTransform: 'uppercase', letterSpacing: '0.05em', transition: 'color 0.2s' }}>{a.name}</span>
                        <span style={{ fontSize: '0.6rem', color: '#3d2020' }}>{a.phase}</span>
                      </div>
                      <div style={{ color: isActive ? '#b0bec5' : '#6b7f94', fontSize: '0.78rem' }}>{a.tagline}</div>
                    </div>
                    <div style={{ fontFamily: 'Barlow Condensed,sans-serif', fontWeight: 700, fontSize: '0.7rem', color: isActive ? a.accent : '#3d2020', textTransform: 'uppercase', letterSpacing: '0.06em', flexShrink: 0 }}>
                      "{a.mantra}"
                    </div>
                  </button>
                )
              })}
            </div>

            <div style={{ display: 'flex', gap: '0.6rem' }}>
              <button onClick={() => setStep(0)} style={{ flex: 1, background: 'transparent', color: '#6b7f94', fontFamily: 'Barlow Condensed,sans-serif', fontWeight: 700, fontSize: '0.85rem', letterSpacing: '0.08em', textTransform: 'uppercase', padding: '0.85rem', border: '1px solid #2a1a1a', cursor: 'pointer' }}>← Atrás</button>
              <button onClick={() => setStep(2)} style={{ flex: 2, background: arc.accent, color: '#080c10', fontFamily: 'Barlow Condensed,sans-serif', fontWeight: 700, fontSize: '0.95rem', letterSpacing: '0.1em', textTransform: 'uppercase', padding: '0.85rem', border: 'none', cursor: 'pointer', clipPath: 'polygon(8px 0%,100% 0%,calc(100% - 8px) 100%,0% 100%)', transition: 'background 0.3s' }}>Siguiente →</button>
            </div>
          </div>
        )}

        {/* ── STEP 2 ── */}
        {step === 2 && (
          <div style={{ background: '#0f0808', border: '1px solid #2a1a1a', padding: '2rem', position: 'relative' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: `linear-gradient(90deg,transparent,${arc.accent},transparent)` }} />
            <h2 style={{ fontFamily: 'Barlow Condensed,sans-serif', fontWeight: 900, fontSize: '1.6rem', textTransform: 'uppercase', color: '#e8edf2', marginBottom: '0.2rem' }}>Tu Nivel</h2>
            <p style={{ color: '#6b7f94', fontSize: '0.82rem', marginBottom: '1.75rem' }}>Define cómo se comunica tu coach contigo.</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '1.5rem' }}>
              {Object.values(LEVELS).map(l => (
                <button key={l.id} onClick={() => setLevel(l.id as TrainingLevel)} style={{
                  background: level === l.id ? `rgba(${arc.accentRgb},0.08)` : 'transparent',
                  border: `1px solid ${level === l.id ? arc.accent : '#2a1a1a'}`,
                  padding: '1rem 1.25rem', cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s',
                }}>
                  <div style={{ fontFamily: 'Barlow Condensed,sans-serif', fontWeight: 700, fontSize: '1rem', color: level === l.id ? arc.accent : '#e8edf2', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '2px' }}>{l.label}</div>
                  <div style={{ color: '#6b7f94', fontSize: '0.8rem' }}>{l.sub}</div>
                </button>
              ))}
            </div>

            {/* Summary */}
            <div style={{ background: `rgba(${arc.accentRgb},0.05)`, border: `1px solid rgba(${arc.accentRgb},0.15)`, padding: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ fontFamily: 'Barlow Condensed,sans-serif', fontWeight: 700, color: arc.accent, fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '6px' }}>Resumen de tu protocolo</div>
              <div style={{ color: '#6b7f94', fontSize: '0.82rem', lineHeight: 1.8 }}>
                {gender === 'male' ? 'Hombre' : 'Mujer'} · {frequency} · {goal === 'volume' ? 'Volumen' : 'Definición'}<br />
                <span style={{ color: arc.accent }}>{arc.emoji} {arc.name}</span> — "{arc.mantra}"<br />
                Nivel: {LEVELS[level].label}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.6rem' }}>
              <button onClick={() => setStep(1)} style={{ flex: 1, background: 'transparent', color: '#6b7f94', fontFamily: 'Barlow Condensed,sans-serif', fontWeight: 700, fontSize: '0.85rem', letterSpacing: '0.08em', textTransform: 'uppercase', padding: '0.85rem', border: '1px solid #2a1a1a', cursor: 'pointer' }}>← Atrás</button>
              <button onClick={save} disabled={loading} style={{ flex: 2, background: loading ? '#2a1a1a' : arc.accent, color: '#080c10', fontFamily: 'Barlow Condensed,sans-serif', fontWeight: 700, fontSize: '0.95rem', letterSpacing: '0.1em', textTransform: 'uppercase', padding: '0.85rem', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', clipPath: 'polygon(8px 0%,100% 0%,calc(100% - 8px) 100%,0% 100%)', transition: 'all 0.3s' }}>
                {loading ? 'Activando...' : 'Activar protocolo →'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
