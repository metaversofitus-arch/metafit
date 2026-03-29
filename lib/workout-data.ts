export type WeekDay = 'Lunes' | 'Martes' | 'Miércoles' | 'Jueves' | 'Viernes' | 'Sábado' | 'Domingo'

export interface Exercise {
  name: string
  sets?: string
  reps?: string
  notes?: string
}

export interface Circuit {
  name: string
  sets: number
  exercises: Exercise[]
}

export interface DayWorkout {
  day: WeekDay
  focus: string
  circuits: Circuit[]
}

export interface WeekPlan {
  week: number
  phase: 'loading' | 'deload'
  days: DayWorkout[]
}

// ─── WOMEN F4 ────────────────────────────────────────────────────────────────
export const WOMEN_F4: DayWorkout[] = [
  {
    day: 'Lunes',
    focus: 'Cuádriceps & Glúteo',
    circuits: [
      {
        name: 'Circuito A',
        sets: 3,
        exercises: [
          { name: 'Sentadilla libre', reps: '8 pd / 8 md' },
          { name: 'Avanzadas', reps: '10 pasos ida + 10 regreso' },
          { name: 'Elevación de pantorrilla', reps: 'Al fallo' },
        ],
      },
      {
        name: 'Circuito B',
        sets: 4,
        exercises: [
          { name: 'Hack squat', reps: '6 pd / 8 md' },
          { name: 'Patada glúteo en polea', reps: '8 pd / 15 md' },
          { name: 'Caminata de reina', reps: '40 pasos' },
        ],
      },
      {
        name: 'Remate',
        sets: 3,
        exercises: [
          { name: 'Extensión de cuádriceps', reps: '20 normales / 20s ISO / 20 lentas', notes: 'Peso medio' },
          { name: 'Aductores', reps: '20 pd / 20s ISO / 20 md' },
        ],
      },
    ],
  },
  {
    day: 'Martes',
    focus: 'Femoral, Glúteo & Espalda',
    circuits: [
      {
        name: 'Circuito A',
        sets: 3,
        exercises: [
          { name: 'Peso muerto', reps: '5x5x5', notes: '5 reps · descanso 10s · 5 reps · descanso 10s · 5 reps' },
          { name: 'Curl femoral sentado', reps: '10 pd', notes: 'Baja 2s · sube 3s' },
          { name: 'Jalón vertical prono', reps: '8 pd / 12 md' },
        ],
      },
      {
        name: 'Circuito B',
        sets: 4,
        exercises: [
          { name: 'Curl femoral acostado', reps: '12 md', notes: 'Aprieta muslos, reps lentas' },
          { name: 'Hip thrust', reps: '10x10x10', notes: '10 reps · sostén 10s arriba · 10 reps' },
          { name: 'Remo neutro mancuernas', reps: 'Dropset 10 pd / 15 md / 20 lv' },
        ],
      },
      {
        name: 'Remate',
        sets: 3,
        exercises: [
          { name: 'Jalón horizontal supino', reps: '8 pd / 12 md' },
          { name: 'Sapitos a step', reps: '25 libre o con mancuernas 15 md' },
        ],
      },
    ],
  },
  {
    day: 'Miércoles',
    focus: 'Brazalete (Bíceps, Tríceps & Hombro)',
    circuits: [
      {
        name: 'Circuito A',
        sets: 4,
        exercises: [
          { name: 'Curl bíceps barra recta', reps: '6 pd / 12 md' },
          { name: 'Extensión tríceps barra Z', reps: '6 pd / 12 md' },
          { name: 'Flexiones de pecho', reps: '12-15' },
        ],
      },
      {
        name: 'Circuito B',
        sets: 4,
        exercises: [
          { name: 'Patada tríceps', reps: '12 md / 12 lv' },
          { name: 'Martillo', reps: '6x6x6', notes: '6 der · 6 izq · 6 dobles' },
          { name: 'Press militar', reps: 'Dropset 8 pd / 10 md / 12 lv' },
        ],
      },
      {
        name: 'Remate',
        sets: 3,
        exercises: [
          { name: 'Vuelos laterales', reps: 'Dropset 8 pd / 12 md / 16 lv' },
          { name: 'Vuelos posteriores en prono', reps: '15 md' },
        ],
      },
    ],
  },
  {
    day: 'Jueves',
    focus: 'Cuádriceps & Glúteo',
    circuits: [
      {
        name: 'Circuito A',
        sets: 3,
        exercises: [
          { name: 'Búlgara en Smith', reps: '8 pd / 10 lv' },
          { name: 'Sumo', reps: '10x10x10 md', notes: '10 cortas · ISO 10s · 10 completas' },
        ],
      },
      {
        name: 'Circuito B',
        sets: 4,
        exercises: [
          { name: 'Avanzadas en step unilateral', reps: '10 con dos mancuernas / 10 con una · cambia pierna' },
          { name: 'Hip thrust unilateral con banda', reps: '10 pd / 15 md' },
          { name: 'Elevación de pantorrilla', reps: '30 md' },
        ],
      },
      {
        name: 'Remate',
        sets: 3,
        exercises: [
          { name: 'Prensa piernas semi-juntas', reps: 'Dropset 10 pd / 15 md / 20 lv' },
          { name: 'Extensión de cuádriceps', reps: '20 explosivas + 10 lentas md' },
        ],
      },
    ],
  },
  {
    day: 'Viernes',
    focus: 'Femoral, Glúteo & Espalda',
    circuits: [
      {
        name: 'Circuito A',
        sets: 4,
        exercises: [
          { name: 'Femoral acostado', reps: '10 pd / 10 md' },
          { name: 'Abducción', reps: '40x20x40', notes: '40 reps · ISO 20s · 40 reps' },
        ],
      },
      {
        name: 'Circuito B',
        sets: 4,
        exercises: [
          { name: 'Peso muerto unilateral', reps: '12 md' },
          { name: 'Remo supino', reps: '10s ISO der · 10s ISO izq · 20 reps dobles md' },
          { name: 'Dominadas agarre prono', reps: 'Al fallo, agarre amplio' },
        ],
      },
      {
        name: 'Remate',
        sets: 3,
        exercises: [
          { name: 'Face pull en polea', reps: 'Dropset 20 reps' },
        ],
      },
    ],
  },
  {
    day: 'Sábado',
    focus: 'Brazalete',
    circuits: [
      {
        name: 'Circuito A',
        sets: 4,
        exercises: [
          { name: 'Curl bíceps barra recta', reps: '6 pd / 12 md' },
          { name: 'Extensión tríceps barra Z', reps: '6 pd / 12 md' },
          { name: 'Flexiones de pecho', reps: '12-15' },
        ],
      },
      {
        name: 'Circuito B',
        sets: 4,
        exercises: [
          { name: 'Patada tríceps', reps: '12 md / 12 lv' },
          { name: 'Martillo', reps: '6x6x6', notes: '6 der · 6 izq · 6 dobles' },
          { name: 'Press militar', reps: 'Dropset 8 pd / 10 md / 12 lv' },
        ],
      },
      {
        name: 'Remate',
        sets: 3,
        exercises: [
          { name: 'Vuelos laterales', reps: 'Dropset 8 pd / 12 md / 16 lv', notes: 'Pulgar apunta al techo' },
          { name: 'Vuelos posteriores en prono', reps: '15 md' },
        ],
      },
    ],
  },
  {
    day: 'Domingo',
    focus: 'Descanso activo / Movilidad',
    circuits: [],
  },
]

