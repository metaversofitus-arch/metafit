'use client'
import { useState, useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import { getPlan, ABDOMINAL_CIRCUIT, NUTRITION_LEG_DAY, NUTRITION_UPPER_DAY } from '@/lib/workout-data'
import { ARCHETYPES, LEVELS, ArchetypeId } from '@/lib/archetypes'
import { useRouter } from 'next/navigation'

const DAYS = ['Lunes','Martes','Miércoles','Jueves','Viernes','Sábado','Domingo']
const TODAY_IDX = new Date().getDay() === 0 ? 6 : new Date().getDay() - 1
type Tab = 'entrenamiento' | 'nutricion' | 'coach' | 'hablar'

export default function Dashboard() {
  const [tab, setTab] = useState<Tab>('entrenamiento')
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/'); return }
      const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
      if (!data) { router.push('/onboarding'); return }
      setProfile(data)
      setLoading(false)
    }
    init()
  }, [])

  const logout = async () => { await supabase.auth.signOut(); router.push('/') }

  if (loading) return (
    <div style={{ minHeight:'100vh', background:'#080c10', display:'flex', alignItems:'center', justifyContent:'center' }}>
      <div style={{ textAlign:'center' }}>
        <div style={{ fontFamily:'Barlow Condensed,sans-serif', fontWeight:900, fontSize:'2rem', color:'#00e5ff', letterSpacing:'0.1em' }}>METAFIT</div>
        <div style={{ color:'#6b7f94', fontSize:'0.8rem', letterSpacing:'0.15em', textTransform:'uppercase', marginTop:'8px' }}>Cargando protocolo...</div>
      </div>
    </div>
  )

  const arcId: ArchetypeId = (profile?.archetype as ArchetypeId) || 'street'
  const arc = ARCHETYPES[arcId]

  const C = {
    bg: arc.bg, bg2: '#0d1117', bg3: arc.surface,
    surf: arc.surface, surf2: arc.surface,
    border: arc.border, accent: arc.accent, accentRgb: arc.accentRgb,
    text: '#e8edf2', muted: '#6b7f94', dim: '#3d5166',
    green: '#00ff94', gold: '#ffc107',
  }

  const tabs = [
    { id:'entrenamiento', label:'Entreno', icon:'🏋️' },
    { id:'nutricion', label:'Nutrición', icon:'🥩' },
    { id:'coach', label:'Coach', icon:'🎮' },
    { id:'hablar', label:'Hablar', icon:'🎙️' },
  ]

  return (
    <div style={{ background: C.bg, minHeight:'100vh', fontFamily:'Barlow,sans-serif', color: C.text, position:'relative' }}>
      {/* Ambient glow */}
      <div style={{ position:'fixed', top:0, left:'50%', transform:'translateX(-50%)', width:'100%', height:'300px', background:`radial-gradient(ellipse at 50% 0%, rgba(${C.accentRgb},0.08), transparent 70%)`, pointerEvents:'none', zIndex:0, transition:'background 0.5s' }} />

      {/* Header */}
      <header style={{ position:'fixed', top:0, left:0, right:0, zIndex:100, background:`rgba(${C.bg === '#080c10' ? '8,12,16' : '5,4,8'},0.92)`, borderBottom:`1px solid ${C.border}`, backdropFilter:'blur(12px)', padding:'0.85rem 1.25rem', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'0.75rem' }}>
          <div>
            <span style={{ fontFamily:'Barlow Condensed,sans-serif', fontWeight:900, fontSize:'1.4rem', color: C.text }}>META</span>
            <span style={{ fontFamily:'Barlow Condensed,sans-serif', fontWeight:900, fontSize:'1.4rem', color: C.accent, transition:'color 0.4s' }}>FIT</span>
          </div>
          <div style={{ background:`rgba(${C.accentRgb},0.1)`, border:`1px solid rgba(${C.accentRgb},0.2)`, padding:'2px 8px' }}>
            <span style={{ fontFamily:'Barlow Condensed,sans-serif', fontWeight:700, fontSize:'0.65rem', letterSpacing:'0.1em', color: C.accent, textTransform:'uppercase' }}>{arc.emoji} {arc.name}</span>
          </div>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:'0.75rem' }}>
          {profile?.plan==='premium' && <span style={{ background:'linear-gradient(135deg,#a855f7,#7c3aed)', color:'white', fontFamily:'Barlow Condensed,sans-serif', fontWeight:700, fontSize:'0.6rem', letterSpacing:'0.1em', padding:'2px 8px', textTransform:'uppercase' }}>PREMIUM</span>}
          <span style={{ color: C.muted, fontSize:'0.8rem' }}>{profile?.name||'Atleta'}</span>
          <button onClick={logout} style={{ background:'transparent', border:`1px solid ${C.border}`, color: C.dim, padding:'3px 8px', cursor:'pointer', fontFamily:'Barlow Condensed,sans-serif', fontSize:'0.65rem' }}>Salir</button>
        </div>
      </header>

      {/* Mantra banner */}
      <div style={{ position:'fixed', top:'52px', left:0, right:0, zIndex:99, background:`rgba(${C.accentRgb},0.06)`, borderBottom:`1px solid rgba(${C.accentRgb},0.1)`, padding:'4px', textAlign:'center' }}>
        <span style={{ fontFamily:'Barlow Condensed,sans-serif', fontWeight:700, fontSize:'0.7rem', letterSpacing:'0.2em', color: C.accent, textTransform:'uppercase', opacity:0.8 }}>"{arc.mantra}"</span>
      </div>

      <main style={{ paddingTop:'84px', paddingBottom:'72px', position:'relative', zIndex:1 }}>
        {tab === 'entrenamiento' && <EntrenamientoTab profile={profile} C={C} arc={arc} />}
        {tab === 'nutricion' && <NutricionTab profile={profile} C={C} arc={arc} />}
        {tab === 'coach' && <CoachTab profile={profile} C={C} arc={arc} />}
        {tab === 'hablar' && <HablarTab profile={profile} C={C} arc={arc} />}
      </main>

      {/* Bottom nav */}
      <nav style={{ position:'fixed', bottom:0, left:0, right:0, zIndex:100, background:`rgba(8,6,0,0.97)`, borderTop:`1px solid ${C.border}`, display:'flex', backdropFilter:'blur(12px)' }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id as Tab)} style={{ flex:1, padding:'0.65rem 0.5rem', border:'none', background:'transparent', cursor:'pointer', display:'flex', flexDirection:'column', alignItems:'center', gap:'2px', borderTop: tab===t.id ? `2px solid ${C.accent}` : '2px solid transparent', transition:'all 0.15s' }}>
            <span style={{ fontSize:'1.1rem' }}>{t.icon}</span>
            <span style={{ fontFamily:'Barlow Condensed,sans-serif', fontWeight: tab===t.id?700:500, fontSize:'0.6rem', letterSpacing:'0.05em', textTransform:'uppercase', color: tab===t.id ? C.accent : C.muted, transition:'color 0.15s' }}>{t.label}</span>
          </button>
        ))}
      </nav>
    </div>
  )
}

