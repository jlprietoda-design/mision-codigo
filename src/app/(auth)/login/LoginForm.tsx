'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { signIn } from '@/app/actions/auth'

export function LoginForm() {
  const [error, setError] = useState<string | undefined>()
  const [isPending, startTransition] = useTransition()

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(undefined)
    const formData = new FormData(e.currentTarget)

    startTransition(async () => {
      const result = await signIn(formData)
      if (result?.error) setError(result.error)
    })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8F9FF] px-4">
      <div className="w-full max-w-md">

        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🚀</div>
          <h1 className="text-3xl font-bold text-[#1a1a2e]">Misión Código</h1>
          <p className="text-[#4a4a6a] mt-2">¡Bienvenido de vuelta, explorador!</p>
        </div>

        <div className="bg-white border border-[#E0E0F0] rounded-2xl p-8 shadow-[0_2px_20px_rgba(83,74,183,0.1)]">
          <h2 className="text-xl font-semibold text-[#1a1a2e] mb-6">Iniciar sesión</h2>

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>

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
                autoComplete="current-password"
                placeholder="••••••••"
                className="w-full bg-white border border-[#E0E0F0] text-[#1a1a2e] placeholder-[#4a4a6a]/40 rounded-lg px-4 py-3 focus:outline-none focus:border-[#534AB7] focus:ring-2 focus:ring-[#534AB7]/20 transition"
              />
            </div>

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
                  Entrando...
                </span>
              ) : (
                'Entrar'
              )}
            </button>
          </form>

          <div className="mt-5 text-center">
            <button
              type="button"
              className="text-sm text-[#4a4a6a] hover:text-[#534AB7] transition"
            >
              ¿Olvidaste tu contraseña?
            </button>
          </div>
        </div>

        <p className="text-center text-[#4a4a6a] mt-6 text-sm">
          ¿No tienes cuenta?{' '}
          <Link
            href="/registro"
            className="text-[#534AB7] hover:text-[#4338ca] font-semibold transition"
          >
            Registrarse
          </Link>
        </p>
      </div>
    </div>
  )
}
