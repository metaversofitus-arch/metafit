'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

const ARCHETYPES_LANDING = [
  { id:'street', img:'/archetypes/street.png', name:'Street Dark', mantra:'No me detengo.', color:'#c62828' },
  { id:'biohacker', img:'/archetypes/biohacker.png', name:'Biohacker', mantra:'Todo se mide.', color:'#00bcd4' },
  { id:'neural', img:'/archetypes/neural.png', name:'Neural Elite', mantra:'Me reprogramo.', color:'#7c4dff' },
  { id:'symbionte', img:'/archetypes/symbionte.png', name:'Symbionte', mantra:'Me adapto.', color:'#b71c1c' },
  { id:'cyber', img:'/archetypes/cyber.png', name:'Cyber-Gladiator', mantra:'Compito para ganar.', color:'#76ff03' },
  { id:'titan', img:'/archetypes/titan.png', name:'Titán', mantra:'Dejo marca.', color:'#ffc107' },
]

export default function Home() {
  const [mode, setMode] = useState('landing')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [hoveredArc, setHoveredArc] = useState<string|null>(null)
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

  const inp = { background:'#0a0404', border:'1px solid #2a1010', color:'#e8edf2', padding:'0.75rem 1rem', width:'100%', fontFamily:'Barlow,sans-serif', fontSize:'0.95rem', outline:'none', display:'block' }
  const lbl = { fontSize:'0.68rem', letterSpacing:'0.12em', textTransform:'uppercase' as const, color:'#6b4040', display:'block', marginBottom:'6px' }

  // ── AUTH ──
  if (mode !== 'landing') return (
    <div style={{ minHeight:'100vh', background:'#050202', display:'flex', alignItems:'center', justifyContent:'center', padding:'2rem', position:'relative', overflow:'hidden' }}>
      <div style={{ position:'fixed', inset:0, background:'radial-gradient(ellipse at 50% -10%, rgba(183,28,28,0.15) 0%, transparent 60%)', pointerEvents:'none' }} />
      <div style={{ position:'fixed', inset:0, backgroundImage:'linear-gradient(rgba(42,16,16,0.5) 1px,transparent 1px),linear-gradient(90deg,rgba(42,16,16,0.5) 1px,transparent 1px)', backgroundSize:'40px 40px', pointerEvents:'none', opacity:0.4 }} />
      <div style={{ width:'100%', maxWidth:'400px', position:'relative', zIndex:1 }}>
        <div style={{ textAlign:'center', marginBottom:'2.5rem' }}>
          <Image src="/logo/logo.png" alt="MetaFit" width={160} height={60} style={{ objectFit:'contain', marginBottom:'8px' }} />
          <p style={{ color:'#6b4040', fontSize:'0.75rem', letterSpacing:'0.2em', textTransform:'uppercase' }}>
            {mode==='login'?'Accede a tu protocolo':'Activa tu mutación'}
          </p>
        </div>
        <div style={{ background:'#0a0404', border:'1px solid #2a1010', padding:'2rem', position:'relative' }}>
          <div style={{ position:'absolute', top:0, left:0, right:0, height:'2px', background:'linear-gradient(90deg,transparent,#b71c1c,transparent)' }} />
          <form onSubmit={mode==='login'?handleLogin:handleSignup}>
            <div style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
              {mode==='signup'&&<div>
                <label style={lbl}>Nombre</label>
                <input value={name} onChange={e=>setName(e.target.value)} placeholder="Tu nombre" required style={inp} />
              </div>}
              <div>
                <label style={lbl}>Email</label>
                <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="tu@email.com" required style={inp} />
              </div>
              <div>
                <label style={lbl}>Contraseña</label>
                <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••••" required style={inp} />
              </div>
              {error&&<div style={{ background:'rgba(183,28,28,0.1)', border:'1px solid rgba(183,28,28,0.3)', padding:'0.75rem', color:'#ff5252', fontSize:'0.82rem' }}>{error}</div>}
              <button type="submit" disabled={loading} style={{ background:loading?'#2a1010':'#b71c1c', color:'#fff', fontFamily:'Barlow Condensed,sans-serif', fontWeight:700, fontSize:'1rem', letterSpacing:'0.1em', textTransform:'uppercase', padding:'0.9rem', border:'none', cursor:loading?'not-allowed':'pointer', marginTop:'0.5rem', clipPath:'polygon(8px 0%,100% 0%,calc(100% - 8px) 100%,0% 100%)', boxShadow:loading?'none':'0 0 20px rgba(183,28,28,0.3)', transition:'all 0.2s' }}>
                {loading?'Cargando...':mode==='login'?'Entrar al protocolo':'Iniciar mutación'}
              </button>
            </div>
          </form>
          <p style={{ textAlign:'center', marginTop:'1.5rem', color:'#6b4040', fontSize:'0.82rem' }}>
            {mode==='login'?'¿Sin cuenta? ':'¿Ya tienes cuenta? '}
            <button onClick={()=>{setMode(mode==='login'?'signup':'login');setError('')}} style={{ color:'#b71c1c', background:'none', border:'none', cursor:'pointer', fontFamily:'Barlow,sans-serif' }}>
              {mode==='login'?'Crear cuenta':'Iniciar sesión'}
            </button>
          </p>
        </div>
        <p style={{ textAlign:'center', marginTop:'1.5rem' }}>
          <button onClick={()=>setMode('landing')} style={{ color:'#3d2020', background:'none', border:'none', cursor:'pointer', fontFamily:'Barlow,sans-serif', fontSize:'0.82rem' }}>← Volver</button>
        </p>
      </div>
    </div>
  )

  // ── LANDING ──
  return (
    <div style={{ minHeight:'100vh', background:'#050202', overflowX:'hidden', fontFamily:'Barlow,sans-serif', color:'#e8edf2' }}>
      {/* Organic BG */}
      <div style={{ position:'fixed', inset:0, zIndex:0, pointerEvents:'none', overflow:'hidden' }}>
        <div style={{ position:'absolute', top:'10%', left:'50%', transform:'translateX(-50%)', width:'800px', height:'600px', background:'radial-gradient(ellipse, rgba(183,28,28,0.12) 0%, transparent 65%)', borderRadius:'50%' }} />
        <svg viewBox="0 0 1000 700" preserveAspectRatio="xMidYMid slice" style={{ position:'absolute', inset:0, width:'100%', height:'55%', opacity:0.08 }}>
          {[...Array(14)].map((_,i)=>{
            const a=(i/14)*Math.PI*2, x1=500+Math.cos(a)*70, y1=320+Math.sin(a)*50
            const x2=500+Math.cos(a)*490, y2=320+Math.sin(a)*380
            const cx=500+Math.cos(a+0.6)*220, cy=320+Math.sin(a+0.6)*160
            return <path key={i} d={`M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}`} stroke="#b71c1c" strokeWidth="1.5" fill="none" opacity="0.7"/>
          })}
        </svg>
        <div style={{ position:'absolute', inset:0, backgroundImage:'linear-gradient(rgba(42,16,16,0.35) 1px,transparent 1px),linear-gradient(90deg,rgba(42,16,16,0.35) 1px,transparent 1px)', backgroundSize:'60px 60px', opacity:0.5 }} />
      </div>

      {/* NAV */}
      <nav style={{ position:'fixed', top:0, left:0, right:0, zIndex:100, display:'flex', alignItems:'center', justifyContent:'space-between', padding:'1rem 1.5rem', borderBottom:'1px solid rgba(42,16,16,0.8)', background:'rgba(5,2,2,0.9)', backdropFilter:'blur(16px)' }}>
        <Image src="/logo/logo.png" alt="MetaFit" width={130} height={40} style={{ objectFit:'contain' }} />
        <div style={{ display:'flex', gap:'0.6rem', alignItems:'center' }}>
          <button onClick={()=>setMode('login')} style={{ background:'transparent', color:'#e8edf2', fontFamily:'Barlow Condensed,sans-serif', fontWeight:600, fontSize:'0.85rem', letterSpacing:'0.08em', textTransform:'uppercase', padding:'0.45rem 1.1rem', border:'1px solid #2a1010', cursor:'pointer' }}>Log in</button>
          <button onClick={()=>setMode('signup')} style={{ background:'#b71c1c', color:'#fff', fontFamily:'Barlow Condensed,sans-serif', fontWeight:700, fontSize:'0.85rem', letterSpacing:'0.08em', textTransform:'uppercase', padding:'0.45rem 1.1rem', border:'none', cursor:'pointer', clipPath:'polygon(6px 0%,100% 0%,calc(100% - 6px) 100%,0% 100%)', boxShadow:'0 0 15px rgba(183,28,28,0.3)' }}>Empezar</button>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ position:'relative', zIndex:1, padding:'8.5rem 2rem 5rem', textAlign:'center' }}>
        <div style={{ display:'inline-flex', alignItems:'center', gap:'8px', background:'rgba(183,28,28,0.08)', border:'1px solid rgba(183,28,28,0.2)', padding:'4px 16px', marginBottom:'2rem' }}>
          <div style={{ width:'5px', height:'5px', borderRadius:'50%', background:'#b71c1c', boxShadow:'0 0 8px #b71c1c' }} />
          <span style={{ fontFamily:'Barlow Condensed,sans-serif', fontSize:'0.7rem', letterSpacing:'0.25em', textTransform:'uppercase', color:'#b71c1c' }}>LeanGain Protocol — Sistema activo</span>
        </div>
        <h1 style={{ fontFamily:'Barlow Condensed,sans-serif', fontWeight:900, fontSize:'clamp(3.5rem,13vw,9.5rem)', lineHeight:0.85, letterSpacing:'-0.02em', marginBottom:'1.75rem', textTransform:'uppercase' }}>
          <span style={{ color:'#e8edf2', display:'block' }}>Activa</span>
          <span style={{ color:'#b71c1c', display:'block', textShadow:'0 0 60px rgba(183,28,28,0.6),0 0 120px rgba(183,28,28,0.3)' }}>tu</span>
          <span style={{ color:'#e8edf2', display:'block' }}>mutación</span>
        </h1>
        <p style={{ color:'#8b5a5a', fontSize:'1rem', maxWidth:'460px', margin:'0 auto 2.5rem', lineHeight:1.8 }}>
          Protocolo F3/F4 + nutrición LeanGain. Elige tu arquetipo. Tu coach IA entrena contigo 24/7.
        </p>
        <div style={{ display:'flex', gap:'1rem', justifyContent:'center', flexWrap:'wrap' }}>
          <button onClick={()=>setMode('signup')} style={{ background:'#b71c1c', color:'#fff', fontFamily:'Barlow Condensed,sans-serif', fontWeight:700, fontSize:'1.05rem', letterSpacing:'0.1em', textTransform:'uppercase', padding:'0.9rem 2.5rem', border:'none', cursor:'pointer', clipPath:'polygon(10px 0%,100% 0%,calc(100% - 10px) 100%,0% 100%)', boxShadow:'0 0 40px rgba(183,28,28,0.4)' }}>
            Empezar gratis 3 días
          </button>
          <button onClick={()=>setMode('login')} style={{ background:'transparent', color:'#8b5a5a', fontFamily:'Barlow Condensed,sans-serif', fontWeight:600, fontSize:'0.95rem', letterSpacing:'0.08em', textTransform:'uppercase', padding:'0.9rem 2rem', border:'1px solid #2a1010', cursor:'pointer' }}>
            Ya tengo cuenta →
          </button>
        </div>
        {/* Stats */}
        <div style={{ display:'flex', gap:'2.5rem', justifyContent:'center', marginTop:'4rem', flexWrap:'wrap' }}>
          {[['F3/F4','Frecuencia pierna'],['150-260g','Proteína diaria'],['6','Arquetipos'],['90 días','Resultados reales']].map(([v,l])=>(
            <div key={l} style={{ textAlign:'center' }}>
              <div style={{ fontFamily:'Barlow Condensed,sans-serif', fontWeight:900, fontSize:'1.8rem', color:'#b71c1c', textShadow:'0 0 20px rgba(183,28,28,0.4)' }}>{v}</div>
              <div style={{ fontSize:'0.65rem', color:'#6b4040', letterSpacing:'0.08em', textTransform:'uppercase', marginTop:'2px' }}>{l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* COACHES estándar */}
      <section style={{ position:'relative', zIndex:1, padding:'3rem 2rem', maxWidth:'900px', margin:'0 auto' }}>
        <div style={{ textAlign:'center', marginBottom:'2rem' }}>
          <div style={{ display:'inline-block', background:'rgba(183,28,28,0.06)', border:'1px solid rgba(183,28,28,0.15)', padding:'3px 14px', marginBottom:'0.75rem' }}>
            <span style={{ fontFamily:'Barlow Condensed,sans-serif', fontSize:'0.65rem', letterSpacing:'0.2em', textTransform:'uppercase', color:'#b71c1c' }}>Coaches estándar</span>
          </div>
          <h2 style={{ fontFamily:'Barlow Condensed,sans-serif', fontWeight:900, fontSize:'clamp(1.8rem,4vw,3rem)', textTransform:'uppercase', lineHeight:0.95 }}>
            Tu coach.<br /><span style={{ color:'#b71c1c' }}>Tu modelo a seguir.</span>
          </h2>
        </div>
        <div style={{ maxWidth:'560px', margin:'0 auto', background:'#080404', border:'1px solid #1a0a0a', overflow:'hidden', position:'relative' }}>
          <div style={{ position:'absolute', top:0, left:0, right:0, height:'2px', background:'linear-gradient(90deg,transparent,rgba(183,28,28,0.5),transparent)', zIndex:2 }} />
          <div style={{ position:'relative', overflow:'hidden' }}>
            <img src="/coaches/duo.png" alt="Coaches MetaFit" style={{ width:'100%', objectFit:'cover', display:'block' }} />
            <div style={{ position:'absolute', inset:0, background:'linear-gradient(to top, rgba(5,2,2,0.9) 0%, rgba(5,2,2,0.1) 50%, transparent 100%)' }} />
            <div style={{ position:'absolute', bottom:0, left:0, right:0, padding:'1.5rem', zIndex:2 }}>
              <div style={{ fontFamily:'Barlow Condensed,sans-serif', fontWeight:900, fontSize:'1.2rem', textTransform:'uppercase', letterSpacing:'0.08em', color:'#e8edf2', marginBottom:'4px' }}>Tus Coaches MetaFit</div>
              <div style={{ color:'#8b5a5a', fontSize:'0.82rem' }}>Planes Men & Women · F3 y F4 · Básico y Premium</div>
            </div>
          </div>
        </div>
        <p style={{ textAlign:'center', color:'#6b4040', fontSize:'0.8rem', marginTop:'1rem' }}>Con Premium personalizas completamente tu coach</p>
      </section>

      {/* ARQUETIPOS con imágenes */}
      <section style={{ position:'relative', zIndex:1, padding:'3rem 2rem', maxWidth:'1100px', margin:'0 auto' }}>
        <div style={{ textAlign:'center', marginBottom:'2.5rem' }}>
          <div style={{ display:'inline-block', background:'rgba(183,28,28,0.06)', border:'1px solid rgba(183,28,28,0.15)', padding:'3px 14px', marginBottom:'0.75rem' }}>
            <span style={{ fontFamily:'Barlow Condensed,sans-serif', fontSize:'0.65rem', letterSpacing:'0.2em', textTransform:'uppercase', color:'#b71c1c' }}>Sistema de evolución</span>
          </div>
          <h2 style={{ fontFamily:'Barlow Condensed,sans-serif', fontWeight:900, fontSize:'clamp(1.8rem,4vw,3rem)', textTransform:'uppercase', lineHeight:0.95 }}>
            6 arquetipos.<br /><span style={{ color:'#b71c1c' }}>Un camino.</span>
          </h2>
          <p style={{ color:'#6b4040', fontSize:'0.85rem', marginTop:'0.75rem' }}>Elige el tuyo al registrarte. Define la estética de tu app y la personalidad de tu coach.</p>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(160px, 1fr))', gap:'0.75rem' }}>
          {ARCHETYPES_LANDING.map(arc=>{
            const isHovered = hoveredArc === arc.id
            return (
              <div key={arc.id} onMouseEnter={()=>setHoveredArc(arc.id)} onMouseLeave={()=>setHoveredArc(null)}
                style={{ background:'#080404', border:`1px solid ${isHovered?arc.color:'#1a0a0a'}`, overflow:'hidden', cursor:'pointer', transition:'all 0.25s', transform: isHovered?'translateY(-4px)':'none', boxShadow: isHovered?`0 8px 30px rgba(${arc.color.replace('#','').match(/.{2}/g)?.map(h=>parseInt(h,16)).join(',')},0.25)`:'none', position:'relative' }}>
                <div style={{ position:'absolute', top:0, left:0, right:0, height:'2px', background:`linear-gradient(90deg,transparent,${arc.color},transparent)`, opacity: isHovered?1:0.3, transition:'opacity 0.25s', zIndex:2 }} />
                <div style={{ aspectRatio:'2/3', position:'relative', overflow:'hidden' }}>
                  <img src={arc.img} alt={arc.name} style={{ width:'100%', height:'100%', objectFit:'cover', objectPosition:'top', transition:'transform 0.4s', transform: isHovered?'scale(1.05)':'scale(1)' }} />
                  <div style={{ position:'absolute', inset:0, background:`linear-gradient(to top, rgba(5,2,2,0.95) 0%, rgba(5,2,2,0.2) 50%, transparent 100%)` }} />
                </div>
                <div style={{ padding:'0.75rem', position:'relative', marginTop:'-3rem', zIndex:2 }}>
                  <div style={{ fontFamily:'Barlow Condensed,sans-serif', fontWeight:900, fontSize:'0.9rem', textTransform:'uppercase', letterSpacing:'0.06em', color: isHovered?arc.color:'#e8edf2', transition:'color 0.2s' }}>{arc.name}</div>
                  <div style={{ fontFamily:'Barlow Condensed,sans-serif', fontSize:'0.68rem', color: isHovered?arc.color:'#6b4040', marginTop:'2px', fontStyle:'italic', transition:'color 0.2s' }}>"{arc.mantra}"</div>
                </div>
              </div>
            )
          })}
        </div>
        <div style={{ textAlign:'center', marginTop:'1.25rem' }}>
          <p style={{ color:'#3d2020', fontSize:'0.75rem', letterSpacing:'0.08em' }}>Street Dark → Biohacker → Neural Elite → Symbionte → Cyber-Gladiator → Titán</p>
        </div>
      </section>

      {/* FEATURES */}
      <section style={{ position:'relative', zIndex:1, padding:'3rem 2rem', maxWidth:'1000px', margin:'0 auto' }}>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))', gap:'1rem' }}>
          {[
            {i:'🏋️',t:'Plan F3/F4',d:'Circuitos con carga progresiva. 6 semanas fuertes + descarga. El protocolo que maximiza testosterona natural.'},
            {i:'🥩',t:'LeanGain Nutrición',d:'150-260g proteína diaria. Calculadora personalizada. Sincronizada con tu plan de entrenamiento.'},
            {i:'🎮',t:'Coach con identidad',d:'Tu coach tiene arquetipo, mantra y estilo propio. No es un chatbot genérico — es tu entrenador personal.'},
            {i:'📸',t:'Corrección de técnica',d:'Grábate haciendo el ejercicio. Tu coach analiza y corrige tu postura. Cierra la brecha con un trainer presencial.'},
          ].map(f=>(
            <div key={f.t} style={{ background:'#080404', border:'1px solid #1a0a0a', padding:'1.5rem', position:'relative', overflow:'hidden' }}>
              <div style={{ position:'absolute', top:0, left:0, right:0, height:'1px', background:'linear-gradient(90deg,transparent,rgba(183,28,28,0.3),transparent)' }} />
              <div style={{ fontSize:'1.6rem', marginBottom:'0.75rem' }}>{f.i}</div>
              <h3 style={{ fontFamily:'Barlow Condensed,sans-serif', fontWeight:700, fontSize:'1.05rem', textTransform:'uppercase', letterSpacing:'0.05em', marginBottom:'0.5rem', color:'#e8edf2' }}>{f.t}</h3>
              <p style={{ color:'#6b4040', fontSize:'0.82rem', lineHeight:1.7 }}>{f.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PRICING */}
      <section style={{ position:'relative', zIndex:1, padding:'4rem 2rem', textAlign:'center' }}>
        <h2 style={{ fontFamily:'Barlow Condensed,sans-serif', fontWeight:900, fontSize:'clamp(2rem,5vw,3rem)', textTransform:'uppercase', marginBottom:'0.5rem' }}>Planes</h2>
        <p style={{ color:'#6b4040', marginBottom:'3rem', fontSize:'0.85rem' }}>Sin tarjeta. 3 días gratis. Cancelas cuando quieras.</p>
        <div style={{ display:'flex', gap:'1.25rem', justifyContent:'center', flexWrap:'wrap', maxWidth:'680px', margin:'0 auto' }}>
          {[
            {n:'Básico',p:'$29',tag:null,f:['Plan F3/F4 completo','Nutrición LeanGain','Coach estándar con tu arquetipo','Chat con coach IA']},
            {n:'Premium',p:'$69',tag:'RECOMENDADO',f:['Todo lo básico','Coach completamente personalizado','Video llamada con tu coach','Corrección técnica por cámara','Soporte <24h']},
          ].map(plan=>(
            <div key={plan.n} style={{ background:'#080404', border:`1px solid ${plan.tag?'#b71c1c':'#1a0a0a'}`, padding:'1.75rem', flex:'1', minWidth:'250px', position:'relative', boxShadow:plan.tag?'0 0 40px rgba(183,28,28,0.12)':'none' }}>
              {plan.tag&&<div style={{ position:'absolute', top:'-11px', left:'50%', transform:'translateX(-50%)', background:'#b71c1c', color:'#fff', fontFamily:'Barlow Condensed,sans-serif', fontWeight:700, fontSize:'0.62rem', letterSpacing:'0.15em', padding:'2px 14px' }}>{plan.tag}</div>}
              <h3 style={{ fontFamily:'Barlow Condensed,sans-serif', fontWeight:900, fontSize:'1.4rem', textTransform:'uppercase', marginBottom:'0.5rem' }}>{plan.n}</h3>
              <div style={{ display:'flex', alignItems:'baseline', gap:'4px', marginBottom:'1.5rem', justifyContent:'center' }}>
                <span style={{ fontFamily:'Barlow Condensed,sans-serif', fontWeight:900, fontSize:'2.5rem', color:plan.tag?'#b71c1c':'#e8edf2', textShadow:plan.tag?'0 0 20px rgba(183,28,28,0.4)':'none' }}>{plan.p}</span>
                <span style={{ color:'#6b4040', fontSize:'0.85rem' }}>/mes</span>
              </div>
              <ul style={{ listStyle:'none', textAlign:'left', marginBottom:'1.5rem', display:'flex', flexDirection:'column', gap:'0.5rem' }}>
                {plan.f.map(f=><li key={f} style={{ fontSize:'0.82rem', color:'#8b5a5a', display:'flex', gap:'8px', alignItems:'flex-start' }}><span style={{ color:'#b71c1c', flexShrink:0 }}>✓</span>{f}</li>)}
              </ul>
              <button onClick={()=>setMode('signup')} style={{ width:'100%', background:plan.tag?'#b71c1c':'transparent', color:plan.tag?'#fff':'#b71c1c', fontFamily:'Barlow Condensed,sans-serif', fontWeight:700, fontSize:'0.9rem', letterSpacing:'0.08em', textTransform:'uppercase', padding:'0.75rem', border:'1px solid #b71c1c', cursor:'pointer', clipPath:plan.tag?'polygon(8px 0%,100% 0%,calc(100% - 8px) 100%,0% 100%)':'none', transition:'all 0.2s' }}>
                Empezar gratis
              </button>
            </div>
          ))}
        </div>
      </section>

      <footer style={{ borderTop:'1px solid #1a0a0a', padding:'1.75rem', textAlign:'center', color:'#3d2020', fontSize:'0.75rem', position:'relative', zIndex:1 }}>
        <Image src="/logo/logo.png" alt="MetaFit" width={90} height={28} style={{ objectFit:'contain', opacity:0.4, marginBottom:'8px', display:'block', margin:'0 auto 8px' }} />
        LeanGain Protocol © 2025
      </footer>
    </div>
  )
}
