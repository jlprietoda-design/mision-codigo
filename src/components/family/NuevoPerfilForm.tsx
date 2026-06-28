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
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#EEF0FF] mb-3 text-5xl transition-all duration-200">
          {selectedAvatar}
        </div>
        <h1 className="text-3xl font-bold text-[#1a1a2e]">Nuevo aventurero</h1>
        <p className="text-[#4a4a6a] mt-2">Crea un perfil para tu hijo</p>
      </div>

      <div className="bg-white border border-[#E0E0F0] rounded-2xl p-8 shadow-[0_2px_20px_rgba(83,74,183,0.08)]">
        <form onSubmit={handleSubmit} className="space-y-6" noValidate>

          {/* Alias */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="alias" className="text-sm text-[#4a4a6a] font-medium">
                Nombre de aventurero
              </label>
              <span
                className={`text-xs tabular-nums ${alias.length >= 18 ? 'text-amber-500' : 'text-[#4a4a6a]/50'}`}
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
              className="w-full bg-white border border-[#E0E0F0] text-[#1a1a2e] placeholder-[#4a4a6a]/40 rounded-lg px-4 py-3 focus:outline-none focus:border-[#534AB7] focus:ring-2 focus:ring-[#534AB7]/20 transition"
            />
            <p className="text-xs text-[#4a4a6a]/60 mt-1">Solo letras, números y guiones</p>
          </div>

          {/* Age range */}
          <div>
            <p className="text-sm text-[#4a4a6a] font-medium mb-2">Edad</p>
            <div className="grid grid-cols-2 gap-3">
              {AGE_RANGES.map(({ value, label, emoji }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setSelectedAge(value)}
                  className={`border rounded-xl p-3 text-center transition ${
                    selectedAge === value
                      ? 'border-[#534AB7] bg-[#EEF0FF] text-[#1a1a2e]'
                      : 'border-[#E0E0F0] text-[#4a4a6a] hover:border-[#534AB7]/40'
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
            <p className="text-sm text-[#4a4a6a] font-medium mb-2">Avatar</p>
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
                      ? 'bg-[#EEF0FF] ring-2 ring-[#534AB7]'
                      : 'hover:bg-[#F8F9FF]'
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <div className="flex gap-3">
            <Link
              href="/app/familia"
              className="flex-1 border border-[#E0E0F0] hover:border-[#534AB7]/40 text-[#4a4a6a] hover:text-[#534AB7] font-semibold py-3 rounded-xl text-center transition text-sm"
            >
              Cancelar
            </Link>
            <button
              type="submit"
              disabled={isPending}
              className="flex-1 bg-[#00B894] hover:bg-[#009e7e] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl transition text-sm"
            >
              {isPending ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
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
