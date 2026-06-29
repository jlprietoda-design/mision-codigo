import { redirect } from 'next/navigation'

// El middleware redirige / → /es, pero este fallback garantiza el comportamiento correcto
// si el middleware no captura la request (ej. static export).
export default function RootPage() {
  redirect('/es')
}
