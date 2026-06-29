'use client'

import { useState, useTransition } from 'react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { signUp } from '@/app/actions/auth'

export function RegistroForm() {
  const t = useTranslations('auth')
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
      setError(t('validationName'))
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError(t('validationEmail'))
      return
    }
    if (password.length < 8) {
      setError(t('validationPasswordLength'))
      return
    }
    if (password !== confirmPassword) {
      setError(t('validationPasswordMatch'))
      return
    }
    if (!termsAccepted) {
      setError(t('validationTerms'))
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
          <h2 className="text-2xl font-bold text-[#1a1a2e] mb-3">{t('confirmationTitle')}</h2>
          <p className="text-[#4a4a6a] mb-6">{t('confirmationText')}</p>
          <Link
            href="/login"
            className="block w-full bg-[#534AB7] hover:bg-[#4338ca] text-white font-bold py-3 rounded-lg transition text-center"
          >
            {t('backToLogin')}
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
          <h1 className="text-3xl font-bold text-[#1a1a2e]">{t('registerTitle')}</h1>
          <p className="text-[#4a4a6a] mt-2">{t('registerSubtitle')}</p>
        </div>

        <div className="bg-white border border-[#E0E0F0] rounded-2xl p-8 shadow-[0_2px_20px_rgba(83,74,183,0.1)]">
          <h2 className="text-xl font-semibold text-[#1a1a2e] mb-6">{t('registerHeading')}</h2>

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>

            <div>
              <label htmlFor="name" className="block text-sm text-[#4a4a6a] font-medium mb-1.5">
                {t('fullName')}
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                autoComplete="name"
                placeholder={t('namePlaceholder')}
                className="w-full bg-white border border-[#E0E0F0] text-[#1a1a2e] placeholder-[#4a4a6a]/40 rounded-lg px-4 py-3 focus:outline-none focus:border-[#534AB7] focus:ring-2 focus:ring-[#534AB7]/20 transition"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm text-[#4a4a6a] font-medium mb-1.5">
                {t('email')}
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder={t('emailPlaceholder')}
                className="w-full bg-white border border-[#E0E0F0] text-[#1a1a2e] placeholder-[#4a4a6a]/40 rounded-lg px-4 py-3 focus:outline-none focus:border-[#534AB7] focus:ring-2 focus:ring-[#534AB7]/20 transition"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm text-[#4a4a6a] font-medium mb-1.5">
                {t('password')}
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="new-password"
                placeholder={t('passwordMinPlaceholder')}
                className="w-full bg-white border border-[#E0E0F0] text-[#1a1a2e] placeholder-[#4a4a6a]/40 rounded-lg px-4 py-3 focus:outline-none focus:border-[#534AB7] focus:ring-2 focus:ring-[#534AB7]/20 transition"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm text-[#4a4a6a] font-medium mb-1.5">
                {t('confirmPassword')}
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                autoComplete="new-password"
                placeholder={t('confirmPlaceholder')}
                className="w-full bg-white border border-[#E0E0F0] text-[#1a1a2e] placeholder-[#4a4a6a]/40 rounded-lg px-4 py-3 focus:outline-none focus:border-[#534AB7] focus:ring-2 focus:ring-[#534AB7]/20 transition"
              />
            </div>

            {/* Tipo de cuenta */}
            <div>
              <p className="text-sm text-[#4a4a6a] font-medium mb-2">{t('accountType')}</p>
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
                  <p className="text-xs text-[#4a4a6a] leading-tight">{t('familyRole')}</p>
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
                  <p className="text-xs text-[#4a4a6a] leading-tight">{t('teacherRole')}</p>
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
                {t('termsPrefix')}{' '}
                <span
                  className="text-[#534AB7] hover:text-[#4338ca] transition"
                  onClick={(e) => e.stopPropagation()}
                >
                  {t('termsLink')}
                </span>{' '}
                {t('termsAnd')}{' '}
                <span
                  className="text-[#534AB7] hover:text-[#4338ca] transition"
                  onClick={(e) => e.stopPropagation()}
                >
                  {t('privacyLink')}
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
                  {t('registerSubmitting')}
                </span>
              ) : (
                t('registerSubmit')
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-[#4a4a6a] mt-6 text-sm">
          {t('hasAccount')}{' '}
          <Link
            href="/login"
            className="text-[#534AB7] hover:text-[#4338ca] font-semibold transition"
          >
            {t('toLogin')}
          </Link>
        </p>
      </div>
    </div>
  )
}