// ─── WOMEN F3 ────────────────────────────────────────────────────────────────
export const WOMEN_F3: DayWorkout[] = [
  {
    day: 'Lunes',
    focus: 'Cuádriceps & Glúteo',
    circuits: [
      {
        name: 'Circuito A',
        sets: 3,
        exercises: [
          { name: 'Avanzadas unilateral progresivo', reps: 'Hasta #7' },
          { name: 'Hip thrust unilateral', reps: '15 con peso / 15 sin peso', notes: 'Con banda si es posible' },
          { name: 'Sentadilla libre piernas semi-juntas', reps: '10 pd / 10 md' },
          { name: 'Elevación de pantorrilla', reps: '30' },
        ],
      },
      {
        name: 'Circuito B',
        sets: 4,
        exercises: [
          { name: 'Hack squat', reps: '10 pd' },
          { name: 'Sumo', reps: '15 md + 15 saltando + 1 min ISO' },
          { name: 'Caminata de reina', reps: '30 pasos', notes: 'En puntas, pasos cortos' },
        ],
      },
      {
        name: 'Remate',
        sets: 3,
        exercises: [
          { name: 'Extensión de rodilla 777', reps: '7 der · 7 izq · 7 dobles' },
          { name: 'Sentadilla sin peso', reps: '40 cortas' },
        ],
      },
    ],
  },
  {
    day: 'Martes',
    focus: 'Espalda & Bíceps',
    circuits: [
      {
        name: 'Circuito A',
        sets: 3,
        exercises: [
          { name: 'Jalón vertical', reps: 'Dropset 20' },
          { name: 'Vuelos máquina/mancuernas', reps: '12' },
          { name: 'Curl bíceps barra recta supino', reps: 'Dropset 15' },
          { name: 'Curl mancuernas supino', reps: '15 md' },
        ],
      },
      {
        name: 'Circuito B',
        sets: 4,
        exercises: [
          { name: 'Jalón horizontal', reps: '8 pd / 8 md' },
          { name: 'Curl araña / predicador', reps: '8 pd / 8 md' },
        ],
      },
      {
        name: 'Remate',
        sets: 3,
        exercises: [
          { name: 'Jalón para espalda polea alta', reps: '10 + 7 unilateral' },
        ],
      },
    ],
  },
  {
    day: 'Miércoles',
    focus: 'Femoral & Glúteo',
    circuits: [
      {
        name: 'Circuito A',
        sets: 4,
        exercises: [
          { name: 'Femoral acostado', reps: 'Dropset 20' },
          { name: 'Abducción', reps: '40x20x40' },
          { name: 'Hip thrust', reps: '10x10x10' },
        ],
      },
      {
        name: 'Circuito B',
        sets: 4,
        exercises: [
          { name: 'Peso muerto unilateral', reps: '12 md' },
          { name: 'Step up', reps: '10 pd / 20 sin peso' },
        ],
      },
      {
        name: 'Remate',
        sets: 3,
        exercises: [
          { name: 'Patada de glúteo en polea', reps: '10 pd / 15 md' },
        ],
      },
    ],
  },
  {
    day: 'Jueves',
    focus: 'Pecho, Hombro & Tríceps',
    circuits: [
      {
        name: 'Circuito A',
        sets: 4,
        exercises: [
          { name: 'Press plano con barra', reps: '8 pd, luego 1 mancuerna 12' },
          { name: 'Vuelos frontales', reps: '8 pd / 10 md' },
          { name: 'Extensión tríceps polea', reps: 'Dropset 20' },
        ],
      },
      {
        name: 'Circuito B',
        sets: 4,
        exercises: [
          { name: 'Press militar', reps: '8 md + 8 lv + 15 vuelos posteriores md' },
          { name: 'Rompecraneos', reps: '8 pd / 10 md' },
          { name: 'Flexiones de pecho', reps: '15' },
        ],
      },
      {
        name: 'Remate',
        sets: 3,
        exercises: [
          { name: 'Patada tríceps', reps: '12 + unilateral 8' },
          { name: 'Vuelos laterales', reps: 'Dropset 30' },
        ],
      },
    ],
  },
  {
    day: 'Viernes',
    focus: 'Pernil Completo',
    circuits: [
      {
        name: 'Circuito A',
        sets: 3,
        exercises: [
          { name: 'Sentadilla', reps: '10 + 10 saltando con barra liviana' },
          { name: 'Curl femoral sentado unilateral', reps: '10' },
          { name: 'Elevación pantorrilla', reps: '30' },
        ],
      },
      {
        name: 'Circuito B',
        sets: 4,
        exercises: [
          { name: 'Búlgara', reps: '8 pd' },
          { name: 'Avanzadas pliométricas con mancuernas', reps: '20' },
          { name: 'Elevación pantorrilla unilateral', reps: '15' },
        ],
      },
      {
        name: 'Remate',
        sets: 3,
        exercises: [
          { name: 'Extensión de rodillas', reps: 'Dropset 30' },
        ],
      },
    ],
  },
  {
    day: 'Sábado',
    focus: 'Espalda, Bíceps, Tríceps & Hombro',
    circuits: [
      {
        name: 'Circuito A',
        sets: 4,
        exercises: [
          { name: 'Dominadas/barras', reps: '10' },
          { name: 'Remo en supino con mancuerna', reps: '15' },
        ],
      },
      {
        name: 'Circuito B',
        sets: 4,
        exercises: [
          { name: 'Remo prono', reps: '15' },
          { name: 'Curl bíceps ISO unilateral', reps: '8x8 + doble 8' },
          { name: 'Copa tríceps', reps: '8 pd / 12 md' },
          { name: 'Vuelos en L', reps: '12' },
        ],
      },
      {
        name: 'Remate',
        sets: 4,
        exercises: [
          { name: 'Curl bíceps polea', reps: 'Dropset 20' },
          { name: 'Extensión tríceps polea', reps: 'Dropset 20' },
        ],
      },
    ],
  },
  { day: 'Domingo', focus: 'Descanso activo', circuits: [] },
]

