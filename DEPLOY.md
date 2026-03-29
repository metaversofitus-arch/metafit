# MetaFit — Guía de Deploy

## 1. Supabase (hacer PRIMERO)

Ve a https://supabase.com → tu proyecto → SQL Editor → pega el contenido de `SUPABASE_SETUP.sql` y ejecuta.

También en Supabase → Authentication → URL Configuration:
- Site URL: https://tu-app.vercel.app (lo tienes después del deploy)
- Redirect URLs: https://tu-app.vercel.app/**

## 2. Vercel

### Opción A — GitHub (recomendada)
1. Sube esta carpeta a un repo de GitHub
2. Ve a vercel.com → New Project → importa el repo
3. En "Environment Variables" añade:
   - `NEXT_PUBLIC_SUPABASE_URL` = https://zinochklwelupsrrqfwy.supabase.co
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = sb_publishable_3_l0B-23dtEANVVSStggUQ_eywVZ_cA
   - `ANTHROPIC_API_KEY` = [tu key de anthropic.com/settings/keys]
4. Deploy → listo

### Opción B — Vercel CLI
```bash
npm i -g vercel
vercel login
vercel --prod
# Ingresa las env vars cuando te las pida
```

## 3. Obtener tu Anthropic API Key
- Ve a console.anthropic.com
- Settings → API Keys → Create Key
- Copia y ponla en ANTHROPIC_API_KEY en Vercel

## 4. Estructura de la app
- `/` → Landing + Login/Signup
- `/onboarding` → Configuración inicial (género, frecuencia, objetivo)
- `/dashboard` → App completa:
  - 🏋️ Entrenamiento — rutinas F3/F4 con checklist, selector de semana
  - 🥩 Nutrición — LeanGain Protocol con calculadora de proteína
  - 🎮 Mi Coach — constructor de avatar (personalización)
  - 🎙️ Hablar con Coach — chat IA con contexto del usuario

## Lo que viene en Fase 2
- Análisis de técnica por cámara (Claude Vision)
- Stripe payments (reemplaza PayPal)
- Progresión de cargas automática
- Video llamada con coach (avatar + voz)
