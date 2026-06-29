import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { LandingNavbar } from '@/components/layout/LandingNavbar'
import { LandingFooter } from '@/components/layout/LandingFooter'
import { FaqAccordion } from '@/components/ui/FaqAccordion'
import { createClient } from '@/lib/supabase/server'

interface Props { params: Promise<{ locale: string }> }

export default async function FamiliasPage({ params }: Props) {
  await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const t = await getTranslations('familiasPage')

  const whyCards = [
    { icon: t('why1Icon'), title: t('why1Title'), desc: t('why1Desc') },
    { icon: t('why2Icon'), title: t('why2Title'), desc: t('why2Desc') },
    { icon: t('why3Icon'), title: t('why3Title'), desc: t('why3Desc') },
  ]

  const safeItems = [
    t('safe1'), t('safe2'), t('safe3'), t('safe4'), t('safe5'),
  ]

  const progressPoints = [
    t('progressPoint1'), t('progressPoint2'), t('progressPoint3'), t('progressPoint4'),
  ]

  const faqItems = [
    { q: t('faq1Q'), a: t('faq1A') },
    { q: t('faq2Q'), a: t('faq2A') },
    { q: t('faq3Q'), a: t('faq3A') },
    { q: t('faq4Q'), a: t('faq4A') },
    { q: t('faq5Q'), a: t('faq5A') },
    { q: t('faq6Q'), a: t('faq6A') },
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

        {/* Why section */}
        <section className="py-20 px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl font-bold text-[#1a1a2e] text-center mb-12">{t('whyTitle')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {whyCards.map((card, i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl p-6 border border-[#E0E0F0] shadow-[0_2px_12px_rgba(83,74,183,0.08)] flex flex-col gap-3"
                >
                  <span className="text-3xl">{card.icon}</span>
                  <h3 className="text-lg font-bold text-[#1a1a2e]">{card.title}</h3>
                  <p className="text-[#4a4a6a] text-sm leading-relaxed">{card.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Safety section */}
        <section className="bg-[#EEF0FF] py-20 px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-[#1a1a2e] text-center mb-3">{t('safeTitle')}</h2>
            <p className="text-[#4a4a6a] text-center mb-10">{t('safeSubtitle')}</p>
            <div className="bg-white rounded-2xl p-8 border border-[#E0E0F0] shadow-sm">
              <ul className="flex flex-col gap-4">
                {safeItems.map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="text-[#00B894] font-bold text-lg flex-shrink-0 mt-0.5">✓</span>
                    <span className="text-[#1a1a2e] text-sm leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Progress section */}
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-[#1a1a2e] text-center mb-4">{t('progressTitle')}</h2>
            <p className="text-[#4a4a6a] text-center mb-10 max-w-2xl mx-auto">{t('progressDesc')}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {progressPoints.map((point, i) => (
                <div
                  key={i}
                  className="bg-white rounded-xl p-5 border border-[#E0E0F0] shadow-sm flex items-center gap-4"
                >
                  <div className="w-10 h-10 rounded-full bg-[#EEF0FF] flex items-center justify-center text-[#534AB7] font-bold flex-shrink-0">
                    {i + 1}
                  </div>
                  <span className="text-[#1a1a2e] text-sm font-medium">{point}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="bg-[#EEF0FF] py-20 px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-[#1a1a2e] text-center mb-10">{t('faqTitle')}</h2>
            <FaqAccordion items={faqItems} />
          </div>
        </section>

        {/* CTA */}
        <section className="bg-[#534AB7] py-20 px-4 text-center">
          <div className="max-w-xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-4">{t('ctaTitle')}</h2>
            <p className="text-white/80 mb-8">{t('ctaDesc')}</p>
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
