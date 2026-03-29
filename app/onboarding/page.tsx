'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

const S = {
  page: { minHeight:'100vh', background:'#080c10', display:'flex', alignItems:'center', justifyContent:'center', padding:'2rem', fontFamily:'Barlow,sans-serif' },
  card: { width:'100%', maxWidth:'520px', background:'#1a2332', border:'1px solid #243040', padding:'2.5rem', position:'relative' as const },
  topBar: { position:'absolute' as const, top:0, left:0, right:0, height:'2px', background:'linear-gradient(90deg,transparent,#00e5ff,transparent)' },
  title: { fontFamily:'Barlow Condensed,sans-serif', fontWeight:900, fontSize:'2rem', textTransform:'uppercase' as const, letterSpacing:'0.05em', color:'#e8edf2', marginBottom:'0.5rem' },
  sub: { color:'#6b7f94', fontSize:'0.9rem', marginBottom:'2rem' },
  label: { fontSize:'0.7rem', letterSpacing:'0.1em', textTransform:'uppercase' as const, color:'#6b7f94', display:'block' as const, marginBottom:'8px' },
  optRow: { display:'flex', gap:'0.75rem', flexWrap:'wrap' as const, marginBottom:'1.5rem' },
  btn: (active:boolean, color='#00e5ff') => ({
    flex:'1', minWidth:'120px', padding:'0.85rem', border:`1px solid ${active?color:'#243040'}`,
    background: active?`rgba(0,229,255,0.1)`:'transparent', color: active?color:'#6b7f94',
    fontFamily:'Barlow Condensed,sans-serif', fontWeight:700, fontSize:'0.95rem',
    letterSpacing:'0.08em', textTransform:'uppercase' as const, cursor:'pointer', transition:'all 0.15s',
  }),
  cta: { width:'100%', background:'#00e5ff', color:'#080c10', fontFamily:'Barlow Condensed,sans-serif', fontWeight:700, fontSize:'1rem', letterSpacing:'0.1em', textTransform:'uppercase' as const, padding:'0.9rem', border:'none', cursor:'pointer', marginTop:'1rem', clipPath:'polygon(8px 0%,100% 0%,calc(100% - 8px) 100%,0% 100%)' },
}

export default function Onboarding() {
  const [gender, setGender] = useState('male')
  const [frequency, setFrequency] = useState('F3')
  const [goal, setGoal] = useState('volume')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const save = async () => {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/'); return }
    await supabase.from('profiles').update({ gender, frequency }).eq('id', user.id)
    router.push('/dashboard')
  }

  return (
    <div style={S.page}>
      <div style={S.card}>
        <div style={S.topBar} />
        <div style={{ textAlign:'center', marginBottom:'2rem' }}>
          <span style={{ fontFamily:'Barlow Condensed,sans-serif', fontWeight:900, fontSize:'1.4rem', color:'#e8edf2' }}>META</span>
          <span style={{ fontFamily:'Barlow Condensed,sans-serif', fontWeight:900, fontSize:'1.4rem', color:'#00e5ff' }}>FIT</span>
        </div>
        <h2 style={S.title}>Configura tu protocolo</h2>
        <p style={S.sub}>Esto determina tu plan de entrenamiento y nutrición personalizado.</p>

        <label style={S.label}>Género</label>
        <div style={S.optRow}>
          <button style={S.btn(gender==='male')} onClick={()=>setGender('male')}>♂ Hombre</button>
          <button style={S.btn(gender==='female')} onClick={()=>setGender('female')}>♀ Mujer</button>
        </div>

        <label style={S.label}>Frecuencia de pierna semanal</label>
        <div style={S.optRow}>
          <button style={S.btn(frequency==='F3')} onClick={()=>setFrequency('F3')}>
            <div>F3</div>
            <div style={{ fontSize:'0.7rem', fontWeight:400, marginTop:'2px', color: frequency==='F3'?'#00e5ff':'#3d5166' }}>3 días/sem</div>
          </button>
          <button style={S.btn(frequency==='F4')} onClick={()=>setFrequency('F4')}>
            <div>F4</div>
            <div style={{ fontSize:'0.7rem', fontWeight:400, marginTop:'2px', color: frequency==='F4'?'#00e5ff':'#3d5166' }}>4 días/sem · Más intenso</div>
          </button>
        </div>

        <label style={S.label}>Objetivo principal</label>
        <div style={S.optRow}>
          <button style={S.btn(goal==='volume')} onClick={()=>setGoal('volume')}>
            <div>Volumen</div>
            <div style={{ fontSize:'0.7rem', fontWeight:400, marginTop:'2px', color: goal==='volume'?'#00e5ff':'#3d5166' }}>Ganar masa</div>
          </button>
          <button style={S.btn(goal==='definition')} onClick={()=>setGoal('definition')}>
            <div>Definición</div>
            <div style={{ fontSize:'0.7rem', fontWeight:400, marginTop:'2px', color: goal==='definition'?'#00e5ff':'#3d5166' }}>Perder grasa</div>
          </button>
        </div>

        <div style={{ background:'rgba(0,229,255,0.05)', border:'1px solid rgba(0,229,255,0.15)', padding:'1rem', marginTop:'0.5rem' }}>
          <p style={{ color:'#6b7f94', fontSize:'0.85rem', lineHeight:1.6 }}>
            <span style={{ color:'#00e5ff', fontFamily:'Barlow Condensed,sans-serif', fontWeight:700 }}>Tu protocolo:</span>{' '}
            {gender==='male'?'Hombre':'Mujer'} · {frequency} · {goal==='volume'?'Volumen & Fuerza':'Definición & Estética'} — Plan LeanGain {goal==='volume'?'con excedente +250-400 kcal':'con déficit 10-20% TDEE'}.
          </p>
        </div>

        <button onClick={save} disabled={loading} style={S.cta}>
          {loading?'Configurando...':'Activar mi protocolo →'}
        </button>
      </div>
    </div>
  )
}
