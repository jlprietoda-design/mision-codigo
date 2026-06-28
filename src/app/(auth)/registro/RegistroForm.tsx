'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { signUp } from '@/app/actions/auth'

export function RegistroForm() {
  const [selectedRole, setSelectedRole] = useState<'family' | 'teacher'>('family')
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [error, setError] = useState<string | undefined>()
  const [needsConfirmation, setNeedsConfirmation] = useState(false)
  const [isPending, startTransition] = useTransition()

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(undefined)

    const formData = new FormData(e.currentTarget)
    const name = (formData.get('name') as string).trim()
    const email = (formData.get('email') as string).trim()
    const password = formData.get('password') as string
    const confirmPassword = formData.get('confirmPassword') as string

    if (!name) {
      setError('El nombre es obligatorio.')
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('El email no tiene un formato válido.')
      return
    }
    if (password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres.')
      return
    }
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.')
      return
    }
    if (!termsAccepted) {
      setError('Debes aceptar los términos y condiciones para continuar.')
      return
    }

    formData.set('role', selectedRole)

    startTransition(async () => {
      const result = await signUp(formData)
      if (result?.error) {
        setError(result.error)
      } else if (result?.needsConfirmation) {
        setNeedsConfirmation(true)
      }
    })
  }

  if (needsConfirmation) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8F9FF] px-4">
        <div className="w-full max-w-md bg-white border border-[#E0E0F0] rounded-2xl p-8 shadow-[0_2px_20px_rgba(83,74,183,0.1)] text-center">
          <div className="text-5xl mb-4">📬</div>
          <h2 className="text-2xl font-bold text-[#1a1a2e] mb-3">¡Revisa tu email!</h2>
          <p className="text-[#4a4a6a] mb-6">
            Te enviamos un enlace de confirmación. Ábrelo para activar tu cuenta y empezar a explorar Misión Código.
          </p>
          <Link
            href="/login"
            className="block w-full bg-[#534AB7] hover:bg-[#4338ca] text-white font-bold py-3 rounded-lg transition text-center"
          >
            Volver al inicio de sesión
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8F9FF] px-4 py-10">
      <div className="w-full max-w-md">

        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🤖</div>
          <h1 className="text-3xl font-bold text-[#1a1a2e]">Misión Código</h1>
          <p className="text-[#4a4a6a] mt-2">Crea tu cuenta para empezar la aventura</p>
        </div>

        <div className="bg-white border border-[#E0E0F0] rounded-2xl p-8 shadow-[0_2px_20px_rgba(83,74,183,0.1)]">
          <h2 className="text-xl font-semibold text-[#1a1a2e] mb-6">Crear cuenta gratis</h2>

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>

            <div>
              <label htmlFor="name" className="block text-sm text-[#4a4a6a] font-medium mb-1.5">
                Nombre completo
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                autoComplete="name"
                placeholder="María García"
                className="w-full bg-white border border-[#E0E0F0] text-[#1a1a2e] placeholder-[#4a4a6a]/40 rounded-lg px-4 py-3 focus:outline-none focus:border-[#534AB7] focus:ring-2 focus:ring-[#534AB7]/20 transition"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm text-[#4a4a6a] font-medium mb-1.5">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="tu@email.com"
                className="w-full bg-white border border-[#E0E0F0] text-[#1a1a2e] placeholder-[#4a4a6a]/40 rounded-lg px-4 py-3 focus:outline-none focus:border-[#534AB7] focus:ring-2 focus:ring-[#534AB7]/20 transition"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm text-[#4a4a6a] font-medium mb-1.5">
                Contraseña
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="new-password"
                placeholder="Mínimo 8 caracteres"
                className="w-full bg-white border border-[#E0E0F0] text-[#1a1a2e] placeholder-[#4a4a6a]/40 rounded-lg px-4 py-3 focus:outline-none focus:border-[#534AB7] focus:ring-2 focus:ring-[#534AB7]/20 transition"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm text-[#4a4a6a] font-medium mb-1.5">
                Confirmar contraseña
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                autoComplete="new-password"
                placeholder="Repite tu contraseña"
                className="w-full bg-white border border-[#E0E0F0] text-[#1a1a2e] placeholder-[#4a4a6a]/40 rounded-lg px-4 py-3 focus:outline-none focus:border-[#534AB7] focus:ring-2 focus:ring-[#534AB7]/20 transition"
              />
            </div>

            {/* Tipo de cuenta */}
            <div>
              <p className="text-sm text-[#4a4a6a] font-medium mb-2">Tipo de cuenta</p>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedRole('family')}
                  className={`border rounded-xl p-3 text-center transition ${
                    selectedRole === 'family'
                      ? 'border-[#534AB7] bg-[#EEF0FF]'
                      : 'border-[#E0E0F0] hover:border-[#534AB7]/40 bg-white'
                  }`}
                >
                  <div className="text-2xl mb-1">👨‍👩‍👧</div>
                  <p className="text-xs text-[#4a4a6a] leading-tight">
                    Soy padre/madre o tutor
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedRole('teacher')}
                  className={`border rounded-xl p-3 text-center transition ${
                    selectedRole === 'teacher'
                      ? 'border-[#534AB7] bg-[#EEF0FF]'
                      : 'border-[#E0E0F0] hover:border-[#534AB7]/40 bg-white'
                  }`}
                >
                  <div className="text-2xl mb-1">👩‍🏫</div>
                  <p className="text-xs text-[#4a4a6a] leading-tight">
                    Soy profesor/a
                  </p>
                </button>
              </div>
            </div>

            {/* Términos */}
            <button
              type="button"
              onClick={() => setTermsAccepted((v) => !v)}
              className="flex items-start gap-3 text-left w-full group"
            >
              <span
                className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition ${
                  termsAccepted
                    ? 'bg-[#534AB7] border-[#534AB7]'
                    : 'border-[#E0E0F0] group-hover:border-[#534AB7]'
                }`}
              >
                {termsAccepted && (
                  <svg className="w-3 h-3 text-white" viewBox="0 0 12 12" fill="none">
                    <path
                      d="M2 6l3 3 5-5"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </span>
              <span className="text-sm text-[#4a4a6a] group-hover:text-[#1a1a2e] transition leading-relaxed">
                Acepto los{' '}
                <span
                  className="text-[#534AB7] hover:text-[#4338ca] transition"
                  onClick={(e) => e.stopPropagation()}
                >
                  términos y condiciones
                </span>{' '}
                y la{' '}
                <span
                  className="text-[#534AB7] hover:text-[#4338ca] transition"
                  onClick={(e) => e.stopPropagation()}
                >
                  política de privacidad
                </span>
              </span>
            </button>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isPending}
              className="w-full bg-[#534AB7] hover:bg-[#4338ca] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 rounded-lg transition text-base"
            >
              {isPending ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creando cuenta...
                </span>
              ) : (
                'Crear cuenta gratis'
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-[#4a4a6a] mt-6 text-sm">
          ¿Ya tienes cuenta?{' '}
          <Link
            href="/login"
            className="text-[#534AB7] hover:text-[#4338ca] font-semibold transition"
          >
            Iniciar sesión
          </Link>
        </p>
      </div>
    </div>
  )
}