// ─── MEN F3 ──────────────────────────────────────────────────────────────────
export const MEN_F3: DayWorkout[] = [
  {
    day: 'Lunes',
    focus: 'Cuádriceps & Glúteo',
    circuits: [
      {
        name: 'Circuito A',
        sets: 3,
        exercises: [
          { name: 'Sentadilla libre piernas semi-juntas', reps: '10 pd / 10 md' },
          { name: 'Avanzadas unilateral progresivo', reps: 'Hasta #7' },
          { name: 'Hip thrust unilateral', reps: '15 con peso / 15 sin peso' },
          { name: 'Elevación pantorrilla', reps: '30' },
        ],
      },
      {
        name: 'Circuito B',
        sets: 4,
        exercises: [
          { name: 'Hack squat', reps: '10 pd' },
          { name: 'Sumo', reps: '15 md + 15 saltando + 1 min ISO' },
          { name: 'Caminata de reina', reps: '30 pasos' },
        ],
      },
      {
        name: 'Remate',
        sets: 3,
        exercises: [
          { name: 'Extensión de rodilla 777', reps: '7 der · 7 izq · 7 dobles' },
          { name: 'Sentadilla sin peso', reps: '40 cortas' },
        ],
      },
    ],
  },
  {
    day: 'Martes',
    focus: 'Pecho & Bíceps',
    circuits: [
      {
        name: 'Circuito A',
        sets: 3,
        exercises: [
          { name: 'Press plano', reps: 'Dropset 20' },
          { name: 'Vuelos máquina/mancuernas', reps: '12' },
          { name: 'Curl bíceps barra recta supino', reps: 'Dropset 15' },
          { name: 'Curl mancuernas supino', reps: '15 md' },
        ],
      },
      {
        name: 'Circuito B',
        sets: 4,
        exercises: [
          { name: 'Press inclinado', reps: '20 luego 1 mancuerna 20' },
          { name: 'Curl araña/predicador', reps: '8 pd / 8 md' },
        ],
      },
      {
        name: 'Remate',
        sets: 3,
        exercises: [
          { name: 'Flexiones de pecho + Curl martillo piramidal', reps: '12 + descender hasta 1' },
        ],
      },
    ],
  },
  {
    day: 'Miércoles',
    focus: 'Femoral & Glúteo',
    circuits: [
      {
        name: 'Circuito A',
        sets: 4,
        exercises: [
          { name: 'Femoral acostado', reps: 'Dropset 20' },
          { name: 'Abducción', reps: '40x20x40' },
          { name: 'Hip thrust', reps: '10x10x10' },
        ],
      },
      {
        name: 'Circuito B',
        sets: 4,
        exercises: [
          { name: 'Peso muerto unilateral', reps: '12 md' },
          { name: 'Curl sentado en máquina', reps: '8 pd / 8 md' },
        ],
      },
      {
        name: 'Remate',
        sets: 3,
        exercises: [
          { name: 'Patada glúteo en polea', reps: '8 pd / 12 md' },
        ],
      },
    ],
  },
  {
    day: 'Jueves',
    focus: 'Espalda, Hombro & Tríceps',
    circuits: [
      {
        name: 'Circuito A',
        sets: 4,
        exercises: [
          { name: 'Jalón vertical', reps: '8 pd / 10 md' },
          { name: 'Jalón horizontal', reps: '8 pd / 10 md' },
          { name: 'Extensión tríceps', reps: 'Dropset 20' },
        ],
      },
      {
        name: 'Circuito B',
        sets: 4,
        exercises: [
          { name: 'Remo prono mancuernas', reps: '10 + 10 vuelos posteriores' },
          { name: 'Rompecraneos', reps: '8 pd / 10 md' },
          { name: 'Press militar', reps: '5 pd / 10 md' },
        ],
      },
      {
        name: 'Remate',
        sets: 3,
        exercises: [
          { name: 'Patada tríceps', reps: '12 + unilateral 8' },
          { name: 'Vuelos laterales', reps: 'Dropset 30' },
        ],
      },
    ],
  },
  {
    day: 'Viernes',
    focus: 'Pernil Completo',
    circuits: [
      {
        name: 'Circuito A',
        sets: 3,
        exercises: [
          { name: 'Sentadilla', reps: '10 + 10 saltando con barra liviana' },
          { name: 'Curl femoral sentado unilateral', reps: '10' },
          { name: 'Elevación pantorrilla', reps: '30' },
        ],
      },
      {
        name: 'Circuito B',
        sets: 4,
        exercises: [
          { name: 'Búlgara', reps: '8 pd' },
          { name: 'Zancadas pliométricas con mancuernas', reps: '20' },
          { name: 'Elevación pantorrilla unilateral', reps: '15' },
        ],
      },
      {
        name: 'Remate',
        sets: 3,
        exercises: [
          { name: 'Extensión rodillas', reps: 'Dropset 30' },
        ],
      },
    ],
  },
  {
    day: 'Sábado',
    focus: 'Pecho, Espalda & Brazalete',
    circuits: [
      {
        name: 'Circuito A',
        sets: 4,
        exercises: [
          { name: 'Press plano mancuerna', reps: 'Dropset 20' },
          { name: 'Dominadas', reps: '15' },
        ],
      },
      {
        name: 'Circuito B',
        sets: 4,
        exercises: [
          { name: 'Apertura en máquina', reps: '12' },
          { name: 'Flexiones en diamante', reps: '20' },
          { name: 'Jalón neutro en máquina', reps: 'Dropset 20' },
          { name: 'Face pull', reps: '12' },
        ],
      },
      {
        name: 'Remate',
        sets: 4,
        exercises: [
          { name: 'Curl bíceps mancuerna', reps: 'Dropset 30' },
          { name: 'Rompecraneos mancuerna', reps: 'Dropset 20' },
        ],
      },
    ],
  },
  { day: 'Domingo', focus: 'Descanso activo', circuits: [] },
]

