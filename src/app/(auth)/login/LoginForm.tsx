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
    <div className="min-h-screen flex items-center justify-center bg-[#0d0d1a] px-4">
      <div className="w-full max-w-md">

        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🚀</div>
          <h1 className="text-3xl font-bold text-white">Misión Código</h1>
          <p className="text-slate-400 mt-2">¡Bienvenido de vuelta, explorador!</p>
        </div>

        <div className="bg-[#12122a] border border-[#534AB7]/30 rounded-2xl p-8 shadow-2xl">
          <h2 className="text-xl font-semibold text-white mb-6">Iniciar sesión</h2>

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>

            <div>
              <label htmlFor="email" className="block text-sm text-slate-300 mb-1.5">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="tu@email.com"
                className="w-full bg-[#0d0d1a] border border-[#534AB7]/40 text-white placeholder-slate-600 rounded-lg px-4 py-3 focus:outline-none focus:border-[#534AB7] focus:ring-1 focus:ring-[#534AB7] transition"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm text-slate-300 mb-1.5">
                Contraseña
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
                placeholder="••••••••"
                className="w-full bg-[#0d0d1a] border border-[#534AB7]/40 text-white placeholder-slate-600 rounded-lg px-4 py-3 focus:outline-none focus:border-[#534AB7] focus:ring-1 focus:ring-[#534AB7] transition"
              />
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isPending}
              className="w-full bg-[#00d4a1] hover:bg-[#00b88e] disabled:opacity-50 disabled:cursor-not-allowed text-[#0d0d1a] font-bold py-3 rounded-lg transition text-base"
            >
              {isPending ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-[#0d0d1a]/30 border-t-[#0d0d1a] rounded-full animate-spin" />
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
              className="text-sm text-slate-500 hover:text-slate-300 transition"
            >
              ¿Olvidaste tu contraseña?
            </button>
          </div>
        </div>

        <p className="text-center text-slate-400 mt-6 text-sm">
          ¿No tienes cuenta?{' '}
          <Link
            href="/registro"
            className="text-[#534AB7] hover:text-[#00d4a1] font-medium transition"
          >
            Registrarse
          </Link>
        </p>
      </div>
    </div>
  )
}
