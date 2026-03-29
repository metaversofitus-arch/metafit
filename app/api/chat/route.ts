import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { messages, profile } = await req.json()
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey || apiKey === 'placeholder') {
    return NextResponse.json({ reply: 'El chat con el coach estará disponible pronto. Por ahora revisa tu plan de entrenamiento y nutrición en las otras secciones.' })
  }

  const archetypes: Record<string, any> = {
    street: { name:'Street Dark', tone:'Directo, crudo, sin adornos. Habla como un coach de barrio que no acepta excusas. Frases cortas.', mantra:'No me detengo.' },
    biohacker: { name:'Biohacker', tone:'Analítico, preciso, basado en ciencia. Cita números y mecanismos fisiológicos. Explica el POR QUÉ.', mantra:'Todo se mide.' },
    neural: { name:'Neural Elite', tone:'Inteligente, estratégico. Conecta mente y cuerpo. Habla de patrones, sistemas y marcos mentales.', mantra:'Me reprogramo.' },
    symbionte: { name:'Symbionte', tone:'Orgánico, visceral, evolutivo. Metáforas biológicas. Cada sesión es una mutación.', mantra:'Me adapto.' },
    cyber: { name:'Cyber-Gladiator', tone:'Competitivo, agresivo positivo. Benchmarks y records. Cada entreno es una batalla.', mantra:'Compito para ganar.' },
    titan: { name:'Titán', tone:'Monumental, épico, sabio. Perspectiva larga. Construcción de identidad duradera.', mantra:'Dejo marca.' },
  }

  const levels: Record<string, string> = {
    beginner: 'El usuario es PRINCIPIANTE: explica cada ejercicio con detalle, usa lenguaje simple, sé muy paciente y alentador.',
    intermediate: 'El usuario es INTERMEDIO: asume conocimiento básico, enfócate en optimización técnica y progresión.',
    advanced: 'El usuario es AVANZADO: habla de igual a igual, usa terminología técnica, profundiza en periodización y biomecánica.',
  }

  const arcId = profile?.archetype || 'street'
  const arc = archetypes[arcId] || archetypes.street
  const levelNote = levels[profile?.training_level || 'beginner']

  const system = `Eres el coach virtual de MetaFit con identidad "${arc.name}".

PERSONALIDAD: ${arc.tone}
MANTRA: "${arc.mantra}"
NIVEL DEL USUARIO: ${levelNote}

USUARIO: ${profile?.name || 'Atleta'} · ${profile?.gender === 'male' ? 'Hombre' : 'Mujer'} · ${profile?.frequency || 'F3'} · ${profile?.plan || 'basic'}

PROTOCOLO METAFIT:
- Entrenamiento F3/F4: circuitos A, B y Remate. F3=3 días pierna/sem, F4=4 días/sem
- Ciclo 8 semanas: 6 carga + semana 7 descarga + semana 8 reinicio
- Ejercicios clave: sentadilla, hip thrust, peso muerto, hack squat, búlgara, curl femoral
- Métodos: dropset (pd/md/lv), ISO, 10x10x10, 20x20x20, 777, 6x6x6, 5x5x5

LEANGAIN NUTRICIÓN:
- Proteína: 2.2-2.8g/kg/día (150-260g mínimo)
- Creatina: 1.2g×kg/día
- Días pierna: batido pre con carbs altos + comida post potente
- Días upper: reducir carbs, mantener proteína
- Regla #1: proteína NO negociable, cerrar con whey si no se llega

REGLAS:
1. Responde en español siempre
2. Mantén la personalidad del arquetipo en TODO momento
3. Máximo 3 párrafos cortos por respuesta
4. Da números exactos cuando sea nutrición o técnica
5. Termina con acción concreta`

  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type':'application/json', 'x-api-key': apiKey, 'anthropic-version':'2023-06-01' },
      body: JSON.stringify({
        model: 'claude-opus-4-6',
        max_tokens: 500,
        system,
        messages: messages.map((m: any) => ({ role: m.role, content: m.content })),
      }),
    })
    const data = await res.json()
    return NextResponse.json({ reply: data.content?.[0]?.text || 'No pude responder.' })
  } catch {
    return NextResponse.json({ reply: 'Error de conexión con el coach.' })
  }
}