// ─── MEN F4 ──────────────────────────────────────────────────────────────────
export const MEN_F4: DayWorkout[] = [
  {
    day: 'Lunes',
    focus: 'Cuádriceps & Pecho',
    circuits: [
      {
        name: 'Circuito A',
        sets: 3,
        exercises: [
          { name: 'Sentadilla libre', reps: '8 pd / 8 md' },
          { name: 'Avanzadas', reps: '10 pasos ida + 10 regreso' },
          { name: 'Press plano', reps: 'Dropset 5 pd / 8 md / 7 lv' },
          { name: 'Apertura en máquina', reps: '10 pd' },
        ],
      },
      {
        name: 'Circuito B',
        sets: 4,
        exercises: [
          { name: 'Hack squat', reps: '6 pd / 8 md' },
          { name: 'Step up', reps: '8 pd dos mancuernas / 10 md una mancuerna' },
          { name: 'Press inclinado', reps: '12 md + abducción disco 20' },
        ],
      },
      {
        name: 'Remate',
        sets: 3,
        exercises: [
          { name: 'Extensión rodilla', reps: '20x20x20', notes: '20 normales · 20s ISO · 20 lentas' },
          { name: 'Fondos/paralelas', reps: 'Al fallo' },
        ],
      },
    ],
  },
  {
    day: 'Martes',
    focus: 'Femoral, Glúteo & Espalda',
    circuits: [
      {
        name: 'Circuito A',
        sets: 3,
        exercises: [
          { name: 'Peso muerto', reps: '5x5x5' },
          { name: 'Curl femoral sentado', reps: '10 pd', notes: 'Baja 2s · sube 3s' },
          { name: 'Jalón vertical prono', reps: '8 pd / 12 md' },
        ],
      },
      {
        name: 'Circuito B',
        sets: 4,
        exercises: [
          { name: 'Curl femoral acostado', reps: '12 md', notes: 'Lento y apretando' },
          { name: 'Hip thrust', reps: '10x10x10' },
          { name: 'Remo neutro mancuernas', reps: 'Dropset 10 pd / 15 md / 20 lv' },
        ],
      },
      {
        name: 'Remate',
        sets: 3,
        exercises: [
          { name: 'Jalón horizontal supino', reps: '8 pd / 12 md' },
          { name: 'Vuelos posteriores neutro', reps: '15 pd' },
        ],
      },
    ],
  },
  {
    day: 'Miércoles',
    focus: 'Brazalete',
    circuits: [
      {
        name: 'Circuito A',
        sets: 4,
        exercises: [
          { name: 'Curl bíceps barra recta + mancuerna supino', reps: '6 pd / 12 md + 15 md' },
          { name: 'Extensión tríceps barra Z', reps: '6 pd / 12 md' },
        ],
      },
      {
        name: 'Circuito B',
        sets: 4,
        exercises: [
          { name: 'Patada tríceps', reps: '12 md / 12 lv' },
          { name: 'Martillo', reps: '6x6x6' },
          { name: 'Press militar', reps: 'Dropset 8 pd / 10 md / 12 lv' },
        ],
      },
      {
        name: 'Remate',
        sets: 3,
        exercises: [
          { name: 'Vuelos laterales', reps: 'Dropset 8 pd / 12 md / 16 lv' },
          { name: 'Vuelos posteriores en prono', reps: '15 md' },
        ],
      },
    ],
  },
  {
    day: 'Jueves',
    focus: 'Cuádriceps & Pecho',
    circuits: [
      {
        name: 'Circuito A',
        sets: 3,
        exercises: [
          { name: 'Búlgara en Smith', reps: '8 pd / 10 lv' },
          { name: 'Press plano mancuerna', reps: '8 pd / 8 md / 8 lv' },
        ],
      },
      {
        name: 'Circuito B',
        sets: 4,
        exercises: [
          { name: 'Avanzadas step unilateral', reps: '10 dos manc · 10 una manc · cambia pierna' },
          { name: 'Press inclinado mancuerna', reps: '6 pd / 10 md' },
          { name: 'Elevación pantorrilla', reps: '30 md' },
        ],
      },
      {
        name: 'Remate',
        sets: 3,
        exercises: [
          { name: 'Prensa piernas semi-juntas', reps: 'Dropset 10 pd / 15 md / 20 lv' },
          { name: 'Flexiones explosivas', reps: '20 explosivas + 20 parciales' },
        ],
      },
    ],
  },
  {
    day: 'Viernes',
    focus: 'Femoral & Espalda',
    circuits: [
      {
        name: 'Circuito A',
        sets: 4,
        exercises: [
          { name: 'Femoral acostado', reps: '10 pd / 10 md' },
          { name: 'Peso muerto unilateral', reps: '12 md' },
        ],
      },
      {
        name: 'Circuito B',
        sets: 4,
        exercises: [
          { name: 'Curl femoral máquina de pie', reps: '8 lentas pd / 15 rápidas md' },
          { name: 'Remo supino unilateral + doble', reps: '10 der ISO · 10 izq ISO · 20 doble md' },
          { name: 'Dominadas agarre prono', reps: 'Al fallo, agarre amplio' },
        ],
      },
      {
        name: 'Remate',
        sets: 3,
        exercises: [
          { name: 'Remo horizontal neutro', reps: 'Dropset 20 md' },
          { name: 'Pullover unilateral neutro', reps: 'Dropset 15 por brazo' },
        ],
      },
    ],
  },
  {
    day: 'Sábado',
    focus: 'Brazalete',
    circuits: [
      {
        name: 'Circuito A',
        sets: 4,
        exercises: [
          { name: 'Curl bíceps barra recta + mancuerna inclinada supino', reps: '6 pd / 12 md + 15 md' },
          { name: 'Extensión tríceps barra Z', reps: '6 pd / 12 md' },
        ],
      },
      {
        name: 'Circuito B',
        sets: 4,
        exercises: [
          { name: 'Patada tríceps', reps: '12 md / 12 lv' },
          { name: 'Martillo', reps: '6x6x6' },
          { name: 'Press militar', reps: 'Dropset 8 pd / 10 md / 12 lv' },
        ],
      },
      {
        name: 'Remate',
        sets: 3,
        exercises: [
          { name: 'Vuelos laterales', reps: 'Dropset 8 pd / 12 md / 16 lv', notes: 'Pulgar al techo' },
          { name: 'Vuelos posteriores en prono', reps: '15 md' },
        ],
      },
    ],
  },
  { day: 'Domingo', focus: 'Descanso activo', circuits: [] },
]

