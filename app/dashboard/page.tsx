'use client'
import { useState, useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import { getPlan, ABDOMINAL_CIRCUIT, NUTRITION_LEG_DAY, NUTRITION_UPPER_DAY, DayWorkout } from '@/lib/workout-data'
import { useRouter } from 'next/navigation'

const DAYS = ['Lunes','Martes','Miércoles','Jueves','Viernes','Sábado','Domingo']
const TODAY_IDX = new Date().getDay() === 0 ? 6 : new Date().getDay() - 1

type Tab = 'entrenamiento' | 'nutricion' | 'coach' | 'hablar'

const clr = {
  bg:'#080c10', bg2:'#0d1117', bg3:'#141a22', surf:'#1a2332', surf2:'#1f2d40',
  border:'#243040', accent:'#00e5ff', text:'#e8edf2', muted:'#6b7f94', dim:'#3d5166',
  green:'#00ff94', gold:'#ffc107', premium:'#a855f7',
}

function NavBar({ active, setActive, profile, onLogout }) {
  const tabs = [
    { id:'entrenamiento', label:'Entrenamiento', icon:'🏋️' },
    { id:'nutricion', label:'Nutrición', icon:'🥩' },
    { id:'coach', label:'Mi Coach', icon:'🎮', premium: false },
    { id:'hablar', label:'Hablar con Coach', icon:'🎙️' },
  ]
  return (
    <nav style={{ position:'fixed', bottom:0, left:0, right:0, zIndex:100, background:'rgba(13,17,23,0.97)', borderTop:`1px solid ${clr.border}`, display:'flex', alignItems:'stretch', backdropFilter:'blur(12px)' }}>
      {tabs.map(t=>(
        <button key={t.id} onClick={()=>setActive(t.id as Tab)} style={{
          flex:1, padding:'0.75rem 0.5rem', border:'none', background:'transparent',
          cursor:'pointer', display:'flex', flexDirection:'column', alignItems:'center', gap:'3px',
          borderTop: active===t.id?`2px solid ${clr.accent}`:'2px solid transparent',
          transition:'all 0.15s',
        }}>
          <span style={{ fontSize:'1.2rem' }}>{t.icon}</span>
          <span style={{ fontFamily:'Barlow Condensed,sans-serif', fontWeight: active===t.id?700:600, fontSize:'0.65rem', letterSpacing:'0.05em', textTransform:'uppercase', color: active===t.id?clr.accent:clr.muted }}>{t.label}</span>
        </button>
      ))}
    </nav>
  )
}

function Header({ profile, onLogout }) {
  return (
    <header style={{ position:'fixed', top:0, left:0, right:0, zIndex:100, background:'rgba(8,12,16,0.92)', borderBottom:`1px solid ${clr.border}`, backdropFilter:'blur(12px)', padding:'0.9rem 1.25rem', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
      <div>
        <span style={{ fontFamily:'Barlow Condensed,sans-serif', fontWeight:900, fontSize:'1.4rem', color:clr.text }}>META</span>
        <span style={{ fontFamily:'Barlow Condensed,sans-serif', fontWeight:900, fontSize:'1.4rem', color:clr.accent }}>FIT</span>
      </div>
      <div style={{ display:'flex', alignItems:'center', gap:'0.75rem' }}>
        {profile?.plan==='premium'&&<span style={{ background:'linear-gradient(135deg,#a855f7,#7c3aed)', color:'white', fontFamily:'Barlow Condensed,sans-serif', fontWeight:700, fontSize:'0.65rem', letterSpacing:'0.1em', padding:'2px 8px', textTransform:'uppercase' }}>PREMIUM</span>}
        <span style={{ color:clr.muted, fontSize:'0.85rem' }}>{profile?.name||'Atleta'}</span>
        <button onClick={onLogout} style={{ background:'transparent', border:`1px solid ${clr.border}`, color:clr.dim, padding:'4px 10px', cursor:'pointer', fontFamily:'Barlow Condensed,sans-serif', fontSize:'0.7rem', letterSpacing:'0.05em' }}>Salir</button>
      </div>
    </header>
  )
}

// ─── ENTRENAMIENTO ───────────────────────────────────────────────────────────
function EntrenamientoTab({ profile }) {
  const [selectedDay, setSelectedDay] = useState(TODAY_IDX)
  const [week, setWeek] = useState(1)
  const [checkedExs, setCheckedExs] = useState<Set<string>>(new Set())

  const plan: DayWorkout[] = profile ? getPlan(profile.gender, profile.frequency) : getPlan('male','F3')
  const dayWorkout = plan[selectedDay]
  const isDeload = week === 7
  const phase = isDeload ? 'DESCARGA' : `SEMANA ${week}`

  const toggleEx = (key:string) => {
    setCheckedExs(prev => {
      const n = new Set(prev)
      n.has(key) ? n.delete(key) : n.add(key)
      return n
    })
  }

  const totalExs = dayWorkout?.circuits.reduce((acc,c)=>acc+c.exercises.length,0)||0
  const done = [...checkedExs].filter(k=>k.startsWith(`${selectedDay}-`)).length
  const pct = totalExs>0?Math.round((done/totalExs)*100):0

  return (
    <div>
      {/* Week selector */}
      <div style={{ background:clr.bg2, borderBottom:`1px solid ${clr.border}`, padding:'1rem 1.25rem' }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'0.75rem' }}>
          <span style={{ fontFamily:'Barlow Condensed,sans-serif', fontWeight:700, fontSize:'0.75rem', letterSpacing:'0.15em', textTransform:'uppercase', color:clr.muted }}>Ciclo 8 semanas</span>
          <span style={{ background: isDeload?'rgba(255,193,7,0.15)':'rgba(0,229,255,0.1)', color: isDeload?clr.gold:clr.accent, fontFamily:'Barlow Condensed,sans-serif', fontWeight:700, fontSize:'0.7rem', letterSpacing:'0.1em', padding:'2px 10px', textTransform:'uppercase' }}>
            {isDeload?'🔋 DESCARGA':phase}
          </span>
        </div>
        <div style={{ display:'flex', gap:'6px' }}>
          {[1,2,3,4,5,6,7,8].map(w=>(
            <button key={w} onClick={()=>setWeek(w)} style={{
              flex:1, height:'32px', border:`1px solid ${week===w?(w===7?clr.gold:clr.accent):clr.border}`,
              background: week===w?(w===7?'rgba(255,193,7,0.15)':'rgba(0,229,255,0.1)'):'transparent',
              color: week===w?(w===7?clr.gold:clr.accent):clr.dim,
              fontFamily:'Barlow Condensed,sans-serif', fontWeight:700, fontSize:'0.8rem', cursor:'pointer',
            }}>
              {w===7?'D':w===8?'R':w}
            </button>
          ))}
        </div>
        <p style={{ color:clr.dim, fontSize:'0.72rem', marginTop:'6px' }}>D=Descarga · R=Reinicio ciclo</p>
      </div>

      {/* Day selector */}
      <div style={{ display:'flex', overflowX:'auto' as const, borderBottom:`1px solid ${clr.border}`, background:clr.bg3 }}>
        {DAYS.map((d,i)=>{
          const dw = plan[i]
          const isRest = dw?.circuits.length===0
          return (
            <button key={d} onClick={()=>{ setSelectedDay(i); setCheckedExs(new Set()) }} style={{
              flex:'0 0 auto', padding:'0.75rem 0.9rem', border:'none', background:'transparent',
              borderBottom: selectedDay===i?`2px solid ${clr.accent}`:'2px solid transparent',
              cursor: isRest?'default':'pointer', display:'flex', flexDirection:'column', alignItems:'center', gap:'2px',
            }}>
              <span style={{ fontFamily:'Barlow Condensed,sans-serif', fontWeight:700, fontSize:'0.75rem', letterSpacing:'0.05em', textTransform:'uppercase', color: selectedDay===i?clr.accent:isRest?clr.dim:clr.muted }}>{d.slice(0,3)}</span>
              {!isRest&&<span style={{ fontSize:'0.6rem', color: selectedDay===i?clr.accent:clr.dim }}>{dw.focus.split(' ')[0]}</span>}
              {isRest&&<span style={{ fontSize:'0.6rem', color:clr.dim }}>Descanso</span>}
            </button>
          )
        })}
      </div>

      {/* Content */}
      <div style={{ padding:'1.25rem' }}>
        {dayWorkout?.circuits.length===0?(
          <div style={{ textAlign:'center', padding:'3rem 1rem' }}>
            <div style={{ fontSize:'3rem', marginBottom:'1rem' }}>🌿</div>
            <h3 style={{ fontFamily:'Barlow Condensed,sans-serif', fontWeight:700, fontSize:'1.4rem', textTransform:'uppercase', color:clr.text, marginBottom:'0.5rem' }}>Descanso Activo</h3>
            <p style={{ color:clr.muted, fontSize:'0.9rem' }}>Movilidad, caminata suave o foam rolling. Tu músculo crece mientras descansas.</p>
          </div>
        ):(
          <>
            {/* Progress */}
            {totalExs>0&&(
              <div style={{ marginBottom:'1.25rem' }}>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'6px' }}>
                  <span style={{ fontSize:'0.8rem', color:clr.muted }}>Progreso de hoy</span>
                  <span style={{ fontFamily:'Barlow Condensed,sans-serif', fontWeight:700, color:pct===100?clr.green:clr.accent }}>{pct}%</span>
                </div>
                <div style={{ height:'4px', background:clr.border, borderRadius:'2px', overflow:'hidden' }}>
                  <div style={{ height:'100%', width:`${pct}%`, background: pct===100?clr.green:clr.accent, transition:'width 0.3s', borderRadius:'2px' }} />
                </div>
              </div>
            )}

            <h2 style={{ fontFamily:'Barlow Condensed,sans-serif', fontWeight:900, fontSize:'1.6rem', textTransform:'uppercase', color:clr.text, marginBottom:'1.25rem' }}>
              {dayWorkout.focus}
            </h2>

            {dayWorkout.circuits.map((circuit, ci)=>(
              <div key={ci} style={{ marginBottom:'1.5rem' }}>
                <div style={{ display:'flex', alignItems:'center', gap:'0.75rem', marginBottom:'0.9rem' }}>
                  <div style={{ background: circuit.name==='Remate'?'#ff3d00':clr.accent, color:clr.bg, fontFamily:'Barlow Condensed,sans-serif', fontWeight:900, fontSize:'0.65rem', letterSpacing:'0.1em', padding:'3px 10px', clipPath:'polygon(4px 0%,100% 0%,calc(100% - 4px) 100%,0% 100%)' }}>
                    {circuit.name.toUpperCase()}
                  </div>
                  <span style={{ fontFamily:'Barlow Condensed,sans-serif', fontWeight:700, fontSize:'0.8rem', color:clr.muted, letterSpacing:'0.05em' }}>{circuit.sets} SERIES</span>
                </div>
                <div style={{ display:'flex', flexDirection:'column', gap:'0.5rem' }}>
                  {circuit.exercises.map((ex, ei)=>{
                    const key = `${selectedDay}-${ci}-${ei}`
                    const checked = checkedExs.has(key)
                    return (
                      <div key={ei} onClick={()=>toggleEx(key)} style={{
                        background: checked?'rgba(0,255,148,0.06)':clr.surf, border:`1px solid ${checked?clr.green:clr.border}`,
                        padding:'0.85rem 1rem', cursor:'pointer', display:'flex', alignItems:'flex-start', gap:'0.75rem',
                        transition:'all 0.15s',
                      }}>
                        <div style={{ width:'20px', height:'20px', border:`2px solid ${checked?clr.green:clr.border}`, background: checked?clr.green:'transparent', flexShrink:0, marginTop:'1px', display:'flex', alignItems:'center', justifyContent:'center', transition:'all 0.15s' }}>
                          {checked&&<span style={{ color:clr.bg, fontSize:'0.7rem', fontWeight:900 }}>✓</span>}
                        </div>
                        <div style={{ flex:1 }}>
                          <div style={{ fontFamily:'Barlow Condensed,sans-serif', fontWeight:700, fontSize:'1rem', color:checked?clr.muted:clr.text, textDecoration:checked?'line-through':'none', textTransform:'uppercase', letterSpacing:'0.03em' }}>{ex.name}</div>
                          <div style={{ color:clr.accent, fontSize:'0.82rem', marginTop:'2px', fontWeight:600 }}>{ex.reps}</div>
                          {ex.notes&&<div style={{ color:clr.dim, fontSize:'0.75rem', marginTop:'2px' }}>💡 {ex.notes}</div>}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}

            {/* Abs */}
            <div style={{ marginTop:'1rem', background:'rgba(0,229,255,0.04)', border:'1px solid rgba(0,229,255,0.1)', padding:'1rem' }}>
              <p style={{ fontFamily:'Barlow Condensed,sans-serif', fontWeight:700, fontSize:'0.8rem', letterSpacing:'0.1em', color:clr.muted, textTransform:'uppercase', marginBottom:'0.5rem' }}>+ Opcional: Rutina Abdomen</p>
              <p style={{ color:clr.dim, fontSize:'0.8rem' }}>3 series · Crunch · Elevación piernas · Rotación disco · Plancha lateral · Escaladores</p>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

// ─── NUTRICIÓN ───────────────────────────────────────────────────────────────
function NutricionTab({ profile }) {
  const [dayType, setDayType] = useState('leg')
  const [weight, setWeight] = useState(75)
  const nutrition = dayType==='leg'?NUTRITION_LEG_DAY:NUTRITION_UPPER_DAY
  const protein = Math.round(weight * 2.2)
  const creatine = (weight * 1.2).toFixed(1)

  return (
    <div style={{ padding:'1.25rem' }}>
      <h2 style={{ fontFamily:'Barlow Condensed,sans-serif', fontWeight:900, fontSize:'1.8rem', textTransform:'uppercase', marginBottom:'0.25rem' }}>LeanGain Protocol</h2>
      <p style={{ color:clr.muted, fontSize:'0.85rem', marginBottom:'1.5rem' }}>Nutrición sincronizada con tu entrenamiento.</p>

      {/* Weight */}
      <div style={{ background:clr.surf, border:`1px solid ${clr.border}`, padding:'1rem', marginBottom:'1.25rem' }}>
        <label style={{ fontSize:'0.7rem', letterSpacing:'0.1em', textTransform:'uppercase', color:clr.muted, display:'block', marginBottom:'8px' }}>Tu peso (kg) — para calcular proteína</label>
        <div style={{ display:'flex', alignItems:'center', gap:'1rem' }}>
          <input type="range" min={45} max={150} value={weight} onChange={e=>setWeight(+e.target.value)} style={{ flex:1, accentColor:clr.accent }} />
          <span style={{ fontFamily:'Barlow Condensed,sans-serif', fontWeight:900, fontSize:'1.5rem', color:clr.accent, minWidth:'60px' }}>{weight}kg</span>
        </div>
      </div>

      {/* Protein target */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'0.75rem', marginBottom:'1.5rem' }}>
        {[
          {label:'Proteína objetivo',val:`${protein}g`,sub:'2.2g × kg'},
          {label:'Creatina diaria',val:`${creatine}g`,sub:'1.2g × kg'},
          {label:'Meta mínima',val:'150g',sub:'Proteína/día'},
        ].map(s=>(
          <div key={s.label} style={{ background:clr.bg3, border:`1px solid ${clr.border}`, padding:'0.9rem', textAlign:'center' }}>
            <div style={{ fontFamily:'Barlow Condensed,sans-serif', fontWeight:900, fontSize:'1.4rem', color:clr.accent }}>{s.val}</div>
            <div style={{ fontSize:'0.65rem', color:clr.muted, textTransform:'uppercase', letterSpacing:'0.05em', marginTop:'2px' }}>{s.label}</div>
            <div style={{ fontSize:'0.65rem', color:clr.dim, marginTop:'2px' }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Day type toggle */}
      <div style={{ display:'flex', gap:'0.75rem', marginBottom:'1.5rem' }}>
        {[{id:'leg',label:'🦵 Día de Pierna',sub:'Carbs altos'},{id:'upper',label:'💪 Día Upper',sub:'Carbs moderados'}].map(dt=>(
          <button key={dt.id} onClick={()=>setDayType(dt.id)} style={{ flex:1, padding:'0.85rem', border:`1px solid ${dayType===dt.id?clr.accent:clr.border}`, background: dayType===dt.id?'rgba(0,229,255,0.08)':'transparent', color: dayType===dt.id?clr.accent:clr.muted, fontFamily:'Barlow Condensed,sans-serif', fontWeight:700, fontSize:'0.85rem', cursor:'pointer', textAlign:'center' as const }}>
            <div>{dt.label}</div>
            <div style={{ fontSize:'0.65rem', fontWeight:400, marginTop:'2px', color:dayType===dt.id?clr.accent:clr.dim }}>{dt.sub}</div>
          </button>
        ))}
      </div>

      {/* Meals */}
      {[
        {key:'pre_workout',label:'Batido Pre-Entreno',icon:'⚡'},
        {key:'post_workout',label:'Comida Post-Entreno',icon:'🍳'},
        {key:'snack',label:'Snack Proteico',icon:'🥜'},
        {key:'dinner',label:'Cena',icon:'🌙'},
      ].map(meal=>(
        <div key={meal.key} style={{ marginBottom:'1.25rem' }}>
          <div style={{ display:'flex', alignItems:'center', gap:'0.5rem', marginBottom:'0.6rem' }}>
            <span>{meal.icon}</span>
            <span style={{ fontFamily:'Barlow Condensed,sans-serif', fontWeight:700, fontSize:'0.95rem', textTransform:'uppercase', letterSpacing:'0.05em', color:clr.text }}>{meal.label}</span>
          </div>
          {(nutrition[meal.key] as any[]).map((opt, i)=>(
            <div key={i} style={{ background:clr.surf, border:`1px solid ${clr.border}`, padding:'0.9rem', marginBottom:'0.5rem', display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:'1rem' }}>
              <div style={{ flex:1 }}>
                <div style={{ fontFamily:'Barlow Condensed,sans-serif', fontWeight:700, fontSize:'0.9rem', color:clr.text, marginBottom:'2px' }}>{opt.name}</div>
                <div style={{ color:clr.muted, fontSize:'0.8rem', lineHeight:1.5 }}>{opt.description}</div>
              </div>
              <div style={{ background:'rgba(0,229,255,0.1)', border:`1px solid rgba(0,229,255,0.2)`, padding:'4px 10px', flexShrink:0, textAlign:'center' as const }}>
                <div style={{ fontFamily:'Barlow Condensed,sans-serif', fontWeight:900, fontSize:'1.1rem', color:clr.accent }}>{opt.protein_g}g</div>
                <div style={{ fontSize:'0.6rem', color:clr.muted, textTransform:'uppercase' }}>prot</div>
              </div>
            </div>
          ))}
        </div>
      ))}

      <div style={{ background:'rgba(0,229,255,0.04)', border:'1px solid rgba(0,229,255,0.1)', padding:'1rem' }}>
        <p style={{ fontFamily:'Barlow Condensed,sans-serif', fontWeight:700, color:clr.accent, fontSize:'0.8rem', letterSpacing:'0.1em', textTransform:'uppercase', marginBottom:'4px' }}>Regla #1 LeanGain</p>
        <p style={{ color:clr.muted, fontSize:'0.85rem' }}>La proteína es NO negociable. Si no llegas con comida, cierra con whey. Mínimo 150g/día, objetivo {protein}g/día.</p>
      </div>
    </div>
  )
}

// ─── COACH TAB ───────────────────────────────────────────────────────────────
function CoachTab({ profile }) {
  const [avatarName, setAvatarName] = useState('TITAN')
  const [skin, setSkin] = useState('medium')
  const [hair, setHair] = useState('short')
  const [hairColor, setHairColor] = useState('dark')
  const [build, setBuild] = useState('athletic')
  const [saved, setSaved] = useState(false)

  const isPremium = profile?.plan === 'premium'

  const saveAvatar = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const config = { name: avatarName, skin, hair, hair_color: hairColor, body: build, outfit: 'default' }
    await supabase.from('profiles').update({ avatar_config: config }).eq('id', user.id)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const OptRow = ({ label, value, setValue, options }) => (
    <div style={{ marginBottom:'1.25rem' }}>
      <label style={{ fontSize:'0.7rem', letterSpacing:'0.1em', textTransform:'uppercase', color:clr.muted, display:'block', marginBottom:'8px' }}>{label}</label>
      <div style={{ display:'flex', gap:'0.5rem', flexWrap:'wrap' }}>
        {options.map(o=>(
          <button key={o.id} onClick={()=>setValue(o.id)} style={{ padding:'0.6rem 1rem', border:`1px solid ${value===o.id?clr.accent:clr.border}`, background: value===o.id?'rgba(0,229,255,0.1)':'transparent', color: value===o.id?clr.accent:clr.muted, fontFamily:'Barlow Condensed,sans-serif', fontWeight:600, fontSize:'0.8rem', cursor:'pointer', letterSpacing:'0.05em', textTransform:'uppercase' }}>
            {o.label}
          </button>
        ))}
      </div>
    </div>
  )

  return (
    <div style={{ padding:'1.25rem' }}>
      <h2 style={{ fontFamily:'Barlow Condensed,sans-serif', fontWeight:900, fontSize:'1.8rem', textTransform:'uppercase', marginBottom:'0.25rem' }}>Tu Coach Virtual</h2>
      <p style={{ color:clr.muted, fontSize:'0.85rem', marginBottom:'1.5rem' }}>Crea el modelo que quieres alcanzar. Ese es tu coach.</p>

      {/* Avatar preview */}
      <div style={{ background:clr.bg3, border:`1px solid ${clr.border}`, padding:'2rem', textAlign:'center', marginBottom:'1.5rem', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', inset:0, background:'radial-gradient(circle at 50% 30%,rgba(0,229,255,0.08),transparent 70%)', pointerEvents:'none' }} />
        <div style={{ fontSize:'5rem', marginBottom:'0.5rem' }}>{profile?.gender==='female'?'👩':'👨'}‍💪</div>
        <div style={{ fontFamily:'Barlow Condensed,sans-serif', fontWeight:900, fontSize:'1.5rem', color:clr.accent, letterSpacing:'0.1em' }}>{avatarName}</div>
        <div style={{ color:clr.muted, fontSize:'0.8rem', marginTop:'4px', textTransform:'uppercase', letterSpacing:'0.05em' }}>{build} · {skin} · {hair} {hairColor}</div>
        {!isPremium&&<div style={{ marginTop:'1rem', background:'rgba(168,85,247,0.1)', border:'1px solid rgba(168,85,247,0.2)', padding:'0.5rem', fontSize:'0.8rem', color:'#a855f7' }}>
          🔒 Coach personalizado en ejercicios disponible con <strong>Premium</strong>
        </div>}
      </div>

      {/* Nombre */}
      <div style={{ marginBottom:'1.25rem' }}>
        <label style={{ fontSize:'0.7rem', letterSpacing:'0.1em', textTransform:'uppercase', color:clr.muted, display:'block', marginBottom:'8px' }}>Nombre de tu coach</label>
        <input value={avatarName} onChange={e=>setAvatarName(e.target.value.toUpperCase())} maxLength={15} style={{ background:clr.bg3, border:`1px solid ${clr.border}`, color:clr.text, padding:'0.75rem 1rem', width:'100%', fontFamily:'Barlow Condensed,sans-serif', fontSize:'1rem', fontWeight:700, outline:'none', letterSpacing:'0.08em', textTransform:'uppercase' }} />
      </div>

      <OptRow label="Tono de piel" value={skin} setValue={setSkin} options={[{id:'light',label:'Claro'},{id:'medium',label:'Medio'},{id:'dark',label:'Oscuro'}]} />
      <OptRow label="Cabello" value={hair} setValue={setHair} options={[{id:'short',label:'Corto'},{id:'medium',label:'Medio'},{id:'long',label:'Largo'},{id:'none',label:'Rapado'}]} />
      <OptRow label="Color de cabello" value={hairColor} setValue={setHairColor} options={[{id:'dark',label:'Oscuro'},{id:'brown',label:'Castaño'},{id:'blonde',label:'Rubio'},{id:'red',label:'Rojo'}]} />
      <OptRow label="Complexión" value={build} setValue={setBuild} options={[{id:'lean',label:'Delgado'},{id:'athletic',label:'Atlético'},{id:'muscular',label:'Musculoso'},{id:'bulk',label:'Voluminoso'}]} />

      {!isPremium&&(
        <div style={{ background:'rgba(168,85,247,0.05)', border:'1px solid rgba(168,85,247,0.2)', padding:'1.25rem', marginBottom:'1.25rem' }}>
          <div style={{ fontFamily:'Barlow Condensed,sans-serif', fontWeight:700, color:'#a855f7', fontSize:'0.9rem', textTransform:'uppercase', letterSpacing:'0.05em', marginBottom:'0.5rem' }}>🔒 Premium — Coach que te entrena</div>
          <p style={{ color:clr.muted, fontSize:'0.85rem', lineHeight:1.6 }}>Tu avatar aparece en las demostraciones de cada ejercicio, te llama en video llamada y te habla mientras entrenas. El coach que construiste, literalmente te entrena.</p>
        </div>
      )}

      <button onClick={saveAvatar} style={{ width:'100%', background:saved?clr.green:clr.accent, color:clr.bg, fontFamily:'Barlow Condensed,sans-serif', fontWeight:700, fontSize:'1rem', letterSpacing:'0.1em', textTransform:'uppercase', padding:'0.9rem', border:'none', cursor:'pointer', clipPath:'polygon(8px 0%,100% 0%,calc(100% - 8px) 100%,0% 100%)', transition:'background 0.2s' }}>
        {saved?'✓ Coach guardado':'Guardar mi coach'}
      </button>
    </div>
  )
}

// ─── CHAT TAB ────────────────────────────────────────────────────────────────
function HablarTab({ profile }) {
  const [messages, setMessages] = useState([
    { role:'assistant', content:`¡Hola${profile?.name?' '+profile.name:''}! Soy tu coach MetaFit. Puedo ayudarte con tu entrenamiento, técnica, nutrición LeanGain o cualquier duda del protocolo. ¿Qué necesitas hoy?` }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const isPremium = profile?.plan === 'premium'

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior:'smooth' }) }, [messages])

  const send = async () => {
    if (!input.trim() || loading) return
    const userMsg = { role:'user', content:input }
    const newMsgs = [...messages, userMsg]
    setMessages(newMsgs)
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ messages: newMsgs, profile }),
      })
      const data = await res.json()
      setMessages(prev => [...prev, { role:'assistant', content: data.reply || 'No pude procesar tu mensaje.' }])
    } catch {
      setMessages(prev => [...prev, { role:'assistant', content:'Error de conexión. Inténtalo de nuevo.' }])
    }
    setLoading(false)
  }

  return (
    <div style={{ display:'flex', flexDirection:'column', height:'calc(100vh - 120px)' }}>
      {isPremium&&(
        <div style={{ background:'rgba(168,85,247,0.08)', border:'1px solid rgba(168,85,247,0.2)', padding:'0.75rem 1.25rem', display:'flex', alignItems:'center', gap:'0.75rem' }}>
          <span style={{ fontSize:'1.2rem' }}>🎙️</span>
          <div>
            <div style={{ fontFamily:'Barlow Condensed,sans-serif', fontWeight:700, fontSize:'0.85rem', color:'#a855f7', textTransform:'uppercase', letterSpacing:'0.05em' }}>Premium — Coach con voz activado</div>
            <div style={{ fontSize:'0.75rem', color:clr.muted }}>Video llamada con tu coach próximamente</div>
          </div>
        </div>
      )}

      {/* Messages */}
      <div style={{ flex:1, overflowY:'auto', padding:'1.25rem', display:'flex', flexDirection:'column', gap:'1rem' }}>
        {messages.map((m,i)=>(
          <div key={i} style={{ display:'flex', justifyContent: m.role==='user'?'flex-end':'flex-start' }}>
            {m.role==='assistant'&&(
              <div style={{ width:'32px', height:'32px', borderRadius:'50%', background:'rgba(0,229,255,0.1)', border:`1px solid ${clr.accent}`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, marginRight:'8px', fontSize:'0.9rem' }}>💪</div>
            )}
            <div style={{
              maxWidth:'80%', padding:'0.75rem 1rem', fontSize:'0.9rem', lineHeight:1.6,
              background: m.role==='user'?clr.accent:clr.surf2,
              color: m.role==='user'?clr.bg:clr.text,
              border: m.role==='user'?'none':`1px solid ${clr.border}`,
              borderRadius: m.role==='user'?'16px 16px 4px 16px':'16px 16px 16px 4px',
            }}>{m.content}</div>
          </div>
        ))}
        {loading&&(
          <div style={{ display:'flex', gap:'8px', alignItems:'center' }}>
            <div style={{ width:'32px', height:'32px', borderRadius:'50%', background:'rgba(0,229,255,0.1)', border:`1px solid ${clr.accent}`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.9rem' }}>💪</div>
            <div style={{ background:clr.surf2, border:`1px solid ${clr.border}`, padding:'0.75rem 1rem', borderRadius:'16px 16px 16px 4px' }}>
              <div style={{ display:'flex', gap:'4px' }}>
                {[0,1,2].map(i=><div key={i} style={{ width:'6px', height:'6px', borderRadius:'50%', background:clr.accent, animation:`pulse 1.2s ease-in-out ${i*0.2}s infinite` }} />)}
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={{ padding:'1rem 1.25rem', borderTop:`1px solid ${clr.border}`, background:clr.bg2, display:'flex', gap:'0.75rem' }}>
        <input
          value={input}
          onChange={e=>setInput(e.target.value)}
          onKeyDown={e=>e.key==='Enter'&&send()}
          placeholder="Pregunta a tu coach..."
          style={{ flex:1, background:clr.bg3, border:`1px solid ${clr.border}`, color:clr.text, padding:'0.75rem 1rem', fontFamily:'Barlow,sans-serif', fontSize:'0.9rem', outline:'none' }}
        />
        <button onClick={send} disabled={loading} style={{ background:loading?clr.border:clr.accent, color:clr.bg, fontFamily:'Barlow Condensed,sans-serif', fontWeight:700, fontSize:'0.85rem', letterSpacing:'0.08em', textTransform:'uppercase', padding:'0.75rem 1.25rem', border:'none', cursor:loading?'not-allowed':'pointer', clipPath:'polygon(6px 0%,100% 0%,calc(100% - 6px) 100%,0% 100%)', whiteSpace:'nowrap' }}>
          Enviar
        </button>
      </div>
    </div>
  )
}

// ─── MAIN DASHBOARD ──────────────────────────────────────────────────────────
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

  const logout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  if (loading) return (
    <div style={{ minHeight:'100vh', background:clr.bg, display:'flex', alignItems:'center', justifyContent:'center' }}>
      <div style={{ textAlign:'center' }}>
        <div style={{ fontFamily:'Barlow Condensed,sans-serif', fontWeight:900, fontSize:'2rem', color:clr.accent, letterSpacing:'0.1em', marginBottom:'0.5rem' }}>METAFIT</div>
        <div style={{ color:clr.muted, fontSize:'0.85rem', letterSpacing:'0.1em', textTransform:'uppercase' }}>Cargando protocolo...</div>
      </div>
    </div>
  )

  return (
    <div style={{ background:clr.bg, minHeight:'100vh', fontFamily:'Barlow,sans-serif', color:clr.text }}>
      <Header profile={profile} onLogout={logout} />
      <main style={{ paddingTop:'64px', paddingBottom:'80px' }}>
        {tab==='entrenamiento'&&<EntrenamientoTab profile={profile} />}
        {tab==='nutricion'&&<NutricionTab profile={profile} />}
        {tab==='coach'&&<CoachTab profile={profile} />}
        {tab==='hablar'&&<HablarTab profile={profile} />}
      </main>
      <NavBar active={tab} setActive={setTab} profile={profile} onLogout={logout} />
    </div>
  )
}
