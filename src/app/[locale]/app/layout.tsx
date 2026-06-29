import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { AppNavbar } from '@/components/layout/AppNavbar'

interface Props {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export default async function AppLayout({ children, params }: Props) {
  const { locale } = await params
  const messages = await getMessages()

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <AppNavbar />
      <div className="pt-16">{children}</div>
    </NextIntlClientProvider>
  )
}
