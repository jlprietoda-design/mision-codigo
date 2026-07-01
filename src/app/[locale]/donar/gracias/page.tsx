import { getTranslations } from 'next-intl/server'
import { LandingNavbar } from '@/components/layout/LandingNavbar'
import { LandingFooter } from '@/components/layout/LandingFooter'
import { Link } from '@/i18n/navigation'
import { createClient } from '@/lib/supabase/server'

interface Props {
  params: Promise<{ locale: string }>
}

export default async function DonarGraciasPage({ params }: Props) {
  await params
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const t = await getTranslations('donarGracias')
  const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? 'donaciones@misioncodigo.com'

  return (
    <>
      <LandingNavbar hasSession={!!user} forceWhite />
      <div className="pt-16 min-h-screen bg-[#F8F9FF] flex flex-col">
        <main className="flex-1 flex items-center justify-center px-4 py-24">
          <div className="max-w-lg w-full text-center">
            {/* Icon */}
            <div className="text-7xl mb-6 animate-bounce">💜</div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-bold text-[#1a1a2e] mb-4 leading-tight">
              {t('title')}
            </h1>

            {/* Subtitle */}
            <p className="text-lg text-[#4a4a6a] leading-relaxed mb-4">
              {t('subtitle')}
            </p>

            {/* Confirmation message */}
            <div className="bg-[#E8F8F5] border border-[#00B894]/30 rounded-2xl p-5 mb-8 text-left">
              <p className="text-[#007a5e] text-sm leading-relaxed">
                {t('message', { contactEmail })}
              </p>
            </div>

            {/* CTA */}
            <Link
              href="/"
              className="inline-block bg-[#534AB7] hover:bg-[#4338ca] active:scale-[0.98] text-white font-bold text-base px-8 py-4 rounded-2xl transition-all duration-200 hover:shadow-[0_4px_16px_rgba(83,74,183,0.3)]"
            >
              {t('backHome')}
            </Link>
          </div>
        </main>

        <LandingFooter />
      </div>
    </>
  )
}