export const ABDOMINAL_CIRCUIT = {
  name: 'Rutina de Abdomen',
  circuits: [
    {
      name: 'Circuito A',
      sets: 3,
      exercises: [
        { name: 'Crunch cortico + completo', reps: '10 cortos + 10 completos' },
        { name: 'Elevación de piernas', reps: '10 lentas' },
      ],
    },
    {
      name: 'Circuito B',
      sets: 3,
      exercises: [
        { name: 'Rotación con disco', reps: '30' },
        { name: 'Plancha lateral ISO + reps', reps: '15s · 15 reps subiendo/bajando · cambia lado' },
      ],
    },
    {
      name: 'Remate',
      sets: 3,
      exercises: [
        { name: 'Escaladores', reps: '40 cruzados + 40 al pecho' },
      ],
    },
  ],
}

export function getPlan(gender: 'male' | 'female', frequency: 'F3' | 'F4'): DayWorkout[] {
  if (gender === 'female' && frequency === 'F4') return WOMEN_F4
  if (gender === 'female' && frequency === 'F3') return WOMEN_F3
  if (gender === 'male' && frequency === 'F3') return MEN_F3
  return MEN_F4
}

// Nutrition data
export interface MealOption {
  name: string
  protein_g: number
  description: string
}

export interface DayNutrition {
  type: 'leg_day' | 'upper_day'
  pre_workout: MealOption[]
  post_workout: MealOption[]
  snack: MealOption[]
  dinner: MealOption[]
  total_protein_target: { min: number; max: number }
}

