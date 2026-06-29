import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'

export async function LandingFooter() {
  const t = await getTranslations('footer')

  return (
    <footer className="border-t border-[#E0E0F0] py-14 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-start justify-between gap-10 mb-10">
          <div className="max-w-xs">
            <div className="flex items-center gap-2 font-bold text-[#1a1a2e] text-xl mb-3">
              <span className="text-2xl">🤖</span>
              <span>Misión Código</span>
            </div>
            <p className="text-[#4a4a6a] text-sm leading-relaxed">
              {t('tagline')}
            </p>
          </div>

          <div className="flex gap-14 text-sm flex-shrink-0">
            <div className="flex flex-col gap-3">
              <p className="text-[#1a1a2e] text-xs font-semibold uppercase tracking-wider mb-1">
                {t('platformHeading')}
              </p>
              <Link href="/como-funciona" className="text-[#4a4a6a] hover:text-[#534AB7] transition-colors">{t('howItWorks')}</Link>
              <Link href="/niveles" className="text-[#4a4a6a] hover:text-[#534AB7] transition-colors">{t('levels')}</Link>
              <Link href="/registro" className="text-[#4a4a6a] hover:text-[#534AB7] transition-colors">{t('startFree')}</Link>
            </div>
            <div className="flex flex-col gap-3">
              <p className="text-[#1a1a2e] text-xs font-semibold uppercase tracking-wider mb-1">
                {t('communityHeading')}
              </p>
              <Link href="/familias" className="text-[#4a4a6a] hover:text-[#534AB7] transition-colors">{t('forFamilies')}</Link>
              <Link href="/seguridad" className="text-[#4a4a6a] hover:text-[#534AB7] transition-colors">{t('security')}</Link>
              <Link href="/donar" className="text-[#4a4a6a] hover:text-[#534AB7] transition-colors">{t('donate')}</Link>
            </div>
          </div>
        </div>

        <div className="border-t border-[#E0E0F0] pt-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[#4a4a6a] text-sm">
            {t('madeWith')}
          </p>
          <Link href="/login" className="text-[#534AB7] hover:text-[#4338ca] text-sm transition-colors font-medium">
            {t('signIn')}
          </Link>
        </div>
      </div>
    </footer>
  )
}
