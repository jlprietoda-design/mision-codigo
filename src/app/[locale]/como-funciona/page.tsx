import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { LandingNavbar } from '@/components/layout/LandingNavbar'
import { LandingFooter } from '@/components/layout/LandingFooter'
import { createClient } from '@/lib/supabase/server'

interface Props { params: Promise<{ locale: string }> }

export default async function ComoFuncionaPage({ params }: Props) {
  await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const t = await getTranslations('comoFunciona')

  const steps = [
    {
      icon: t('step1Icon'),
      title: t('step1Title'),
      desc: t('step1Desc'),
      points: [t('step1Point1'), t('step1Point2'), t('step1Point3')],
    },
    {
      icon: t('step2Icon'),
      title: t('step2Title'),
      desc: t('step2Desc'),
      points: [t('step2Point1'), t('step2Point2'), t('step2Point3')],
    },
    {
      icon: t('step3Icon'),
      title: t('step3Title'),
      desc: t('step3Desc'),
      points: [t('step3Point1'), t('step3Point2'), t('step3Point3')],
    },
    {
      icon: t('step4Icon'),
      title: t('step4Title'),
      desc: t('step4Desc'),
      points: [t('step4Point1'), t('step4Point2'), t('step4Point3')],
    },
  ]

  const conceptKeys = [
    'concept1', 'concept2', 'concept3', 'concept4', 'concept5',
    'concept6', 'concept7', 'concept8', 'concept9', 'concept10',
  ] as const
  const concepts = conceptKeys.map((key) => t(key))

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

        {/* Steps */}
        <section className="py-20 px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-[#1a1a2e] text-center mb-12">
              {t('stepsTitle')}
            </h2>
            <div className="flex flex-col gap-6">
              {steps.map((step, i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl p-6 shadow-[0_2px_12px_rgba(83,74,183,0.08)] border border-[#E0E0F0] flex gap-5"
                >
                  <div className="flex-shrink-0 flex flex-col items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-[#534AB7] text-white flex items-center justify-center font-bold text-sm">
                      {String(i + 1).padStart(2, '0')}
                    </div>
                    <span className="text-2xl">{step.icon}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold text-[#1a1a2e] mb-2">{step.title}</h3>
                    <p className="text-[#4a4a6a] text-sm leading-relaxed mb-4">{step.desc}</p>
                    <ul className="flex flex-col gap-1.5">
                      {step.points.map((point, j) => (
                        <li key={j} className="flex items-start gap-2 text-sm text-[#4a4a6a]">
                          <span className="text-[#00B894] font-bold mt-0.5 flex-shrink-0">✓</span>
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Concepts */}
        <section className="bg-[#EEF0FF] py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-[#1a1a2e] mb-3">{t('conceptsTitle')}</h2>
            <p className="text-[#4a4a6a] mb-10">{t('conceptsSubtitle')}</p>
            <div className="flex flex-wrap justify-center gap-3">
              {concepts.map((concept, i) => (
                <span
                  key={i}
                  className="bg-white border border-[#E0E0F0] text-[#534AB7] font-semibold text-sm px-4 py-2 rounded-full shadow-sm"
                >
                  {concept}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-[#534AB7] py-20 px-4 text-center">
          <div className="max-w-xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-4">{t('ctaTitle')}</h2>
            <p className="text-white/80 mb-8">{t('ctaDesc')}</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/registro"
                className="bg-[#00B894] hover:bg-[#009e7e] active:scale-95 text-white font-bold px-8 py-3 rounded-xl text-base transition-all duration-150"
              >
                {t('ctaButton')}
              </Link>
              <Link
                href="/login"
                className="text-white/80 hover:text-white text-sm transition-colors underline underline-offset-2"
              >
                {t('ctaLogin')}
              </Link>
            </div>
          </div>
        </section>

        <LandingFooter />
      </div>
    </>
  )
}
