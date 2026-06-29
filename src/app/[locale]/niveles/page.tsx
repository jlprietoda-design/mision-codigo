import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { LandingNavbar } from '@/components/layout/LandingNavbar'
import { LandingFooter } from '@/components/layout/LandingFooter'
import { LEVELS } from '@/lib/data/levels'
import { createClient } from '@/lib/supabase/server'

interface Props { params: Promise<{ locale: string }> }

export default async function NivelesPage({ params }: Props) {
  await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const t = await getTranslations('nivelesPage')

  const levelKeys = [
    'level0', 'level1', 'level2', 'level3', 'level4', 'level5',
    'level6', 'level7', 'level8', 'level9', 'level10',
  ] as const

  const levelsData = LEVELS.map((level, i) => {
    const key = levelKeys[i]
    const available = level.status !== 'locked'
    return {
      ...level,
      available,
      concept: t(`${key}Concept` as typeof levelKeys[number] extends string ? `${typeof levelKeys[number]}Concept` : never),
      learns: [
        t(`${key}Learn1` as Parameters<typeof t>[0]),
        t(`${key}Learn2` as Parameters<typeof t>[0]),
        t(`${key}Learn3` as Parameters<typeof t>[0]),
      ],
    }
  })

  const progressionSteps = [
    { label: t('progressionStep1'), desc: t('progressionStep1Desc') },
    { label: t('progressionStep2'), desc: t('progressionStep2Desc') },
    { label: t('progressionStep3'), desc: t('progressionStep3Desc') },
  ]

  return (
    <>
      <LandingNavbar hasSession={!!user} forceWhite />
      <div className="pt-16 bg-[#F8F9FF]">

        {/* Hero */}
        <section className="bg-[#EEF0FF] py-20 px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-[#1a1a2e] mb-5 leading-tight">
              {t('heroTitle')}
            </h1>
            <p className="text-lg text-[#4a4a6a] leading-relaxed max-w-2xl mx-auto">
              {t('heroSubtitle')}
            </p>
          </div>
        </section>

        {/* Levels grid */}
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {levelsData.map((level) => (
                <div
                  key={level.id}
                  className="bg-white rounded-2xl shadow-[0_2px_12px_rgba(83,74,183,0.08)] border border-[#E0E0F0] overflow-hidden flex flex-col"
                >
                  {/* Top colored band */}
                  <div className={`h-1.5 ${level.available ? 'bg-[#00B894]' : 'bg-[#D0D0E0]'}`} />
                  <div className="p-6 flex flex-col flex-1">
                    {/* Badge + level number */}
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-semibold text-[#4a4a6a] uppercase tracking-wider">
                        Nivel {level.id}
                      </span>
                      <span
                        className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                          level.available
                            ? 'bg-[#E8F8F5] text-[#00B894]'
                            : 'bg-[#F0F0F5] text-[#8888A8]'
                        }`}
                      >
                        {level.available ? t('badgeAvailable') : t('badgeComingSoon')}
                      </span>
                    </div>

                    {/* Title */}
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-3xl">{level.emoji}</span>
                      <h3 className="text-lg font-bold text-[#1a1a2e] leading-tight">{level.title_es}</h3>
                    </div>

                    {/* Concept */}
                    <p className="text-[#534AB7] text-sm font-semibold mb-4">{level.concept}</p>

                    {/* Learning points */}
                    <ul className="flex flex-col gap-1.5 flex-1">
                      {level.learns.map((learn, j) => (
                        <li key={j} className="flex items-start gap-2 text-sm text-[#4a4a6a]">
                          <span className="text-[#00B894] font-bold mt-0.5 flex-shrink-0">✓</span>
                          <span>{learn}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Progression */}
        <section className="bg-[#EEF0FF] py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-[#1a1a2e] mb-3">{t('progressionTitle')}</h2>
            <p className="text-[#4a4a6a] mb-12">{t('progressionSubtitle')}</p>
            <div className="flex flex-col md:flex-row items-center justify-center gap-4">
              {progressionSteps.map((step, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="bg-white rounded-2xl p-6 border border-[#E0E0F0] shadow-sm max-w-xs text-center">
                    <div className="w-8 h-8 rounded-full bg-[#534AB7] text-white flex items-center justify-center font-bold text-sm mx-auto mb-3">
                      {i + 1}
                    </div>
                    <h3 className="font-bold text-[#1a1a2e] mb-2">{step.label}</h3>
                    <p className="text-[#4a4a6a] text-sm">{step.desc}</p>
                  </div>
                  {i < progressionSteps.length - 1 && (
                    <span className="text-[#534AB7] text-2xl font-bold hidden md:block">→</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-[#534AB7] py-16 px-4 text-center">
          <div className="max-w-xl mx-auto">
            <Link
              href="/registro"
              className="inline-block bg-[#00B894] hover:bg-[#009e7e] active:scale-95 text-white font-bold px-10 py-4 rounded-xl text-lg transition-all duration-150"
            >
              {t('ctaButton')}
            </Link>
          </div>
        </section>

        <LandingFooter />
      </div>
    </>
  )
}
