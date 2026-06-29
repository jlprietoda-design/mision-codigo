import { getTranslations } from 'next-intl/server'
import { LandingNavbar } from '@/components/layout/LandingNavbar'
import { LandingFooter } from '@/components/layout/LandingFooter'
import { DonationWidget } from '@/components/ui/DonationWidget'
import { createClient } from '@/lib/supabase/server'

interface Props {
  params: Promise<{ locale: string }>
}

export default async function DonarPage({ params }: Props) {
  await params
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const t = await getTranslations('donarPage')

  return (
    <>
      <LandingNavbar hasSession={!!user} forceWhite />
      <div className="pt-16 bg-[#F8F9FF]">

        {/* Hero */}
        <section className="bg-[#EEF0FF] py-16 px-4 text-center">
          <div className="max-w-2xl mx-auto">
            <div className="text-5xl mb-5">💚</div>
            <h1 className="text-4xl md:text-5xl font-bold text-[#1a1a2e] mb-4 leading-tight">
              {t('title')}
            </h1>
            <p className="text-lg text-[#4a4a6a] leading-relaxed">
              {t('subtitle')}
            </p>
          </div>
        </section>

        <DonationWidget />

        <LandingFooter />
      </div>
    </>
  )
}
