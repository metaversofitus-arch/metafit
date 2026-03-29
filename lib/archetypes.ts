export type ArchetypeId = 'street' | 'biohacker' | 'neural' | 'symbionte' | 'cyber' | 'titan'
export type TrainingLevel = 'beginner' | 'intermediate' | 'advanced'

export interface Archetype {
  id: ArchetypeId
  name: string
  tagline: string
  mantra: string
  fear: string
  desire: string
  phase: string
  days: string
  // Visual
  accent: string
  accentRgb: string
  accent2: string
  bg: string
  surface: string
  border: string
  glow: string
  emoji: string
  // Coach personality
  coachTone: string
  coachStyle: string
}

export const ARCHETYPES: Record<ArchetypeId, Archetype> = {
  street: {
    id: 'street',
    name: 'Street Dark',
    tagline: 'Disciplina sin glamour.',
    mantra: 'No me detengo.',
    fear: 'Mediocridad',
    desire: 'Respeto',
    phase: 'Día 0–30',
    days: 'Adaptación neuromuscular',
    accent: '#ff3d00',
    accentRgb: '255,61,0',
    accent2: '#ff6d00',
    bg: '#050608',
    surface: '#0f1114',
    border: '#1e2126',
    glow: 'rgba(255,61,0,0.15)',
    emoji: '🌑',
    coachTone: 'Directo, crudo, sin adornos. Habla como un coach de barrio que no acepta excusas.',
    coachStyle: 'Frases cortas. Cero tolerancia a la mediocridad. Motivación por presión y realidad.',
  },
  biohacker: {
    id: 'biohacker',
    name: 'Biohacker',
    tagline: 'Precisión clínica.',
    mantra: 'Todo se mide.',
    fear: 'Caos',
    desire: 'Control',
    phase: 'Día 0–30',
    days: 'Adaptación neuromuscular',
    accent: '#00e5ff',
    accentRgb: '0,229,255',
    accent2: '#00b8d4',
    bg: '#050810',
    surface: '#0a0f1a',
    border: '#111d2e',
    glow: 'rgba(0,229,255,0.12)',
    emoji: '🧪',
    coachTone: 'Analítico, preciso, basado en ciencia. Cita números y mecanismos fisiológicos.',
    coachStyle: 'Explica el POR QUÉ de cada cosa. Da datos exactos. Optimización sobre motivación.',
  },
  neural: {
    id: 'neural',
    name: 'Neural Elite',
    tagline: 'Mente + músculo integrados.',
    mantra: 'Me reprogramo.',
    fear: 'Estancamiento',
    desire: 'Optimización',
    phase: 'Día 30–60',
    days: 'Reconfiguración metabólica',
    accent: '#7c4dff',
    accentRgb: '124,77,255',
    accent2: '#651fff',
    bg: '#06050f',
    surface: '#0d0b1a',
    border: '#1a1530',
    glow: 'rgba(124,77,255,0.15)',
    emoji: '🧠',
    coachTone: 'Inteligente, estratégico. Conecta mente y cuerpo. Habla de patrones y sistemas.',
    coachStyle: 'Marcos mentales + acción física. Desafía los límites cognitivos del usuario.',
  },
  symbionte: {
    id: 'symbionte',
    name: 'Symbionte',
    tagline: 'Evolución viva. Adaptación constante.',
    mantra: 'Me adapto.',
    fear: 'Debilidad',
    desire: 'Evolución',
    phase: 'Día 30–60',
    days: 'Reconfiguración metabólica',
    accent: '#b71c1c',
    accentRgb: '183,28,28',
    accent2: '#ff1744',
    bg: '#080404',
    surface: '#130808',
    border: '#2a1010',
    glow: 'rgba(183,28,28,0.2)',
    emoji: '🧬',
    coachTone: 'Orgánico, visceral, evolutivo. Habla de transformación como proceso vivo.',
    coachStyle: 'Metáforas biológicas. Intensidad controlada. Cada sesión es una mutación.',
  },
  cyber: {
    id: 'cyber',
    name: 'Cyber-Gladiator',
    tagline: 'Dominio competitivo.',
    mantra: 'Compito para ganar.',
    fear: 'Inferioridad',
    desire: 'Dominio',
    phase: 'Día 60–90',
    days: 'Identidad consolidada',
    accent: '#76ff03',
    accentRgb: '118,255,3',
    accent2: '#64dd17',
    bg: '#030805',
    surface: '#070f08',
    border: '#0f2010',
    glow: 'rgba(118,255,3,0.12)',
    emoji: '⚔️',
    coachTone: 'Competitivo, agresivo positivo. Te habla como si fueras a pelear contra alguien.',
    coachStyle: 'Benchmarks, records, superación. Cada entreno es una batalla que ganar.',
  },
  titan: {
    id: 'titan',
    name: 'Titán',
    tagline: 'Legado. Monumentalidad. Autoridad.',
    mantra: 'Dejo marca.',
    fear: 'Olvido',
    desire: 'Legado',
    phase: 'Día 60–90',
    days: 'Identidad consolidada',
    accent: '#ffc107',
    accentRgb: '255,193,7',
    accent2: '#ff8f00',
    bg: '#080600',
    surface: '#110e00',
    border: '#2a2200',
    glow: 'rgba(255,193,7,0.15)',
    emoji: '🔱',
    coachTone: 'Monumental, épico, sabio. Habla como un mentor que ha visto todo.',
    coachStyle: 'Legado sobre ego. Construcción de identidad duradera. Perspectiva larga.',
  },
}

export const LEVELS = {
  beginner: {
    id: 'beginner',
    label: 'Principiante',
    sub: 'Menos de 1 año entrenando',
    coachNote: 'El usuario es principiante: explica cada ejercicio con detalle, usa lenguaje simple, da contexto de por qué se hace cada cosa, sé muy paciente y alentador.',
  },
  intermediate: {
    id: 'intermediate',
    label: 'Intermedio',
    sub: '1–3 años de experiencia',
    coachNote: 'El usuario tiene experiencia intermedia: asume conocimiento básico de ejercicios, enfócate en optimización técnica, progresión y nutrición avanzada.',
  },
  advanced: {
    id: 'advanced',
    label: 'Avanzado',
    sub: 'Más de 3 años, conoce el protocolo',
    coachNote: 'El usuario es avanzado: habla de igual a igual, usa terminología técnica, profundiza en periodización, biomecánica y optimización hormonal.',
  },
}

export const ARCHETYPE_ORDER: ArchetypeId[] = ['street', 'biohacker', 'neural', 'symbionte', 'cyber', 'titan']
