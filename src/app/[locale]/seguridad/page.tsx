import { getTranslations } from 'next-intl/server'
import { LandingNavbar } from '@/components/layout/LandingNavbar'
import { LandingFooter } from '@/components/layout/LandingFooter'
import { createClient } from '@/lib/supabase/server'

interface Props { params: Promise<{ locale: string }> }

export default async function SeguridadPage({ params }: Props) {
  await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const t = await getTranslations('seguridadPage')

  const principles = [
    { icon: t('p1Icon'), title: t('p1Title'), desc: t('p1Desc') },
    { icon: t('p2Icon'), title: t('p2Title'), desc: t('p2Desc') },
    { icon: t('p3Icon'), title: t('p3Title'), desc: t('p3Desc') },
    { icon: t('p4Icon'), title: t('p4Title'), desc: t('p4Desc') },
    { icon: t('p5Icon'), title: t('p5Title'), desc: t('p5Desc') },
    { icon: t('p6Icon'), title: t('p6Title'), desc: t('p6Desc') },
  ]

  const dataRows = [
    { col1: t('dataRow1Col1'), col2: t('dataRow1Col2'), col3: t('dataRow1Col3') },
    { col1: t('dataRow2Col1'), col2: t('dataRow2Col2'), col3: t('dataRow2Col3') },
    { col1: t('dataRow3Col1'), col2: t('dataRow3Col2'), col3: t('dataRow3Col3') },
    { col1: t('dataRow4Col1'), col2: t('dataRow4Col2'), col3: t('dataRow4Col3') },
  ]

  const noDataItems = [
    t('noData1'), t('noData2'), t('noData3'), t('noData4'), t('noData5'), t('noData6'),
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

        {/* Principles grid */}
        <section className="py-20 px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl font-bold text-[#1a1a2e] text-center mb-3">{t('principlesTitle')}</h2>
            <p className="text-[#4a4a6a] text-center mb-12">{t('principlesSubtitle')}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {principles.map((p, i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl p-6 border border-[#E0E0F0] shadow-[0_2px_12px_rgba(83,74,183,0.08)] flex flex-col gap-3"
                >
                  <span className="text-3xl">{p.icon}</span>
                  <h3 className="text-lg font-bold text-[#1a1a2e]">{p.title}</h3>
                  <p className="text-[#4a4a6a] text-sm leading-relaxed">{p.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Data table */}
        <section className="bg-[#EEF0FF] py-20 px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-[#1a1a2e] text-center mb-3">{t('dataTitle')}</h2>
            <p className="text-[#4a4a6a] text-center mb-10">{t('dataSubtitle')}</p>
            <div className="bg-white rounded-2xl border border-[#E0E0F0] shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-[#EEF0FF] border-b border-[#E0E0F0]">
                      <th className="text-left px-6 py-4 font-semibold text-[#1a1a2e]">{t('dataHeader1')}</th>
                      <th className="text-left px-6 py-4 font-semibold text-[#1a1a2e]">{t('dataHeader2')}</th>
                      <th className="text-left px-6 py-4 font-semibold text-[#1a1a2e]">{t('dataHeader3')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dataRows.map((row, i) => (
                      <tr key={i} className="border-b border-[#E0E0F0] last:border-0">
                        <td className="px-6 py-4 font-medium text-[#1a1a2e]">{row.col1}</td>
                        <td className="px-6 py-4 text-[#4a4a6a]">{row.col2}</td>
                        <td className="px-6 py-4 text-[#4a4a6a]">{row.col3}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        {/* No data section */}
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-[#1a1a2e] text-center mb-10">{t('noDataTitle')}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {noDataItems.map((item, i) => (
                <div
                  key={i}
                  className="bg-white rounded-xl p-4 border border-[#E0E0F0] shadow-sm flex items-start gap-3"
                >
                  <span className="text-red-500 font-bold flex-shrink-0 mt-0.5">✗</span>
                  <span className="text-[#4a4a6a] text-sm">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact */}
        <section className="bg-[#534AB7] py-20 px-4 text-center">
          <div className="max-w-xl mx-auto">
            <h2 className="text-2xl font-bold text-white mb-4">{t('contactTitle')}</h2>
            <p className="text-white/80 mb-6">{t('contactDesc')}</p>
            <a
              href={`mailto:${t('contactEmail')}`}
              className="inline-block bg-[#00B894] hover:bg-[#009e7e] active:scale-95 text-white font-bold px-8 py-3 rounded-xl text-base transition-all duration-150"
            >
              {t('contactButton')}
            </a>
            <p className="text-white/60 text-sm mt-4">{t('contactEmail')}</p>
          </div>
        </section>

        <LandingFooter />
      </div>
    </>
  )
}
