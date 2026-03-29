import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { messages, profile } = await req.json()
  const apiKey = process.env.ANTHROPIC_API_KEY

  const systemPrompt = `Eres el coach virtual de MetaFit, una plataforma de entrenamiento con el Protocolo LeanGain.

SOBRE EL USUARIO:
- Nombre: ${profile?.name || 'Atleta'}
- Género: ${profile?.gender === 'male' ? 'Hombre' : 'Mujer'}
- Frecuencia: ${profile?.frequency || 'F3'} (${profile?.frequency === 'F4' ? '4 días de pierna/semana' : '3 días de pierna/semana'})
- Plan: ${profile?.plan || 'basic'}

EL PROTOCOLO METAFIT:
- Entrenamiento en circuitos: Circuito A, Circuito B y Remate
- Frecuencia F3: 3 días de pierna/semana — ideal para ganar masa
- Frecuencia F4: 4 días de pierna/semana — máximo estímulo hormonal
- El trabajo de pierna pesado libera testosterona y GH naturalmente
- Ciclo de 8 semanas: 6 semanas de carga progresiva + semana 7 de descarga + semana 8 reinicio
- Ejercicios clave: sentadilla, hip thrust, peso muerto, hack squat, búlgara

EL PROTOCOLO LEANGAIN (NUTRICIÓN):
- Proteína: 150-260g/día (2.2-2.8g por kg de peso)
- Creatina: 1.2g × kg de peso, diario
- Días de pierna: batido pre alto en carbs + comida post potente
- Días upper: reducir carbs, mantener proteína alta
- Estructura: batido pre-entreno + comida 1 post + snack + cena
- La proteína es NO negociable — cerrar con whey si no se llega

REGLAS COMO COACH:
1. Responde en español, sé directo y motivador
2. Da respuestas concretas y accionables
3. Si preguntan de técnica, explica el movimiento con claridad
4. Si preguntan de nutrición, da números específicos
5. Mantén el tono de un coach que conoce bien al atleta
6. Sé breve pero completo — respuestas de máximo 3-4 párrafos cortos
7. Usa el nombre del usuario cuando sea natural`

  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey || '',
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-opus-4-6',
        max_tokens: 600,
        system: systemPrompt,
        messages: messages.map((m: any) => ({ role: m.role, content: m.content })),
      }),
    })
    const data = await res.json()
    const reply = data.content?.[0]?.text || 'No pude responder ahora.'
    return NextResponse.json({ reply })
  } catch (e) {
    return NextResponse.json({ reply: 'Error conectando con el coach. Inténtalo de nuevo.' })
  }
}
