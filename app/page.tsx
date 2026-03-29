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
    e.preventDefault()
    setLoading(true); setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) { setError(error.message); setLoading(false); return }
    router.push('/dashboard')
  }

  const handleSignup = async (e) => {
    e.preventDefault()
    setLoading(true); setError('')
    const { data, error } = await supabase.auth.signUp({ email, password })
    if (error) { setError(error.message); setLoading(false); return }
    if (data.user) {
      await supabase.from('profiles').insert({ id: data.user.id, email, name, plan: 'basic', gender: 'male', frequency: 'F3', avatar_config: null })
      router.push('/onboarding')
    }
  }

  const inputStyle = {
    background: '#141a22', border: '1px solid #243040', color: '#e8edf2',
    padding: '0.75rem 1rem', width: '100%', fontFamily: 'Barlow, sans-serif',
    fontSize: '0.95rem', outline: 'none', display: 'block',
  }

  if (mode !== 'landing') return (
    <div style={{ minHeight:'100vh', background:'#080c10', display:'flex', alignItems:'center', justifyContent:'center', padding:'2rem', position:'relative', overflow:'hidden' }}>
      <div style={{ position:'fixed', inset:0, backgroundImage:'linear-gradient(#243040 1px,transparent 1px),linear-gradient(90deg,#243040 1px,transparent 1px)', backgroundSize:'40px 40px', opacity:0.25, pointerEvents:'none' }} />
      <div style={{ position:'fixed', top:'-20%', left:'50%', transform:'translateX(-50%)', width:'600px', height:'600px', background:'radial-gradient(circle,rgba(0,229,255,0.07) 0%,transparent 70%)', pointerEvents:'none' }} />
      <div style={{ width:'100%', maxWidth:'400px', position:'relative', zIndex:1 }}>
        <div style={{ textAlign:'center', marginBottom:'2.5rem' }}>
          <div>
            <span style={{ fontFamily:'Barlow Condensed,sans-serif', fontWeight:900, fontSize:'2.5rem', color:'#e8edf2' }}>META</span>
            <span style={{ fontFamily:'Barlow Condensed,sans-serif', fontWeight:900, fontSize:'2.5rem', color:'#00e5ff' }}>FIT</span>
          </div>
          <p style={{ color:'#6b7f94', fontSize:'0.8rem', letterSpacing:'0.15em', textTransform:'uppercase', marginTop:'4px' }}>
            {mode==='login'?'Accede a tu protocolo':'Activa tu mutación'}
          </p>
        </div>
        <div style={{ background:'#1a2332', border:'1px solid #243040', padding:'2rem', position:'relative' }}>
          <div style={{ position:'absolute', top:0, left:0, right:0, height:'2px', background:'linear-gradient(90deg,transparent,#00e5ff,transparent)' }} />
          <form onSubmit={mode==='login'?handleLogin:handleSignup}>
            <div style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
              {mode==='signup'&&<div>
                <label style={{ fontSize:'0.7rem', letterSpacing:'0.1em', textTransform:'uppercase', color:'#6b7f94', display:'block', marginBottom:'6px' }}>Nombre</label>
                <input value={name} onChange={e=>setName(e.target.value)} placeholder="Tu nombre" required style={inputStyle} />
              </div>}
              <div>
                <label style={{ fontSize:'0.7rem', letterSpacing:'0.1em', textTransform:'uppercase', color:'#6b7f94', display:'block', marginBottom:'6px' }}>Email</label>
                <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="tu@email.com" required style={inputStyle} />
              </div>
              <div>
                <label style={{ fontSize:'0.7rem', letterSpacing:'0.1em', textTransform:'uppercase', color:'#6b7f94', display:'block', marginBottom:'6px' }}>Contraseña</label>
                <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••••" required style={inputStyle} />
              </div>
              {error&&<div style={{ background:'rgba(255,61,0,0.1)', border:'1px solid rgba(255,61,0,0.3)', padding:'0.75rem', color:'#ff6b47', fontSize:'0.85rem' }}>{error}</div>}
              <button type="submit" disabled={loading} style={{ background:loading?'#243040':'#00e5ff', color:'#080c10', fontFamily:'Barlow Condensed,sans-serif', fontWeight:700, fontSize:'1rem', letterSpacing:'0.1em', textTransform:'uppercase', padding:'0.85rem', border:'none', cursor:loading?'not-allowed':'pointer', marginTop:'0.5rem', clipPath:'polygon(8px 0%,100% 0%,calc(100% - 8px) 100%,0% 100%)' }}>
                {loading?'Cargando...':mode==='login'?'Entrar al protocolo':'Iniciar mutación'}
              </button>
            </div>
          </form>
          <p style={{ textAlign:'center', marginTop:'1.5rem', color:'#6b7f94', fontSize:'0.85rem' }}>
            {mode==='login'?'¿Sin cuenta? ':'¿Ya tienes cuenta? '}
            <button onClick={()=>setMode(mode==='login'?'signup':'login')} style={{ color:'#00e5ff', background:'none', border:'none', cursor:'pointer', fontFamily:'Barlow,sans-serif' }}>
              {mode==='login'?'Crear cuenta':'Iniciar sesión'}
            </button>
          </p>
        </div>
        <p style={{ textAlign:'center', marginTop:'1.5rem' }}>
          <button onClick={()=>setMode('landing')} style={{ color:'#3d5166', background:'none', border:'none', cursor:'pointer', fontFamily:'Barlow,sans-serif', fontSize:'0.85rem' }}>← Volver</button>
        </p>
      </div>
    </div>
  )

  return (
    <div style={{ minHeight:'100vh', background:'#080c10', overflowX:'hidden', fontFamily:'Barlow,sans-serif' }}>
      <div style={{ position:'fixed', inset:0, backgroundImage:'linear-gradient(#243040 1px,transparent 1px),linear-gradient(90deg,#243040 1px,transparent 1px)', backgroundSize:'60px 60px', opacity:0.18, pointerEvents:'none', zIndex:0 }} />
      <div style={{ position:'fixed', top:'-10%', left:'50%', transform:'translateX(-50%)', width:'900px', height:'700px', background:'radial-gradient(ellipse,rgba(0,229,255,0.06) 0%,transparent 65%)', pointerEvents:'none', zIndex:0 }} />

      <nav style={{ position:'fixed', top:0, left:0, right:0, zIndex:100, display:'flex', alignItems:'center', justifyContent:'space-between', padding:'1.25rem 2rem', borderBottom:'1px solid #243040', background:'rgba(8,12,16,0.85)', backdropFilter:'blur(12px)' }}>
        <div>
          <span style={{ fontFamily:'Barlow Condensed,sans-serif', fontWeight:900, fontSize:'1.6rem', color:'#e8edf2' }}>META</span>
          <span style={{ fontFamily:'Barlow Condensed,sans-serif', fontWeight:900, fontSize:'1.6rem', color:'#00e5ff' }}>FIT</span>
        </div>
        <div style={{ display:'flex', gap:'0.75rem' }}>
          <button onClick={()=>setMode('login')} style={{ background:'transparent', color:'#e8edf2', fontFamily:'Barlow Condensed,sans-serif', fontWeight:600, fontSize:'0.9rem', letterSpacing:'0.08em', textTransform:'uppercase', padding:'0.5rem 1.25rem', border:'1px solid #243040', cursor:'pointer' }}>Log in</button>
          <button onClick={()=>setMode('signup')} style={{ background:'#00e5ff', color:'#080c10', fontFamily:'Barlow Condensed,sans-serif', fontWeight:700, fontSize:'0.9rem', letterSpacing:'0.08em', textTransform:'uppercase', padding:'0.5rem 1.25rem', border:'none', cursor:'pointer', clipPath:'polygon(6px 0%,100% 0%,calc(100% - 6px) 100%,0% 100%)' }}>Empezar</button>
        </div>
      </nav>

      <section style={{ position:'relative', zIndex:1, paddingTop:'9rem', paddingBottom:'5rem', textAlign:'center', padding:'9rem 2rem 5rem' }}>
        <div style={{ display:'inline-block', background:'rgba(0,229,255,0.08)', border:'1px solid rgba(0,229,255,0.2)', padding:'4px 16px', marginBottom:'1.5rem' }}>
          <span style={{ fontFamily:'Barlow Condensed,sans-serif', fontSize:'0.75rem', letterSpacing:'0.2em', textTransform:'uppercase', color:'#00e5ff' }}>LeanGain Protocol</span>
        </div>
        <h1 style={{ fontFamily:'Barlow Condensed,sans-serif', fontWeight:900, fontSize:'clamp(3.5rem,11vw,8rem)', lineHeight:0.88, letterSpacing:'-0.02em', marginBottom:'1.5rem', textTransform:'uppercase' }}>
          <span style={{ color:'#e8edf2', display:'block' }}>Tu entrenador</span>
          <span style={{ color:'#00e5ff', display:'block', textShadow:'0 0 60px rgba(0,229,255,0.5)' }}>virtual</span>
          <span style={{ color:'#e8edf2', display:'block' }}>24/7</span>
        </h1>
        <p style={{ color:'#6b7f94', fontSize:'1.05rem', maxWidth:'500px', margin:'0 auto 2.5rem', lineHeight:1.7 }}>
          Protocolo F3/F4 + nutrición LeanGain. Gana masa magra sin volumen sucio. Tu coach IA corrige tu técnica en tiempo real.
        </p>
        <div style={{ display:'flex', gap:'1rem', justifyContent:'center', flexWrap:'wrap' }}>
          <button onClick={()=>setMode('signup')} style={{ background:'#00e5ff', color:'#080c10', fontFamily:'Barlow Condensed,sans-serif', fontWeight:700, fontSize:'1.1rem', letterSpacing:'0.08em', textTransform:'uppercase', padding:'0.9rem 2.5rem', border:'none', cursor:'pointer', clipPath:'polygon(10px 0%,100% 0%,calc(100% - 10px) 100%,0% 100%)', boxShadow:'0 0 30px rgba(0,229,255,0.25)' }}>Empezar gratis 3 días</button>
          <button onClick={()=>setMode('login')} style={{ background:'transparent', color:'#e8edf2', fontFamily:'Barlow Condensed,sans-serif', fontWeight:600, fontSize:'1rem', letterSpacing:'0.08em', textTransform:'uppercase', padding:'0.9rem 2rem', border:'1px solid #243040', cursor:'pointer' }}>Ya tengo cuenta →</button>
        </div>
        <div style={{ display:'flex', gap:'3rem', justifyContent:'center', marginTop:'4rem', flexWrap:'wrap' }}>
          {[['F3/F4','Frecuencia pierna'],['150-260g','Proteína diaria'],['90 días','Resultados reales'],['24/7','Coach disponible']].map(([v,l])=>(
            <div key={l} style={{ textAlign:'center' }}>
              <div style={{ fontFamily:'Barlow Condensed,sans-serif', fontWeight:900, fontSize:'2rem', color:'#00e5ff' }}>{v}</div>
              <div style={{ fontSize:'0.7rem', color:'#6b7f94', letterSpacing:'0.05em', textTransform:'uppercase' }}>{l}</div>
            </div>
          ))}
        </div>
      </section>

      <section style={{ position:'relative', zIndex:1, padding:'4rem 2rem', maxWidth:'1100px', margin:'0 auto' }}>
        <h2 style={{ fontFamily:'Barlow Condensed,sans-serif', fontWeight:900, fontSize:'clamp(2rem,5vw,3.5rem)', textTransform:'uppercase', textAlign:'center', marginBottom:'3rem' }}>
          Todo lo que necesitas para <span style={{ color:'#00e5ff' }}>transformar</span> tu cuerpo
        </h2>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))', gap:'1.5rem' }}>
          {[
            {i:'🏋️',t:'Plan de Entrenamiento',d:'Circuitos F3/F4 con carga progresiva. 6 semanas fuertes + semana de descarga. Cambia cada 7 semanas.'},
            {i:'🥩',t:'Plan Nutricional',d:'LeanGain Protocol. Sincronizado con tu entreno. 150-260g proteína diaria para recomposición óptima.'},
            {i:'🎮',t:'Tu Coach Avatar',d:'Crea tu modelo a seguir. Tu coach personalizado que demuestra cada ejercicio exactamente como tú.'},
            {i:'📸',t:'Corrección de Técnica IA',d:'Sube un video de 60s o usa la cámara en vivo. Tu coach analiza y corrige tu postura al instante.'},
          ].map(f=>(
            <div key={f.t} style={{ background:'#1a2332', border:'1px solid #243040', padding:'1.75rem', position:'relative', overflow:'hidden' }}>
              <div style={{ position:'absolute', top:0, left:0, right:0, height:'2px', background:'linear-gradient(90deg,transparent,#00e5ff,transparent)', opacity:0.5 }} />
              <div style={{ fontSize:'2rem', marginBottom:'1rem' }}>{f.i}</div>
              <h3 style={{ fontFamily:'Barlow Condensed,sans-serif', fontWeight:700, fontSize:'1.2rem', marginBottom:'0.5rem', textTransform:'uppercase', letterSpacing:'0.05em' }}>{f.t}</h3>
              <p style={{ color:'#6b7f94', fontSize:'0.9rem', lineHeight:1.6 }}>{f.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section style={{ position:'relative', zIndex:1, padding:'4rem 2rem', textAlign:'center' }}>
        <h2 style={{ fontFamily:'Barlow Condensed,sans-serif', fontWeight:900, fontSize:'clamp(2rem,5vw,3rem)', textTransform:'uppercase', marginBottom:'0.75rem' }}>Planes</h2>
        <p style={{ color:'#6b7f94', marginBottom:'3rem' }}>Sin tarjeta. 3 días gratis. Cancelas cuando quieras.</p>
        <div style={{ display:'flex', gap:'1.5rem', justifyContent:'center', flexWrap:'wrap', maxWidth:'700px', margin:'0 auto' }}>
          {[
            {n:'Básico',p:'$29',tag:null,features:['Plan F3/F4 completo','Nutrición LeanGain','Coach básico (avatar estándar)','Chat con coach IA']},
            {n:'Premium',p:'$69',tag:'RECOMENDADO',features:['Todo lo básico','Coach personalizado (tu avatar)','Video llamada con coach','Corrección técnica por cámara','Soporte <24h']},
          ].map(plan=>(
            <div key={plan.n} style={{ background: plan.tag?'#1f2d40':'#1a2332', border:`1px solid ${plan.tag?'#00e5ff':'#243040'}`, padding:'2rem', flex:'1', minWidth:'260px', position:'relative', boxShadow:plan.tag?'0 0 40px rgba(0,229,255,0.1)':'none' }}>
              {plan.tag&&<div style={{ position:'absolute', top:'-12px', left:'50%', transform:'translateX(-50%)', background:'#00e5ff', color:'#080c10', fontFamily:'Barlow Condensed,sans-serif', fontWeight:700, fontSize:'0.7rem', letterSpacing:'0.15em', padding:'2px 14px' }}>{plan.tag}</div>}
              <h3 style={{ fontFamily:'Barlow Condensed,sans-serif', fontWeight:900, fontSize:'1.5rem', textTransform:'uppercase', marginBottom:'0.5rem' }}>{plan.n}</h3>
              <div style={{ display:'flex', alignItems:'baseline', gap:'4px', marginBottom:'1.5rem', justifyContent:'center' }}>
                <span style={{ fontFamily:'Barlow Condensed,sans-serif', fontWeight:900, fontSize:'2.5rem', color:plan.tag?'#00e5ff':'#e8edf2' }}>{plan.p}</span>
                <span style={{ color:'#6b7f94', fontSize:'0.9rem' }}>/mes</span>
              </div>
              <ul style={{ listStyle:'none', textAlign:'left', marginBottom:'1.5rem', display:'flex', flexDirection:'column', gap:'0.6rem' }}>
                {plan.features.map(f=><li key={f} style={{ fontSize:'0.9rem', color:'#6b7f94', display:'flex', gap:'8px' }}><span style={{ color:'#00e5ff' }}>✓</span>{f}</li>)}
              </ul>
              <button onClick={()=>setMode('signup')} style={{ width:'100%', background:plan.tag?'#00e5ff':'transparent', color:plan.tag?'#080c10':'#00e5ff', fontFamily:'Barlow Condensed,sans-serif', fontWeight:700, fontSize:'1rem', letterSpacing:'0.08em', textTransform:'uppercase', padding:'0.75rem', border:'1px solid #00e5ff', cursor:'pointer', clipPath:plan.tag?'polygon(8px 0%,100% 0%,calc(100% - 8px) 100%,0% 100%)':'none' }}>Empezar gratis</button>
            </div>
          ))}
        </div>
      </section>

      <footer style={{ borderTop:'1px solid #243040', padding:'2rem', textAlign:'center', color:'#3d5166', fontSize:'0.8rem', position:'relative', zIndex:1 }}>
        <span style={{ fontFamily:'Barlow Condensed,sans-serif', fontWeight:700, color:'#6b7f94' }}>METAFIT</span> — LeanGain Protocol © 2025
      </footer>
    </div>
  )
}
