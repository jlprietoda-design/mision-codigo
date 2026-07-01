'use client'

import { useState } from 'react'
import { useTranslations, useLocale } from 'next-intl'

const PRESET_AMOUNTS = [3, 5, 10, 25]

export function DonationWidget() {
  const t = useTranslations('donate')
  const locale = useLocale()

  const [selectedAmount, setSelectedAmount] = useState<number | null>(5)
  const [customAmount, setCustomAmount] = useState('')
  const [isMonthly, setIsMonthly] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const effectiveAmount =
    customAmount !== '' ? parseFloat(customAmount) || null : selectedAmount

  function handlePreset(amount: number) {
    setSelectedAmount(amount)
    setCustomAmount('')
    setError(null)
  }

  function handleCustomChange(value: string) {
    setCustomAmount(value)
    setSelectedAmount(null)
    setError(null)
  }

  async function handleDonate() {
    if (!effectiveAmount || effectiveAmount < 1) return
    setIsLoading(true)
    setError(null)

    try {
      const payload = { amount: effectiveAmount, isMonthly, locale }
      console.log('[DonationWidget] enviando:', payload)

      const res = await fetch('/api/donations/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      console.log('[DonationWidget] status respuesta:', res.status)
      const data = (await res.json()) as { url?: string; error?: string }
      console.log('[DonationWidget] body respuesta:', data)

      if (!res.ok || !data.url) {
        console.error('[DonationWidget] error del servidor:', data.error ?? 'sin url')
        setError(t('errorGeneric'))
        return
      }

      window.location.href = data.url
    } catch (err) {
      console.error('[DonationWidget] excepción de red:', err)
      setError(t('errorGeneric'))
    } finally {
      setIsLoading(false)
    }
  }

  const amountLabel = effectiveAmount != null ? `${effectiveAmount}€` : ''
  const buttonLabel = isLoading
    ? t('donating')
    : amountLabel
      ? `${t('donateButton')} ${amountLabel}${isMonthly ? t('perMonth') : ''}`
      : t('donateButton')

  return (
    <section className="py-24 px-4 bg-[#EEF0FF]">
      <div className="max-w-xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-5">💚</div>
          <h2 className="text-3xl md:text-4xl font-bold text-[#1a1a2e] mb-4">
            {t('heading')}
          </h2>
          <p className="text-[#4a4a6a] text-base leading-relaxed">
            {t('title')}
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-[0_4px_24px_rgba(83,74,183,0.12)] p-8">

          {/* Type toggle */}
          <div className="flex rounded-xl border border-[#E0E0F0] overflow-hidden mb-6 text-sm font-semibold">
            <button
              onClick={() => setIsMonthly(false)}
              disabled={isLoading}
              className={[
                'flex-1 py-2.5 transition-colors duration-200 disabled:opacity-60',
                !isMonthly
                  ? 'bg-[#534AB7] text-white'
                  : 'text-[#4a4a6a] hover:bg-[#F8F9FF]',
              ].join(' ')}
            >
              {t('oneTime')}
            </button>
            <button
              onClick={() => setIsMonthly(true)}
              disabled={isLoading}
              className={[
                'flex-1 py-2.5 transition-colors duration-200 disabled:opacity-60',
                isMonthly
                  ? 'bg-[#534AB7] text-white'
                  : 'text-[#4a4a6a] hover:bg-[#F8F9FF]',
              ].join(' ')}
            >
              {t('monthly')}
            </button>
          </div>

          {/* Preset amounts */}
          <div className="grid grid-cols-4 gap-2 mb-4">
            {PRESET_AMOUNTS.map((amount) => (
              <button
                key={amount}
                onClick={() => handlePreset(amount)}
                disabled={isLoading}
                className={[
                  'py-3 rounded-xl border-2 font-bold text-sm transition-all duration-200 disabled:opacity-60',
                  selectedAmount === amount
                    ? 'bg-[#534AB7] border-[#534AB7] text-white shadow-[0_2px_8px_rgba(83,74,183,0.3)]'
                    : 'border-[#534AB7]/30 text-[#534AB7] hover:border-[#534AB7] hover:bg-[#EEF0FF]',
                ].join(' ')}
              >
                {amount}€
              </button>
            ))}
          </div>

          {/* Custom amount */}
          <div className="mb-6">
            <label className="block text-[#4a4a6a] text-xs font-medium mb-1.5">
              {t('otherAmount')}
            </label>
            <div className="relative">
              <input
                type="number"
                min={1}
                value={customAmount}
                disabled={isLoading}
                onChange={(e) => handleCustomChange(e.target.value)}
                placeholder={t('otherAmountPlaceholder')}
                className="w-full border-2 border-[#E0E0F0] focus:border-[#534AB7] focus:outline-none rounded-xl px-4 py-3 pr-10 text-sm text-[#1a1a2e] placeholder-[#4a4a6a]/40 transition-colors disabled:opacity-60"
              />
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#4a4a6a]/40 text-sm font-bold select-none">
                €
              </span>
            </div>
          </div>

          {/* Error message */}
          {error && (
            <p className="text-red-500 text-xs text-center mb-4">{error}</p>
          )}

          {/* Donate button */}
          <button
            onClick={handleDonate}
            disabled={isLoading || !effectiveAmount || effectiveAmount < 1}
            className="w-full bg-[#00B894] hover:bg-[#009e7e] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold text-base px-6 py-4 rounded-2xl transition-all duration-200 hover:shadow-[0_4px_16px_rgba(0,184,148,0.35)] flex items-center justify-center gap-2"
          >
            {isLoading && (
              <span className="inline-block w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            )}
            {buttonLabel}
          </button>

          {/* Secure payment note */}
          <p className="text-[#4a4a6a]/60 text-xs text-center mt-4">
            {t('securePayment')}
          </p>
        </div>
      </div>
    </section>
  )
}
