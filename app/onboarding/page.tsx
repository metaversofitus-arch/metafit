'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { ARCHETYPES, ARCHETYPE_ORDER, LEVELS, ArchetypeId, TrainingLevel } from '@/lib/archetypes'

const steps = ['protocolo', 'arquetipo', 'nivel']

export default function Onboarding() {
  const [step, setStep] = useState(0)
  const [gender, setGender] = useState('male')
  const [frequency, setFrequency] = useState('F3')
  const [goal, setGoal] = useState('volume')
  const [archetype, setArchetype] = useState<ArchetypeId>('street')
  const [level, setLevel] = useState<TrainingLevel>('beginner')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const arc = ARCHETYPES[archetype]

  const save = async () => {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/'); return }
    await supabase.from('profiles').update({
      gender, frequency, archetype, training_level: level
    }).eq('id', user.id)
    router.push('/dashboard')
  }

  const BtnOpt = ({ active, onClick, children, accent = '#00e5ff' }) => (
    <button onClick={onClick} style={{
      flex: 1, minWidth: '140px', padding: '0.85rem 1rem',
      border: `1px solid ${active ? accent : '#243040'}`,
      background: active ? `rgba(${accent === '#00e5ff' ? '0,229,255' : '255,255,255'},0.08)` : 'transparent',
      color: active ? accent : '#6b7f94',
      fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '0.9rem',
      letterSpacing: '0.06em', textTransform: 'uppercase', cursor: 'pointer',
      transition: 'all 0.15s', textAlign: 'center',
    }}>{children}</button>
  )

  return (
    <div style={{ minHeight: '100vh', background: '#080c10', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '1.5rem', fontFamily: 'Barlow, sans-serif' }}>
      {/* BG glow based on archetype */}
      <div style={{ position: 'fixed', inset: 0, background: `radial-gradient(ellipse at 50% 0%, ${arc.glow}, transparent 60%)`, pointerEvents: 'none', transition: 'background 0.5s' }} />

      <div style={{ width: '100%', maxWidth: '540px', position: 'relative', zIndex: 1 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <span style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 900, fontSize: '1.6rem', color: '#e8edf2' }}>META</span>
          <span style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 900, fontSize: '1.6rem', color: arc.accent, transition: 'color 0.4s' }}>FIT</span>
        </div>

        {/* Progress */}
        <div style={{ display: 'flex', gap: '6px', marginBottom: '2rem' }}>
          {steps.map((s, i) => (
            <div key={s} style={{ flex: 1, height: '3px', background: i <= step ? arc.accent : '#243040', borderRadius: '2px', transition: 'background 0.3s' }} />
          ))}
        </div>

        {/* ── STEP 0: Protocolo ── */}
        {step === 0 && (
          <div style={{ background: '#1a2332', border: '1px solid #243040', padding: '2rem', position: 'relative' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: `linear-gradient(90deg, transparent, ${arc.accent}, transparent)` }} />
            <h2 style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 900, fontSize: '1.7rem', textTransform: 'uppercase', color: '#e8edf2', marginBottom: '0.25rem' }}>Tu Protocolo</h2>
            <p style={{ color: '#6b7f94', fontSize: '0.85rem', marginBottom: '1.75rem' }}>Define tu plan de entrenamiento y nutrición.</p>

            <label style={{ fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#6b7f94', display: 'block', marginBottom: '8px' }}>Género</label>
            <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <BtnOpt active={gender === 'male'} onClick={() => setGender('male')} accent={arc.accent}>♂ Hombre</BtnOpt>
              <BtnOpt active={gender === 'female'} onClick={() => setGender('female')} accent={arc.accent}>♀ Mujer</BtnOpt>
            </div>

            <label style={{ fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#6b7f94', display: 'block', marginBottom: '8px' }}>Frecuencia de pierna</label>
            <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <BtnOpt active={frequency === 'F3'} onClick={() => setFrequency('F3')} accent={arc.accent}>
                <div>F3</div><div style={{ fontSize: '0.65rem', fontWeight: 400, marginTop: '2px' }}>3 días/sem</div>
              </BtnOpt>
              <BtnOpt active={frequency === 'F4'} onClick={() => setFrequency('F4')} accent={arc.accent}>
                <div>F4</div><div style={{ fontSize: '0.65rem', fontWeight: 400, marginTop: '2px' }}>4 días/sem</div>
              </BtnOpt>
            </div>

            <label style={{ fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#6b7f94', display: 'block', marginBottom: '8px' }}>Objetivo</label>
            <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.75rem' }}>
              <BtnOpt active={goal === 'volume'} onClick={() => setGoal('volume')} accent={arc.accent}>
                <div>Volumen</div><div style={{ fontSize: '0.65rem', fontWeight: 400, marginTop: '2px' }}>Ganar masa</div>
              </BtnOpt>
              <BtnOpt active={goal === 'definition'} onClick={() => setGoal('definition')} accent={arc.accent}>
                <div>Definición</div><div style={{ fontSize: '0.65rem', fontWeight: 400, marginTop: '2px' }}>Perder grasa</div>
              </BtnOpt>
            </div>

            <button onClick={() => setStep(1)} style={{ width: '100%', background: arc.accent, color: '#080c10', fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '1rem', letterSpacing: '0.1em', textTransform: 'uppercase', padding: '0.9rem', border: 'none', cursor: 'pointer', clipPath: 'polygon(8px 0%,100% 0%,calc(100% - 8px) 100%,0% 100%)', transition: 'background 0.3s' }}>
              Siguiente →
            </button>
          </div>
        )}

        {/* ── STEP 1: Arquetipo ── */}
        {step === 1 && (
          <div>
            <div style={{ background: '#1a2332', border: '1px solid #243040', padding: '1.5rem 2rem', position: 'relative', marginBottom: '1rem' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: `linear-gradient(90deg, transparent, ${arc.accent}, transparent)`, transition: 'background 0.4s' }} />
              <h2 style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 900, fontSize: '1.7rem', textTransform: 'uppercase', color: '#e8edf2', marginBottom: '0.25rem' }}>Elige tu Arquetipo</h2>
              <p style={{ color: '#6b7f94', fontSize: '0.85rem' }}>Define la estética de tu app y el estilo de tu coach.</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '1rem' }}>
              {ARCHETYPE_ORDER.map(id => {
                const a = ARCHETYPES[id]
                const isActive = archetype === id
                return (
                  <button key={id} onClick={() => setArchetype(id)} style={{
                    background: isActive ? a.surface : '#0d1117',
                    border: `1px solid ${isActive ? a.accent : '#1a2332'}`,
                    padding: '1rem 1.25rem', cursor: 'pointer', textAlign: 'left',
                    display: 'flex', alignItems: 'center', gap: '1rem',
                    transition: 'all 0.2s',
                    boxShadow: isActive ? `0 0 20px ${a.glow}` : 'none',
                  }}>
                    <span style={{ fontSize: '1.5rem', flexShrink: 0 }}>{a.emoji}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2px' }}>
                        <span style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 900, fontSize: '1rem', color: isActive ? a.accent : '#e8edf2', textTransform: 'uppercase', letterSpacing: '0.05em', transition: 'color 0.2s' }}>{a.name}</span>
                        <span style={{ fontSize: '0.65rem', color: '#3d5166', letterSpacing: '0.08em' }}>{a.phase}</span>
                      </div>
                      <div style={{ color: isActive ? '#b0bec5' : '#6b7f94', fontSize: '0.8rem' }}>{a.tagline}</div>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '0.75rem', color: isActive ? a.accent : '#3d5166', textTransform: 'uppercase', letterSpacing: '0.08em' }}>"{a.mantra}"</div>
                    </div>
                  </button>
                )
              })}
            </div>

            {/* Preview */}
            <div style={{ background: ARCHETYPES[archetype].surface, border: `1px solid ${ARCHETYPES[archetype].accent}`, padding: '1rem 1.25rem', marginBottom: '1rem', transition: 'all 0.3s' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 900, fontSize: '1rem', color: ARCHETYPES[archetype].accent, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Vista previa de tu coach</div>
                  <div style={{ color: '#6b7f94', fontSize: '0.8rem', marginTop: '2px' }}>Estilo: {ARCHETYPES[archetype].coachStyle.split('.')[0]}</div>
                </div>
                <span style={{ fontSize: '2rem' }}>{ARCHETYPES[archetype].emoji}</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button onClick={() => setStep(0)} style={{ flex: 1, background: 'transparent', color: '#6b7f94', fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '0.9rem', letterSpacing: '0.08em', textTransform: 'uppercase', padding: '0.85rem', border: '1px solid #243040', cursor: 'pointer' }}>← Atrás</button>
              <button onClick={() => setStep(2)} style={{ flex: 2, background: arc.accent, color: '#080c10', fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '1rem', letterSpacing: '0.1em', textTransform: 'uppercase', padding: '0.85rem', border: 'none', cursor: 'pointer', clipPath: 'polygon(8px 0%,100% 0%,calc(100% - 8px) 100%,0% 100%)', transition: 'background 0.3s' }}>Siguiente →</button>
            </div>
          </div>
        )}

        {/* ── STEP 2: Nivel ── */}
        {step === 2 && (
          <div style={{ background: '#1a2332', border: '1px solid #243040', padding: '2rem', position: 'relative' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: `linear-gradient(90deg, transparent, ${arc.accent}, transparent)` }} />
            <h2 style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 900, fontSize: '1.7rem', textTransform: 'uppercase', color: '#e8edf2', marginBottom: '0.25rem' }}>Tu Nivel</h2>
            <p style={{ color: '#6b7f94', fontSize: '0.85rem', marginBottom: '1.75rem' }}>Define cómo habla tu coach contigo.</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.75rem' }}>
              {Object.values(LEVELS).map(l => (
                <button key={l.id} onClick={() => setLevel(l.id as TrainingLevel)} style={{
                  background: level === l.id ? `rgba(${arc.accentRgb}, 0.08)` : 'transparent',
                  border: `1px solid ${level === l.id ? arc.accent : '#243040'}`,
                  padding: '1rem 1.25rem', cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s',
                }}>
                  <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '1rem', color: level === l.id ? arc.accent : '#e8edf2', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '2px' }}>{l.label}</div>
                  <div style={{ color: '#6b7f94', fontSize: '0.82rem' }}>{l.sub}</div>
                </button>
              ))}
            </div>

            {/* Summary */}
            <div style={{ background: `rgba(${arc.accentRgb}, 0.05)`, border: `1px solid rgba(${arc.accentRgb}, 0.15)`, padding: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, color: arc.accent, fontSize: '0.8rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '6px' }}>Tu protocolo completo</div>
              <div style={{ color: '#6b7f94', fontSize: '0.82rem', lineHeight: 1.7 }}>
                {gender === 'male' ? 'Hombre' : 'Mujer'} · {frequency} · {goal === 'volume' ? 'Volumen' : 'Definición'}<br />
                Arquetipo: <span style={{ color: arc.accent }}>{arc.name}</span> — "{arc.mantra}"<br />
                Nivel: {LEVELS[level].label}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button onClick={() => setStep(1)} style={{ flex: 1, background: 'transparent', color: '#6b7f94', fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '0.9rem', letterSpacing: '0.08em', textTransform: 'uppercase', padding: '0.85rem', border: '1px solid #243040', cursor: 'pointer' }}>← Atrás</button>
              <button onClick={save} disabled={loading} style={{ flex: 2, background: loading ? '#243040' : arc.accent, color: '#080c10', fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '1rem', letterSpacing: '0.1em', textTransform: 'uppercase', padding: '0.85rem', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', clipPath: 'polygon(8px 0%,100% 0%,calc(100% - 8px) 100%,0% 100%)', transition: 'all 0.3s' }}>
                {loading ? 'Activando...' : 'Activar protocolo →'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