// ─── ENTRENAMIENTO ────────────────────────────────────────────────────────────
function EntrenamientoTab({ profile, C, arc }) {
  const [selectedDay, setSelectedDay] = useState(TODAY_IDX)
  const [week, setWeek] = useState(1)
  const [checked, setChecked] = useState(new Set<string>())
  const plan = getPlan(profile?.gender || 'male', profile?.frequency || 'F3')
  const dayW = plan[selectedDay]
  const isDeload = week === 7
  const totalExs = dayW?.circuits.reduce((a,c) => a + c.exercises.length, 0) || 0
  const done = [...checked].filter(k => k.startsWith(`${selectedDay}-`)).length
  const pct = totalExs > 0 ? Math.round((done/totalExs)*100) : 0

  const toggle = (k) => setChecked(prev => { const n = new Set(prev); n.has(k) ? n.delete(k) : n.add(k); return n })

  return (
    <div>
      {/* Week selector */}
      <div style={{ background: C.bg2, borderBottom:`1px solid ${C.border}`, padding:'0.9rem 1.25rem' }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'0.6rem' }}>
          <span style={{ fontFamily:'Barlow Condensed,sans-serif', fontWeight:700, fontSize:'0.7rem', letterSpacing:'0.15em', textTransform:'uppercase', color: C.muted }}>Ciclo 8 semanas</span>
          <span style={{ background: isDeload ? 'rgba(255,193,7,0.1)' : `rgba(${C.accentRgb},0.1)`, color: isDeload ? C.gold : C.accent, fontFamily:'Barlow Condensed,sans-serif', fontWeight:700, fontSize:'0.65rem', letterSpacing:'0.1em', padding:'2px 10px', textTransform:'uppercase' }}>
            {isDeload ? '🔋 DESCARGA' : `SEM ${week}`}
          </span>
        </div>
        <div style={{ display:'flex', gap:'5px' }}>
          {[1,2,3,4,5,6,7,8].map(w => (
            <button key={w} onClick={() => setWeek(w)} style={{ flex:1, height:'30px', border:`1px solid ${week===w?(w===7?C.gold:C.accent):C.border}`, background: week===w?(w===7?'rgba(255,193,7,0.12)':`rgba(${C.accentRgb},0.1)`):'transparent', color: week===w?(w===7?C.gold:C.accent):C.dim, fontFamily:'Barlow Condensed,sans-serif', fontWeight:700, fontSize:'0.75rem', cursor:'pointer', transition:'all 0.15s' }}>
              {w===7?'D':w===8?'R':w}
            </button>
          ))}
        </div>
      </div>

      {/* Day selector */}
      <div style={{ display:'flex', overflowX:'auto', borderBottom:`1px solid ${C.border}`, background: C.bg3 }}>
        {DAYS.map((d,i) => {
          const dw = plan[i]; const isRest = dw?.circuits.length === 0
          return (
            <button key={d} onClick={() => { setSelectedDay(i); setChecked(new Set()) }} style={{ flex:'0 0 auto', padding:'0.65rem 0.8rem', border:'none', background:'transparent', borderBottom: selectedDay===i?`2px solid ${C.accent}`:'2px solid transparent', cursor: isRest?'default':'pointer', display:'flex', flexDirection:'column', alignItems:'center', gap:'1px' }}>
              <span style={{ fontFamily:'Barlow Condensed,sans-serif', fontWeight:700, fontSize:'0.7rem', letterSpacing:'0.05em', textTransform:'uppercase', color: selectedDay===i?C.accent:isRest?C.dim:C.muted }}>{d.slice(0,3)}</span>
              <span style={{ fontSize:'0.58rem', color: selectedDay===i?C.accent:C.dim }}>{isRest?'DESC':dw?.focus.split(' ')[0]}</span>
            </button>
          )
        })}
      </div>

      <div style={{ padding:'1.25rem' }}>
        {dayW?.circuits.length === 0 ? (
          <div style={{ textAlign:'center', padding:'3rem 1rem' }}>
            <div style={{ fontSize:'3rem', marginBottom:'1rem' }}>🌿</div>
            <h3 style={{ fontFamily:'Barlow Condensed,sans-serif', fontWeight:700, fontSize:'1.4rem', textTransform:'uppercase', color: C.text, marginBottom:'0.5rem' }}>Descanso Activo</h3>
            <p style={{ color: C.muted, fontSize:'0.9rem', fontStyle:'italic', marginTop:'0.5rem' }}>"{arc.mantra}"</p>
          </div>
        ) : (
          <>
            {totalExs > 0 && (
              <div style={{ marginBottom:'1.25rem' }}>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'5px' }}>
                  <span style={{ fontSize:'0.75rem', color: C.muted }}>Progreso</span>
                  <span style={{ fontFamily:'Barlow Condensed,sans-serif', fontWeight:700, color: pct===100?C.green:C.accent }}>{pct}%</span>
                </div>
                <div style={{ height:'3px', background: C.border, borderRadius:'2px', overflow:'hidden' }}>
                  <div style={{ height:'100%', width:`${pct}%`, background: pct===100?C.green:C.accent, transition:'width 0.3s', borderRadius:'2px' }} />
                </div>
              </div>
            )}
            <h2 style={{ fontFamily:'Barlow Condensed,sans-serif', fontWeight:900, fontSize:'1.5rem', textTransform:'uppercase', color: C.text, marginBottom:'1.25rem' }}>{dayW.focus}</h2>
            {dayW.circuits.map((circuit, ci) => (
              <div key={ci} style={{ marginBottom:'1.5rem' }}>
                <div style={{ display:'flex', alignItems:'center', gap:'0.6rem', marginBottom:'0.75rem' }}>
                  <div style={{ background: circuit.name==='Remate'?'#ff3d00':C.accent, color:'#080c10', fontFamily:'Barlow Condensed,sans-serif', fontWeight:900, fontSize:'0.6rem', letterSpacing:'0.1em', padding:'3px 10px', clipPath:'polygon(4px 0%,100% 0%,calc(100% - 4px) 100%,0% 100%)' }}>{circuit.name.toUpperCase()}</div>
                  <span style={{ fontFamily:'Barlow Condensed,sans-serif', fontWeight:700, fontSize:'0.75rem', color: C.muted, letterSpacing:'0.05em' }}>{circuit.sets} SERIES</span>
                </div>
                <div style={{ display:'flex', flexDirection:'column', gap:'0.5rem' }}>
                  {circuit.exercises.map((ex, ei) => {
                    const k = `${selectedDay}-${ci}-${ei}`; const isChecked = checked.has(k)
                    return (
                      <div key={ei} onClick={() => toggle(k)} style={{ background: isChecked?`rgba(0,255,148,0.05)`:C.surf, border:`1px solid ${isChecked?C.green:C.border}`, padding:'0.85rem 1rem', cursor:'pointer', display:'flex', alignItems:'flex-start', gap:'0.75rem', transition:'all 0.15s' }}>
                        <div style={{ width:'18px', height:'18px', border:`2px solid ${isChecked?C.green:C.border}`, background: isChecked?C.green:'transparent', flexShrink:0, marginTop:'2px', display:'flex', alignItems:'center', justifyContent:'center', transition:'all 0.15s' }}>
                          {isChecked && <span style={{ color:'#080c10', fontSize:'0.6rem', fontWeight:900 }}>✓</span>}
                        </div>
                        <div style={{ flex:1 }}>
                          <div style={{ fontFamily:'Barlow Condensed,sans-serif', fontWeight:700, fontSize:'0.95rem', color: isChecked?C.muted:C.text, textDecoration: isChecked?'line-through':'none', textTransform:'uppercase', letterSpacing:'0.03em' }}>{ex.name}</div>
                          <div style={{ color: C.accent, fontSize:'0.8rem', marginTop:'1px', fontWeight:600 }}>{ex.reps}</div>
                          {ex.notes && <div style={{ color: C.dim, fontSize:'0.72rem', marginTop:'2px' }}>💡 {ex.notes}</div>}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
            <div style={{ background:`rgba(${C.accentRgb},0.04)`, border:`1px solid rgba(${C.accentRgb},0.1)`, padding:'0.85rem' }}>
              <p style={{ fontFamily:'Barlow Condensed,sans-serif', fontWeight:700, fontSize:'0.75rem', letterSpacing:'0.1em', color: C.muted, textTransform:'uppercase', marginBottom:'3px' }}>+ Abdomen opcional</p>
              <p style={{ color: C.dim, fontSize:'0.78rem' }}>3 series · Crunch · Elevación piernas · Rotación disco · Plancha lateral · Escaladores</p>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

// ─── NUTRICIÓN ────────────────────────────────────────────────────────────────
function NutricionTab({ profile, C, arc }) {
  const [dayType, setDayType] = useState('leg')
  const [weight, setWeight] = useState(75)
  const nutrition = dayType === 'leg' ? NUTRITION_LEG_DAY : NUTRITION_UPPER_DAY
  const protein = Math.round(weight * 2.2)
  const creatine = (weight * 1.2).toFixed(1)

  return (
    <div style={{ padding:'1.25rem' }}>
      <h2 style={{ fontFamily:'Barlow Condensed,sans-serif', fontWeight:900, fontSize:'1.7rem', textTransform:'uppercase', marginBottom:'0.25rem' }}>LeanGain Protocol</h2>
      <p style={{ color: C.muted, fontSize:'0.82rem', marginBottom:'1.5rem' }}>Nutrición sincronizada con tu entrenamiento.</p>

      <div style={{ background: C.surf, border:`1px solid ${C.border}`, padding:'1rem', marginBottom:'1.25rem' }}>
        <label style={{ fontSize:'0.7rem', letterSpacing:'0.1em', textTransform:'uppercase', color: C.muted, display:'block', marginBottom:'8px' }}>Peso (kg)</label>
        <div style={{ display:'flex', alignItems:'center', gap:'1rem' }}>
          <input type="range" min={45} max={150} value={weight} onChange={e => setWeight(+e.target.value)} style={{ flex:1, accentColor: C.accent }} />
          <span style={{ fontFamily:'Barlow Condensed,sans-serif', fontWeight:900, fontSize:'1.4rem', color: C.accent, minWidth:'55px' }}>{weight}kg</span>
        </div>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'0.6rem', marginBottom:'1.25rem' }}>
        {[
          {label:'Proteína/día', val:`${protein}g`, sub:'2.2g×kg'},
          {label:'Creatina', val:`${creatine}g`, sub:'1.2g×kg'},
          {label:'Mínimo', val:'150g', sub:'proteína'},
        ].map(s => (
          <div key={s.label} style={{ background: C.bg3, border:`1px solid ${C.border}`, padding:'0.75rem', textAlign:'center' }}>
            <div style={{ fontFamily:'Barlow Condensed,sans-serif', fontWeight:900, fontSize:'1.3rem', color: C.accent }}>{s.val}</div>
            <div style={{ fontSize:'0.6rem', color: C.muted, textTransform:'uppercase', letterSpacing:'0.04em', marginTop:'2px' }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display:'flex', gap:'0.6rem', marginBottom:'1.25rem' }}>
        {[{id:'leg',label:'🦵 Día Pierna',sub:'Carbs altos'},{id:'upper',label:'💪 Día Upper',sub:'Carbs moderados'}].map(dt => (
          <button key={dt.id} onClick={() => setDayType(dt.id)} style={{ flex:1, padding:'0.75rem', border:`1px solid ${dayType===dt.id?C.accent:C.border}`, background: dayType===dt.id?`rgba(${C.accentRgb},0.08)`:'transparent', color: dayType===dt.id?C.accent:C.muted, fontFamily:'Barlow Condensed,sans-serif', fontWeight:700, fontSize:'0.8rem', cursor:'pointer', textAlign:'center', transition:'all 0.15s' }}>
            <div>{dt.label}</div>
            <div style={{ fontSize:'0.62rem', fontWeight:400, marginTop:'1px', color: dayType===dt.id?C.accent:C.dim }}>{dt.sub}</div>
          </button>
        ))}
      </div>

      {[
        {key:'pre_workout',label:'⚡ Pre-Entreno'},
        {key:'post_workout',label:'🍳 Post-Entreno'},
        {key:'snack',label:'🥜 Snack'},
        {key:'dinner',label:'🌙 Cena'},
      ].map(meal => (
        <div key={meal.key} style={{ marginBottom:'1.1rem' }}>
          <div style={{ fontFamily:'Barlow Condensed,sans-serif', fontWeight:700, fontSize:'0.9rem', textTransform:'uppercase', letterSpacing:'0.05em', color: C.text, marginBottom:'0.5rem' }}>{meal.label}</div>
          {(nutrition[meal.key] as any[]).map((opt, i) => (
            <div key={i} style={{ background: C.surf, border:`1px solid ${C.border}`, padding:'0.85rem', marginBottom:'0.4rem', display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:'0.75rem' }}>
              <div style={{ flex:1 }}>
                <div style={{ fontFamily:'Barlow Condensed,sans-serif', fontWeight:700, fontSize:'0.85rem', color: C.text, marginBottom:'2px' }}>{opt.name}</div>
                <div style={{ color: C.muted, fontSize:'0.78rem', lineHeight:1.5 }}>{opt.description}</div>
              </div>
              <div style={{ background:`rgba(${C.accentRgb},0.1)`, border:`1px solid rgba(${C.accentRgb},0.2)`, padding:'4px 8px', flexShrink:0, textAlign:'center' }}>
                <div style={{ fontFamily:'Barlow Condensed,sans-serif', fontWeight:900, fontSize:'1rem', color: C.accent }}>{opt.protein_g}g</div>
                <div style={{ fontSize:'0.55rem', color: C.muted, textTransform:'uppercase' }}>prot</div>
              </div>
            </div>
          ))}
        </div>
      ))}

      <div style={{ background:`rgba(${C.accentRgb},0.04)`, border:`1px solid rgba(${C.accentRgb},0.1)`, padding:'0.85rem' }}>
        <p style={{ fontFamily:'Barlow Condensed,sans-serif', fontWeight:700, color: C.accent, fontSize:'0.75rem', letterSpacing:'0.1em', textTransform:'uppercase', marginBottom:'3px' }}>Regla #1 LeanGain</p>
        <p style={{ color: C.muted, fontSize:'0.82rem' }}>Proteína no negociable. Si no llegas con comida, cierra con whey. Meta: {protein}g/día.</p>
      </div>
    </div>
  )
}

// ─── COACH ────────────────────────────────────────────────────────────────────
function CoachTab({ profile, C, arc }) {
  const [saved, setSaved] = useState(false)
  const isPremium = profile?.plan === 'premium'
  const isMale = profile?.gender !== 'female'
  const level = LEVELS[profile?.training_level || 'beginner']

  const saveCoach = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    await supabase.from('profiles').update({ avatar_config: { archetype: arc.id, gender: profile.gender } }).eq('id', user.id)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div style={{ padding:'1.25rem' }}>
      <h2 style={{ fontFamily:'Barlow Condensed,sans-serif', fontWeight:900, fontSize:'1.7rem', textTransform:'uppercase', marginBottom:'0.25rem' }}>Tu Coach</h2>
      <p style={{ color: C.muted, fontSize:'0.82rem', marginBottom:'1.5rem' }}>El modelo que te guía al siguiente nivel.</p>

      {/* Coach card */}
      <div style={{ background: arc.surface, border:`1px solid ${C.accent}`, padding:'0', marginBottom:'1.5rem', overflow:'hidden', position:'relative', boxShadow:`0 0 30px rgba(${C.accentRgb},0.15)` }}>
        <div style={{ position:'absolute', top:0, left:0, right:0, height:'2px', background:`linear-gradient(90deg,transparent,${C.accent},transparent)` }} />
        <div style={{ padding:'1.5rem', display:'flex', alignItems:'center', gap:'1.25rem' }}>
          <div style={{ width:'80px', height:'80px', borderRadius:'50%', background:`rgba(${C.accentRgb},0.1)`, border:`2px solid ${C.accent}`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'2.5rem', flexShrink:0 }}>
            {isMale ? '👨' : '👩'}‍💪
          </div>
          <div>
            <div style={{ fontFamily:'Barlow Condensed,sans-serif', fontWeight:900, fontSize:'1.4rem', color: C.accent, textTransform:'uppercase', letterSpacing:'0.08em' }}>{arc.name}</div>
            <div style={{ color: C.muted, fontSize:'0.8rem', marginTop:'2px', fontStyle:'italic' }}>"{arc.mantra}"</div>
            <div style={{ display:'flex', gap:'0.5rem', marginTop:'8px', flexWrap:'wrap' }}>
              <span style={{ background:`rgba(${C.accentRgb},0.1)`, border:`1px solid rgba(${C.accentRgb},0.2)`, padding:'2px 8px', fontFamily:'Barlow Condensed,sans-serif', fontWeight:700, fontSize:'0.62rem', color: C.accent, letterSpacing:'0.08em', textTransform:'uppercase' }}>{level.label}</span>
              <span style={{ background:'rgba(255,255,255,0.04)', border:'1px solid #243040', padding:'2px 8px', fontFamily:'Barlow Condensed,sans-serif', fontWeight:600, fontSize:'0.62rem', color: C.muted, letterSpacing:'0.06em', textTransform:'uppercase' }}>{arc.phase}</span>
            </div>
          </div>
        </div>
        <div style={{ borderTop:`1px solid ${C.border}`, padding:'1rem 1.5rem', background:'rgba(0,0,0,0.2)' }}>
          <div style={{ fontFamily:'Barlow Condensed,sans-serif', fontWeight:700, fontSize:'0.7rem', letterSpacing:'0.1em', color: C.muted, textTransform:'uppercase', marginBottom:'4px' }}>Estilo de comunicación</div>
          <p style={{ color: C.muted, fontSize:'0.82rem', lineHeight:1.6 }}>{arc.coachStyle}</p>
        </div>
      </div>

      {/* Archetype map */}
      <div style={{ marginBottom:'1.5rem' }}>
        <div style={{ fontFamily:'Barlow Condensed,sans-serif', fontWeight:700, fontSize:'0.7rem', letterSpacing:'0.15em', color: C.muted, textTransform:'uppercase', marginBottom:'0.75rem' }}>Mapa evolutivo MetaFit</div>
        <div style={{ display:'flex', alignItems:'center', gap:'4px', overflowX:'auto', paddingBottom:'4px' }}>
          {['street','biohacker','neural','symbionte','cyber','titan'].map((id, i) => {
            const a = ARCHETYPES[id]; const isCurrent = id === arc.id
            return (
              <div key={id} style={{ display:'flex', alignItems:'center', gap:'4px', flexShrink:0 }}>
                <div style={{ background: isCurrent?`rgba(${a.accentRgb},0.15)`:'transparent', border:`1px solid ${isCurrent?a.accent:C.border}`, padding:'4px 8px', textAlign:'center', minWidth:'56px' }}>
                  <div style={{ fontSize:'0.9rem' }}>{a.emoji}</div>
                  <div style={{ fontFamily:'Barlow Condensed,sans-serif', fontWeight:700, fontSize:'0.55rem', color: isCurrent?a.accent:C.dim, textTransform:'uppercase', marginTop:'2px' }}>{a.name.split(' ')[0]}</div>
                </div>
                {i < 5 && <span style={{ color: C.dim, fontSize:'0.6rem' }}>→</span>}
              </div>
            )
          })}
        </div>
      </div>

      {/* Premium lock */}
      {!isPremium && (
        <div style={{ background:'rgba(168,85,247,0.05)', border:'1px solid rgba(168,85,247,0.2)', padding:'1.25rem', marginBottom:'1.25rem' }}>
          <div style={{ fontFamily:'Barlow Condensed,sans-serif', fontWeight:700, color:'#a855f7', fontSize:'0.9rem', textTransform:'uppercase', letterSpacing:'0.05em', marginBottom:'0.5rem' }}>🔒 Premium — Coach que te demuestra</div>
          <p style={{ color: C.muted, fontSize:'0.82rem', lineHeight:1.6 }}>Tu coach aparece en video demostrando cada ejercicio, te llama con voz y analiza tu técnica por cámara.</p>
        </div>
      )}

      <button onClick={saveCoach} style={{ width:'100%', background: saved ? C.green : C.accent, color:'#080c10', fontFamily:'Barlow Condensed,sans-serif', fontWeight:700, fontSize:'1rem', letterSpacing:'0.1em', textTransform:'uppercase', padding:'0.9rem', border:'none', cursor:'pointer', clipPath:'polygon(8px 0%,100% 0%,calc(100% - 8px) 100%,0% 100%)', transition:'background 0.2s' }}>
        {saved ? '✓ Coach guardado' : 'Confirmar mi coach'}
      </button>
    </div>
  )
}

// ─── HABLAR ───────────────────────────────────────────────────────────────────
function HablarTab({ profile, C, arc }) {
  const [messages, setMessages] = useState([
    { role:'assistant', content:`${profile?.name ? profile.name + ', ' : ''}${arc.mantra.replace('.','')}. Soy tu coach ${arc.name}. ${arc.coachStyle.split('.')[0]}. ¿Qué necesitas hoy?` }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<any>(null)

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior:'smooth' }) }, [messages])

  const send = async () => {
    if (!input.trim() || loading) return
    const userMsg = { role:'user', content: input }
    const newMsgs = [...messages, userMsg]
    setMessages(newMsgs); setInput(''); setLoading(true)
    try {
      const res = await fetch('/api/chat', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ messages: newMsgs, profile }) })
      const data = await res.json()
      setMessages(prev => [...prev, { role:'assistant', content: data.reply || 'Error.' }])
    } catch { setMessages(prev => [...prev, { role:'assistant', content:'Error de conexión.' }]) }
    setLoading(false)
  }

  return (
    <div style={{ display:'flex', flexDirection:'column', height:'calc(100vh - 158px)' }}>
      {/* Coach identity bar */}
      <div style={{ background:`rgba(${C.accentRgb},0.06)`, borderBottom:`1px solid rgba(${C.accentRgb},0.1)`, padding:'0.75rem 1.25rem', display:'flex', alignItems:'center', gap:'0.75rem', flexShrink:0 }}>
        <div style={{ width:'36px', height:'36px', borderRadius:'50%', background:`rgba(${C.accentRgb},0.15)`, border:`1px solid ${C.accent}`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.1rem' }}>{arc.emoji}</div>
        <div>
          <div style={{ fontFamily:'Barlow Condensed,sans-serif', fontWeight:700, fontSize:'0.85rem', color: C.accent, textTransform:'uppercase', letterSpacing:'0.05em' }}>Coach {arc.name}</div>
          <div style={{ fontSize:'0.72rem', color: C.muted }}>{LEVELS[profile?.training_level || 'beginner'].label} · {arc.tagline}</div>
        </div>
      </div>

      {/* Messages */}
      <div style={{ flex:1, overflowY:'auto', padding:'1.25rem', display:'flex', flexDirection:'column', gap:'0.85rem' }}>
        {messages.map((m, i) => (
          <div key={i} style={{ display:'flex', justifyContent: m.role==='user'?'flex-end':'flex-start', alignItems:'flex-end', gap:'8px' }}>
            {m.role==='assistant' && (
              <div style={{ width:'28px', height:'28px', borderRadius:'50%', background:`rgba(${C.accentRgb},0.1)`, border:`1px solid ${C.accent}`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.8rem', flexShrink:0 }}>{arc.emoji}</div>
            )}
            <div style={{ maxWidth:'80%', padding:'0.75rem 1rem', fontSize:'0.88rem', lineHeight:1.6, background: m.role==='user'?C.accent:'rgba(255,255,255,0.04)', color: m.role==='user'?'#080c10':C.text, border: m.role==='user'?'none':`1px solid ${C.border}`, borderRadius: m.role==='user'?'16px 16px 4px 16px':'16px 16px 16px 4px' }}>
              {m.content}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display:'flex', alignItems:'flex-end', gap:'8px' }}>
            <div style={{ width:'28px', height:'28px', borderRadius:'50%', background:`rgba(${C.accentRgb},0.1)`, border:`1px solid ${C.accent}`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.8rem' }}>{arc.emoji}</div>
            <div style={{ background:'rgba(255,255,255,0.04)', border:`1px solid ${C.border}`, padding:'0.75rem 1rem', borderRadius:'16px 16px 16px 4px', display:'flex', gap:'4px', alignItems:'center' }}>
              {[0,1,2].map(i => <div key={i} style={{ width:'5px', height:'5px', borderRadius:'50%', background: C.accent, animation:`pulse 1s ${i*0.15}s ease-in-out infinite`, opacity:0.6 }} />)}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Suggestions */}
      <div style={{ padding:'0 1.25rem 0.5rem', display:'flex', gap:'0.4rem', overflowX:'auto', flexShrink:0 }}>
        {['¿Cómo hago el hip thrust?','¿Qué como hoy?','¿Cuánta proteína necesito?'].map(s => (
          <button key={s} onClick={() => setInput(s)} style={{ background:'transparent', border:`1px solid ${C.border}`, color: C.dim, fontFamily:'Barlow,sans-serif', fontSize:'0.72rem', padding:'4px 10px', cursor:'pointer', whiteSpace:'nowrap', flexShrink:0 }}>{s}</button>
        ))}
      </div>

      {/* Input */}
      <div style={{ padding:'0.75rem 1.25rem', borderTop:`1px solid ${C.border}`, background: C.bg2, display:'flex', gap:'0.6rem', flexShrink:0 }}>
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key==='Enter' && send()} placeholder="Pregunta a tu coach..." style={{ flex:1, background: C.bg3, border:`1px solid ${C.border}`, color: C.text, padding:'0.7rem 1rem', fontFamily:'Barlow,sans-serif', fontSize:'0.88rem', outline:'none' }} />
        <button onClick={send} disabled={loading} style={{ background: loading?C.border:C.accent, color:'#080c10', fontFamily:'Barlow Condensed,sans-serif', fontWeight:700, fontSize:'0.8rem', letterSpacing:'0.08em', textTransform:'uppercase', padding:'0.7rem 1.1rem', border:'none', cursor: loading?'not-allowed':'pointer', clipPath:'polygon(6px 0%,100% 0%,calc(100% - 6px) 100%,0% 100%)', whiteSpace:'nowrap', flexShrink:0 }}>Enviar</button>
      </div>
    </div>
  )
}
