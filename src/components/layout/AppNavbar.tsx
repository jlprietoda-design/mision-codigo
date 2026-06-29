'use client'

import { useTranslations } from 'next-intl'
import { Link, usePathname } from '@/i18n/navigation'
import { signOut } from '@/app/actions/auth'
import { useProfileStore } from '@/stores/profileStore'
import { LanguageSelector } from '@/components/ui/LanguageSelector'

export function AppNavbar() {
  const t = useTranslations('nav')
  const pathname = usePathname()
  const activeProfile = useProfileStore((s) => s.activeProfile)

  const isActive = (href: string) =>
    href === '/app/familia' ? pathname === href : pathname.startsWith(href)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-16 bg-white border-b border-[#E0E0F0] shadow-[0_2px_12px_rgba(83,74,183,0.06)] flex items-center px-4 gap-4">

      {/* Logo */}
      <Link
        href="/app/familia"
        className="flex items-center gap-2 font-bold text-[#1a1a2e] flex-shrink-0 hover:opacity-70 transition-opacity"
      >
        <span className="text-xl">🤖</span>
        <span className="hidden sm:inline text-sm">Misión Código</span>
      </Link>

      {/* Nav links */}
      <div className="flex-1 flex items-center justify-center gap-6 text-sm">
        <Link
          href="/app/familia"
          className={[
            'transition-colors duration-150 font-medium',
            isActive('/app/familia')
              ? 'text-[#534AB7]'
              : 'text-[#4a4a6a] hover:text-[#534AB7]',
          ].join(' ')}
        >
          {t('family')}
        </Link>
        <Link
          href="/app/mapa"
          className={[
            'transition-colors duration-150 font-medium',
            isActive('/app/mapa')
              ? 'text-[#534AB7]'
              : 'text-[#4a4a6a] hover:text-[#534AB7]',
          ].join(' ')}
        >
          {t('map')}
        </Link>
      </div>

      {/* Profile info + language + sign out */}
      <div className="flex items-center gap-3 flex-shrink-0">
        {activeProfile && (
          <div className="hidden sm:flex items-center gap-2">
            <span className="text-lg leading-none">{activeProfile.avatar}</span>
            <span className="text-[#4a4a6a] text-sm font-medium max-w-[120px] truncate">
              {activeProfile.alias}
            </span>
          </div>
        )}

        <LanguageSelector />

        <form action={signOut}>
          <button
            type="submit"
            className="border border-[#534AB7]/40 hover:border-[#534AB7] hover:bg-[#EEF0FF] text-[#534AB7] text-xs font-semibold px-3 py-1.5 rounded-lg transition-all duration-150"
          >
            {t('signOut')}
          </button>
        </form>
      </div>
    </nav>
  )
}
