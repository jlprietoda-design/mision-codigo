import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { LandingNavbar } from '@/components/layout/LandingNavbar'
import { StarryBackground } from '@/components/ui/StarryBackground'
import { DonationWidget } from '@/components/ui/DonationWidget'
import { createClient } from '@/lib/supabase/server'

const LEVEL_EMOJIS = ['🚀', '🏝️', '🌲', '🏙️', '🤖', '💻']
const LEVEL_KEYS = ['level0', 'level1', 'level2', 'level3', 'level4', 'level5'] as const
const LEVEL_AVAILABLE = [true, true, false, false, false, false]

const HOW_IT_WORKS_ICONS = ['🎯', '🧠', '🎮', '🏆']
const HOW_IT_WORKS_STEPS = ['01', '02', '03', '04']

const FAMILY_ICONS = ['🎨', '🧩', '🛡️']

const SECURITY_ICONS = ['🚫', '🔒', '📵', '💬', '🔐', '👨‍👩‍👧']
const SECURITY_KEYS = ['item0', 'item1', 'item2', 'item3', 'item4', 'item5'] as const


export default async function HomePage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  const hasSession = !!user

  const tNav = await getTranslations('nav')
  const tHero = await getTranslations('hero')
  const tTrust = await getTranslations('trust')
  const tHow = await getTranslations('howItWorks')
  const tLevels = await getTranslations('levels')
  const tFam = await getTranslations('families')
  const tSec = await getTranslations('security')
  const tFooter = await getTranslations('footer')

  const HOW_IT_WORKS = HOW_IT_WORKS_STEPS.map((step, i) => ({
    step,
    icon: HOW_IT_WORKS_ICONS[i],
    title: tHow(`step${i}Title` as Parameters<typeof tHow>[0]),
    desc: tHow(`step${i}Desc` as Parameters<typeof tHow>[0]),
  }))

  const LEVELS = LEVEL_KEYS.map((key, i) => ({
    emoji: LEVEL_EMOJIS[i],
    name: tLevels(`${key}Name` as Parameters<typeof tLevels>[0]),
    concept: tLevels(`${key}Concept` as Parameters<typeof tLevels>[0]),
    available: LEVEL_AVAILABLE[i],
  }))

  const FAMILY_BENEFITS = FAMILY_ICONS.map((icon, i) => ({
    icon,
    title: tFam(`benefit${i}Title` as Parameters<typeof tFam>[0]),
    desc: tFam(`benefit${i}Desc` as Parameters<typeof tFam>[0]),
  }))

  const SECURITY_ITEMS = SECURITY_ICONS.map((icon, i) => ({
    icon,
    text: tSec(SECURITY_KEYS[i]),
  }))

  return (
    <>
      <LandingNavbar hasSession={hasSession} />

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16 bg-[#0d0d1a]">
        <StarryBackground />

        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center py-20">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-2 mb-8 text-sm text-white/80">
            <span>🆕</span>
            <span>{tHero('badge')}</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight mb-6 text-white">
            {tHero('titlePre')}{' '}
            <span className="text-[#00B894]">{tHero('titleGames')}</span>
            <br />
            {tHero('titleMid')}{' '}
            <span className="text-[#a59cf0]">{tHero('titleLogic')}</span>
            {' '}{tHero('titleAnd')}{' '}
            <span className="text-[#a59cf0]">{tHero('titleAI')}</span>
          </h1>

          <p className="text-white/70 text-lg md:text-xl max-w-2xl mx-auto mb-8 leading-relaxed">
            {tHero('subtitle')}
          </p>

          <div
            className="text-7xl md:text-8xl mb-10 select-none"
            style={{ animation: 'float 3s ease-in-out infinite' }}
          >
            🤖
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/registro"
              className="bg-[#00B894] hover:bg-[#009e7e] active:scale-95 text-white font-bold text-lg px-10 py-4 rounded-2xl transition-all duration-200 hover:scale-105 shadow-[0_0_40px_rgba(0,184,148,0.4)]"
            >
              {tHero('ctaPrimary')}
            </Link>
            <a
              href="#como-funciona"
              className="border border-white/30 hover:border-white/70 text-white/80 hover:text-white font-semibold text-lg px-10 py-4 rounded-2xl transition-all duration-200"
            >
              {tHero('ctaSecondary')}
            </a>
          </div>
        </div>
      </section>

      <div className="bg-[#F8F9FF] text-[#1a1a2e]">

        {/* ── TRUST BAR ───────────────────────────────────────── */}
        <div className="bg-white border-b border-[#E0E0F0] py-5">
          <div className="max-w-4xl mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
              {[
                { icon: '🚫', text: tTrust('noAds') },
                { icon: '📵', text: tTrust('noEmail') },
                { icon: '👨‍👩‍👧', text: tTrust('parentControl') },
                { icon: '💚', text: tTrust('free') },
              ].map(({ icon, text }) => (
                <div key={text} className="flex items-center gap-2.5 justify-center">
                  <span className="text-lg flex-shrink-0">{icon}</span>
                  <span className="text-[#4a4a6a] text-sm font-medium">{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── CÓMO FUNCIONA ───────────────────────────────────── */}
        <section id="como-funciona" className="py-24 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-[#1a1a2e] mb-4">
                {tHow('heading')}
              </h2>
              <p className="text-[#4a4a6a] text-lg max-w-lg mx-auto">
                {tHow('subheading')}
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {HOW_IT_WORKS.map(({ step, icon, title, desc }) => (
                <div
                  key={step}
                  className="bg-white border border-[#E0E0F0] hover:border-[#534AB7]/40 rounded-2xl p-6 transition-all duration-300 hover:shadow-[0_2px_20px_rgba(83,74,183,0.12)] group"
                >
                  <div className="text-5xl font-extrabold text-[#534AB7]/20 font-mono mb-2 leading-none group-hover:text-[#534AB7]/35 transition-colors">
                    {step}
                  </div>
                  <div className="text-3xl mb-3">{icon}</div>
                  <h3 className="text-[#1a1a2e] font-bold text-sm mb-2 leading-snug">{title}</h3>
                  <p className="text-[#4a4a6a] text-sm leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── NIVELES ─────────────────────────────────────────── */}
        <section id="niveles" className="py-24 px-4 bg-[#EEF0FF]">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-[#1a1a2e] mb-4">
                {tLevels('heading')}
              </h2>
              <p className="text-[#4a4a6a] text-lg max-w-lg mx-auto">
                {tLevels('subheading')}
              </p>
            </div>

            <div className="flex gap-4 overflow-x-auto pb-4 md:grid md:grid-cols-2 lg:grid-cols-3 md:overflow-visible md:pb-0">
              {LEVELS.map(({ emoji, name, concept, available }) => (
                <div
                  key={name}
                  className={[
                    'flex-shrink-0 w-64 md:w-auto bg-white border rounded-2xl p-5 flex items-start gap-4 transition-all duration-300',
                    available
                      ? 'border-[#534AB7]/30 hover:border-[#534AB7] hover:shadow-[0_2px_20px_rgba(83,74,183,0.15)]'
                      : 'border-[#E0E0F0] opacity-60',
                  ].join(' ')}
                >
                  <span className="text-4xl leading-none flex-shrink-0">{emoji}</span>
                  <div className="min-w-0">
                    <p className="text-[#1a1a2e] font-bold text-sm leading-tight mb-1">{name}</p>
                    <p className="text-[#4a4a6a] text-xs leading-snug">{concept}</p>
                    {available ? (
                      <span className="inline-block mt-2 text-[10px] text-[#00B894] bg-[#00B894]/10 border border-[#00B894]/30 rounded-full px-2.5 py-0.5">
                        {tLevels('available')}
                      </span>
                    ) : (
                      <span className="inline-block mt-2 text-[10px] text-[#4a4a6a] bg-[#EEF0FF] rounded-full px-2.5 py-0.5">
                        {tLevels('comingSoon')}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── PARA FAMILIAS ───────────────────────────────────── */}
        <section id="familias" className="py-24 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-[#1a1a2e] mb-4">
                {tFam('headingPre')}{' '}
                <span className="text-[#534AB7]">{tFam('headingHighlight')}</span>
              </h2>
              <p className="text-[#4a4a6a] text-lg max-w-lg mx-auto">
                {tFam('subheading')}
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-5 mb-14">
              {FAMILY_BENEFITS.map(({ icon, title, desc }) => (
                <div
                  key={title}
                  className="bg-white border border-[#E0E0F0] hover:border-[#534AB7]/40 rounded-2xl p-6 transition-all duration-300 hover:shadow-[0_2px_16px_rgba(83,74,183,0.1)]"
                >
                  <div className="text-4xl mb-4">{icon}</div>
                  <h3 className="text-[#1a1a2e] font-bold text-base mb-2">{title}</h3>
                  <p className="text-[#4a4a6a] text-sm leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>

            <div className="text-center">
              <Link
                href="/registro"
                className="inline-flex items-center gap-2 bg-[#00B894] hover:bg-[#009e7e] active:scale-95 text-white font-bold text-lg px-10 py-4 rounded-2xl transition-all duration-200 hover:scale-105 shadow-[0_2px_20px_rgba(0,184,148,0.25)]"
              >
                {tFam('cta')}
              </Link>
            </div>
          </div>
        </section>

        {/* ── SEGURIDAD ───────────────────────────────────────── */}
        <section id="seguridad" className="py-24 px-4 bg-[#EEF0FF]">
          <div className="max-w-3xl mx-auto text-center">
            <div className="text-5xl mb-5">🔒</div>
            <h2 className="text-3xl md:text-4xl font-bold text-[#1a1a2e] mb-4">
              {tSec('heading')}
            </h2>
            <p className="text-[#4a4a6a] text-lg mb-12 max-w-xl mx-auto">
              {tSec('subheading')}
            </p>

            <div className="bg-white border border-[#E0E0F0] rounded-2xl p-8 shadow-[0_2px_12px_rgba(83,74,183,0.08)]">
              <div className="grid sm:grid-cols-2 gap-4 text-left">
                {SECURITY_ITEMS.map(({ icon, text }) => (
                  <div key={text} className="flex items-start gap-3">
                    <span className="text-lg flex-shrink-0 mt-0.5">{icon}</span>
                    <span className="text-[#4a4a6a] text-sm leading-relaxed">{text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── DONACIONES ──────────────────────────────────────── */}
        <DonationWidget />

        {/* ── FOOTER ──────────────────────────────────────────── */}
        <footer className="border-t border-[#E0E0F0] py-14 px-4 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row items-start justify-between gap-10 mb-10">
              <div className="max-w-xs">
                <div className="flex items-center gap-2 font-bold text-[#1a1a2e] text-xl mb-3">
                  <span className="text-2xl">🤖</span>
                  <span>Misión Código</span>
                </div>
                <p className="text-[#4a4a6a] text-sm leading-relaxed">
                  {tFooter('tagline')}
                </p>
              </div>

              <div className="flex gap-14 text-sm flex-shrink-0">
                <div className="flex flex-col gap-3">
                  <p className="text-[#1a1a2e] text-xs font-semibold uppercase tracking-wider mb-1">
                    {tFooter('platformHeading')}
                  </p>
                  <a href="#como-funciona" className="text-[#4a4a6a] hover:text-[#534AB7] transition-colors">{tFooter('howItWorks')}</a>
                  <a href="#niveles" className="text-[#4a4a6a] hover:text-[#534AB7] transition-colors">{tFooter('levels')}</a>
                  <Link href="/registro" className="text-[#4a4a6a] hover:text-[#534AB7] transition-colors">{tFooter('startFree')}</Link>
                </div>
                <div className="flex flex-col gap-3">
                  <p className="text-[#1a1a2e] text-xs font-semibold uppercase tracking-wider mb-1">
                    {tFooter('communityHeading')}
                  </p>
                  <a href="#familias" className="text-[#4a4a6a] hover:text-[#534AB7] transition-colors">{tFooter('forFamilies')}</a>
                  <a href="#seguridad" className="text-[#4a4a6a] hover:text-[#534AB7] transition-colors">{tFooter('security')}</a>
                  <a href="#donar" className="text-[#4a4a6a] hover:text-[#534AB7] transition-colors">{tFooter('donate')}</a>
                </div>
              </div>
            </div>

            <div className="border-t border-[#E0E0F0] pt-8 flex flex-col sm:flex-row items-center justify-between gap-3">
              <p className="text-[#4a4a6a] text-sm">
                {tFooter('madeWith')}
              </p>
              <Link href="/login" className="text-[#534AB7] hover:text-[#4338ca] text-sm transition-colors font-medium">
                {tFooter('signIn')}
              </Link>
            </div>
          </div>
        </footer>

      </div>
    </>
  )
}
