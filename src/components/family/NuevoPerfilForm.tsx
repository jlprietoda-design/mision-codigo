'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { createChildProfile } from '@/app/actions/family'

const AVATARS = ['🤖', '🦊', '🐼', '🦄', '🐸', '🦁', '🐯', '🐻', '🐨', '🦋', '🐙', '🦉', '🐬', '🐉', '🚀', '⭐']

const AGE_RANGES = [
  { value: '6-8', label: '6-8 años', emoji: '🌱' },
  { value: '8-10', label: '8-10 años', emoji: '🌿' },
  { value: '10-12', label: '10-12 años', emoji: '🌳' },
  { value: '12-14', label: '12-14 años', emoji: '🏆' },
]

// Only letters (including Spanish), numbers, and hyphens
const ALIAS_ALLOWED = /^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ0-9\-]*$/

export function NuevoPerfilForm() {
  const [alias, setAlias] = useState('')
  const [selectedAge, setSelectedAge] = useState('')
  const [selectedAvatar, setSelectedAvatar] = useState('🤖')
  const [error, setError] = useState<string | undefined>()
  const [isPending, startTransition] = useTransition()

  function handleAliasChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value
    if (value.length <= 20 && ALIAS_ALLOWED.test(value)) {
      setAlias(value)
    }
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(undefined)

    if (alias.trim().length < 2) {
      setError('El nombre de aventurero debe tener al menos 2 caracteres.')
      return
    }
    if (!selectedAge) {
      setError('Selecciona un rango de edad.')
      return
    }

    const formData = new FormData()
    formData.set('alias', alias.trim())
    formData.set('age_range', selectedAge)
    formData.set('avatar', selectedAvatar)

    startTransition(async () => {
      const result = await createChildProfile(formData)
      if (result?.error) setError(result.error)
    })
  }

  return (
    <div className="w-full max-w-lg">
      <div className="text-center mb-8">
        <div className="text-6xl mb-3 transition-all duration-200">{selectedAvatar}</div>
        <h1 className="text-3xl font-bold text-white">Nuevo aventurero</h1>
        <p className="text-slate-400 mt-2">Crea un perfil para tu hijo</p>
      </div>

      <div className="bg-[#12122a] border border-[#534AB7]/30 rounded-2xl p-8 shadow-2xl">
        <form onSubmit={handleSubmit} className="space-y-6" noValidate>

          {/* Alias */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="alias" className="text-sm text-slate-300">
                Nombre de aventurero
              </label>
              <span
                className={`text-xs tabular-nums ${alias.length >= 18 ? 'text-amber-400' : 'text-slate-500'}`}
              >
                {alias.length}/20
              </span>
            </div>
            <input
              id="alias"
              type="text"
              value={alias}
              onChange={handleAliasChange}
              placeholder="CodiHero"
              autoComplete="off"
              autoCapitalize="none"
              className="w-full bg-[#0d0d1a] border border-[#534AB7]/40 text-white placeholder-slate-600 rounded-lg px-4 py-3 focus:outline-none focus:border-[#534AB7] focus:ring-1 focus:ring-[#534AB7] transition"
            />
            <p className="text-xs text-slate-500 mt-1">Solo letras, números y guiones</p>
          </div>

          {/* Age range */}
          <div>
            <p className="text-sm text-slate-300 mb-2">Edad</p>
            <div className="grid grid-cols-2 gap-3">
              {AGE_RANGES.map(({ value, label, emoji }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setSelectedAge(value)}
                  className={`border rounded-xl p-3 text-center transition ${
                    selectedAge === value
                      ? 'border-[#534AB7] bg-[#534AB7]/15 text-white'
                      : 'border-[#534AB7]/30 text-slate-400 hover:border-[#534AB7]/60 hover:text-slate-300'
                  }`}
                >
                  <div className="text-2xl mb-1">{emoji}</div>
                  <p className="text-sm">{label}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Avatar picker */}
          <div>
            <p className="text-sm text-slate-300 mb-2">Avatar</p>
            <div className="grid grid-cols-8 gap-1.5">
              {AVATARS.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => setSelectedAvatar(emoji)}
                  aria-label={emoji}
                  aria-pressed={selectedAvatar === emoji}
                  className={`text-2xl p-2 rounded-lg transition ${
                    selectedAvatar === emoji
                      ? 'bg-[#534AB7]/30 ring-2 ring-[#534AB7]'
                      : 'hover:bg-[#534AB7]/10'
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <div className="flex gap-3">
            <Link
              href="/app/familia"
              className="flex-1 border border-[#534AB7]/50 hover:border-[#534AB7] text-slate-300 hover:text-white font-semibold py-3 rounded-xl text-center transition text-sm"
            >
              Cancelar
            </Link>
            <button
              type="submit"
              disabled={isPending}
              className="flex-1 bg-[#00d4a1] hover:bg-[#00b88e] disabled:opacity-50 disabled:cursor-not-allowed text-[#0d0d1a] font-bold py-3 rounded-xl transition text-sm"
            >
              {isPending ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-[#0d0d1a]/30 border-t-[#0d0d1a] rounded-full animate-spin" />
                  Creando...
                </span>
              ) : (
                '¡Crear aventurero!'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
