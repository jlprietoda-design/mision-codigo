'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { LanguageSelector } from '@/components/ui/LanguageSelector'

interface Props {
  hasSession?: boolean
}

export function LandingNavbar({ hasSession = false }: Props) {
  const t = useTranslations('nav')
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const navLinks = [
    { href: '#como-funciona', label: t('howItWorks') },
    { href: '#niveles', label: t('levels') },
    { href: '#familias', label: t('families') },
    { href: '#seguridad', label: t('security') },
    { href: '#donar', label: t('donate') },
  ]

  const linkClass = scrolled
    ? 'text-[#4a4a6a] hover:text-[#534AB7]'
    : 'text-white/80 hover:text-white'

  return (
    <nav
      className={[
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled
          ? 'bg-white border-b border-[#E0E0F0] shadow-[0_2px_12px_rgba(83,74,183,0.06)]'
          : 'bg-transparent border-b border-transparent',
      ].join(' ')}
    >
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link
          href="/"
          className={[
            'flex items-center gap-2 font-bold text-lg flex-shrink-0 hover:opacity-80 transition-opacity',
            scrolled ? 'text-[#1a1a2e]' : 'text-white',
          ].join(' ')}
        >
          <span className="text-2xl">🤖</span>
          <span>Misión Código</span>
        </Link>

        {/* Nav links — desktop */}
        <div className="hidden md:flex items-center gap-6 text-sm">
          {navLinks.map(({ href, label }) => (
            <a
              key={href}
              href={href}
              className={`transition-colors duration-150 ${linkClass}`}
            >
              {label}
            </a>
          ))}
        </div>

        {/* Auth buttons + language selector — desktop */}
        <div className="hidden md:flex items-center gap-3 flex-shrink-0">
          <LanguageSelector />
          {hasSession ? (
            <Link
              href="/app/familia"
              className="bg-[#534AB7] hover:bg-[#4338ca] active:scale-95 text-white font-bold px-4 py-2 rounded-xl text-sm transition-all duration-150"
            >
              {t('goToPlatform')}
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className={[
                  'border font-semibold px-4 py-2 rounded-xl text-sm transition-all duration-150',
                  scrolled
                    ? 'border-[#534AB7]/50 hover:border-[#534AB7] text-[#534AB7]'
                    : 'border-white/40 hover:border-white text-white',
                ].join(' ')}
              >
                {t('login')}
              </Link>
              <Link
                href="/registro"
                className="bg-[#00B894] hover:bg-[#009e7e] active:scale-95 text-white font-bold px-4 py-2 rounded-xl text-sm transition-all duration-150"
              >
                {t('register')}
              </Link>
            </>
          )}
        </div>

        {/* Hamburger — mobile */}
        <button
          onClick={() => setMenuOpen((v) => !v)}
          className={[
            'md:hidden transition-colors p-2 rounded-lg',
            scrolled ? 'text-[#4a4a6a] hover:text-[#1a1a2e]' : 'text-white/80 hover:text-white',
          ].join(' ')}
          aria-label={menuOpen ? t('menuClose') : t('menuOpen')}
          aria-expanded={menuOpen}
        >
          <span className="text-xl">{menuOpen ? '✕' : '☰'}</span>
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-[#E0E0F0] px-4 py-4 flex flex-col gap-1 shadow-lg">
          {navLinks.map(({ href, label }) => (
            <a
              key={href}
              href={href}
              onClick={() => setMenuOpen(false)}
              className="text-[#4a4a6a] hover:text-[#534AB7] text-sm py-2.5 px-2 rounded-lg hover:bg-[#EEF0FF] transition-colors"
            >
              {label}
            </a>
          ))}
          <div className="flex flex-col gap-2 pt-3 mt-1 border-t border-[#E0E0F0]">
            <div className="flex justify-center py-1">
              <LanguageSelector />
            </div>
            {!hasSession && (
              <Link
                href="/login"
                onClick={() => setMenuOpen(false)}
                className="border border-[#534AB7]/50 text-[#534AB7] font-semibold px-4 py-3 rounded-xl text-sm text-center"
              >
                {t('login')}
              </Link>
            )}
            <Link
              href={hasSession ? '/app/familia' : '/registro'}
              onClick={() => setMenuOpen(false)}
              className="bg-[#534AB7] text-white font-bold px-4 py-3 rounded-xl text-sm text-center"
            >
              {hasSession ? t('goToPlatform') : t('register')}
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}