export const NUTRITION_LEG_DAY: DayNutrition = {
  type: 'leg_day',
  pre_workout: [
    { name: 'Batido Pre Pierna', protein_g: 45, description: '300ml leche + 1-2 bananos + 1 scoop whey + 150g yogur griego + 100g avena + 1 cda mantequilla maní' },
    { name: 'Batido Pre Ligero', protein_g: 39, description: '250ml leche + 1 banano + 100g yogur griego + 100g avena + 1 cda mantequilla maní + 1 scoop nestum + arándanos' },
  ],
  post_workout: [
    { name: 'Post Potente', protein_g: 90, description: '6 huevos + 250g pollo/ternera' },
    { name: 'Post Estándar', protein_g: 65, description: '4 huevos + 150g pollo o salmón' },
  ],
  snack: [
    { name: 'Snack Proteico', protein_g: 28, description: '300g yogur griego + frutos secos' },
    { name: 'Snack Rápido', protein_g: 24, description: '2 latas de atún o sándwich de atún' },
  ],
  dinner: [
    { name: 'Cena Pesada (Volumen)', protein_g: 150, description: '200g carne roja + 5 huevos + verduras' },
    { name: 'Cena Moderada', protein_g: 90, description: '300g pollo + 4 huevos + verduras' },
    { name: 'Cena Definición', protein_g: 85, description: '200g salmón + 100g cottage + 4 huevos' },
  ],
  total_protein_target: { min: 150, max: 260 },
}

export const NUTRITION_UPPER_DAY: DayNutrition = {
  type: 'upper_day',
  pre_workout: [
    { name: 'Batido Pre Upper (Volumen)', protein_g: 35, description: '250ml leche + 1 scoop whey + 100g yogur griego + banana' },
    { name: 'Batido Pre Upper (Definición)', protein_g: 28, description: '250ml agua + 1 scoop whey + 100g yogur griego opcional' },
  ],
  post_workout: [
    { name: 'Post Upper', protein_g: 70, description: '4-6 huevos + 150-200g pollo/salmón' },
  ],
  snack: [
    { name: 'Snack Upper', protein_g: 25, description: '200-300g yogur griego o sándwich de atún' },
  ],
  dinner: [
    { name: 'Cena Magra', protein_g: 100, description: '200-300g pescado magro + cottage + 5 huevos + verduras' },
    { name: 'Cena Carne', protein_g: 120, description: '200-250g carne magra + acompañante' },
  ],
  total_protein_target: { min: 150, max: 260 },
}
