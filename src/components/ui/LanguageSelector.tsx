'use client'

import { useLocale } from 'next-intl'
import { useRouter, usePathname } from '@/i18n/navigation'
import { routing } from '@/i18n/routing'
import { useTransition } from 'react'

export function LanguageSelector() {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()
  const [isPending, startTransition] = useTransition()

  function switchLocale(newLocale: string) {
    startTransition(() => {
      router.replace(pathname, { locale: newLocale })
    })
  }

  return (
    <div className="flex items-center gap-0.5 bg-[#F0F0FA] rounded-lg p-0.5">
      {routing.locales.map((loc) => (
        <button
          key={loc}
          onClick={() => switchLocale(loc)}
          disabled={isPending}
          className={[
            'px-2.5 py-1 rounded-md text-xs font-bold transition-all duration-150 disabled:opacity-50',
            locale === loc
              ? 'bg-[#534AB7] text-white shadow-sm'
              : 'text-[#4a4a6a] hover:text-[#534AB7]',
          ].join(' ')}
        >
          {loc.toUpperCase()}
        </button>
      ))}
    </div>
  )
}
