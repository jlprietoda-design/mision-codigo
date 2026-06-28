'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export function LandingNavbar() {
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
    { href: '#como-funciona', label: 'Cómo funciona' },
    { href: '#niveles', label: 'Niveles' },
    { href: '#familias', label: 'Familias' },
    { href: '#seguridad', label: 'Seguridad' },
    { href: '#donar', label: 'Donar' },
  ]

  return (
    <nav
      className={[
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled
          ? 'bg-[#0d0d1a]/95 backdrop-blur-sm border-b border-[#534AB7]/25 shadow-[0_4px_30px_rgba(0,0,0,0.5)]'
          : 'bg-transparent border-b border-transparent',
      ].join(' ')}
    >
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 font-bold text-white text-lg flex-shrink-0 hover:opacity-80 transition-opacity"
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
              className="text-slate-400 hover:text-white transition-colors duration-150"
            >
              {label}
            </a>
          ))}
        </div>

        {/* Auth buttons — desktop */}
        <div className="hidden md:flex items-center gap-3 flex-shrink-0">
          <Link
            href="/login"
            className="border border-[#534AB7]/60 hover:border-[#534AB7] text-slate-300 hover:text-white font-semibold px-4 py-2 rounded-xl text-sm transition-all duration-150"
          >
            Iniciar sesión
          </Link>
          <Link
            href="/registro"
            className="bg-[#00d4a1] hover:bg-[#00b88e] active:scale-95 text-[#0d0d1a] font-bold px-4 py-2 rounded-xl text-sm transition-all duration-150"
          >
            Empezar gratis
          </Link>
        </div>

        {/* Hamburger — mobile */}
        <button
          onClick={() => setMenuOpen((v) => !v)}
          className="md:hidden text-slate-300 hover:text-white transition-colors p-2 rounded-lg"
          aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={menuOpen}
        >
          <span className="text-xl">{menuOpen ? '✕' : '☰'}</span>
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-[#0d0d1a]/98 border-t border-[#534AB7]/20 px-4 py-4 flex flex-col gap-1">
          {navLinks.map(({ href, label }) => (
            <a
              key={href}
              href={href}
              onClick={() => setMenuOpen(false)}
              className="text-slate-300 hover:text-white text-sm py-2.5 px-2 rounded-lg hover:bg-white/5 transition-colors"
            >
              {label}
            </a>
          ))}
          <div className="flex flex-col gap-2 pt-3 mt-1 border-t border-[#534AB7]/20">
            <Link
              href="/login"
              onClick={() => setMenuOpen(false)}
              className="border border-[#534AB7]/60 text-slate-300 font-semibold px-4 py-3 rounded-xl text-sm text-center"
            >
              Iniciar sesión
            </Link>
            <Link
              href="/registro"
              onClick={() => setMenuOpen(false)}
              className="bg-[#00d4a1] text-[#0d0d1a] font-bold px-4 py-3 rounded-xl text-sm text-center"
            >
              Empezar gratis
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}
