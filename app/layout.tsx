import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'MetaFit — LeanGain Protocol',
  description: 'Tu entrenador virtual. Gana masa magra y fuerza sin volumen sucio.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  )
}
