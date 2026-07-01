import Stripe from 'stripe'
import { stripe } from '@/lib/stripe'

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      amount: number
      isMonthly: boolean
      locale: string
    }
    console.log('[checkout] body recibido:', body)

    const { amount, isMonthly, locale } = body

    if (!amount || amount < 1 || amount > 10000) {
      console.error('[checkout] importe inválido:', amount)
      return Response.json({ error: 'Importe inválido' }, { status: 400 })
    }

    const amountCents = Math.round(amount * 100)
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000'
    const safeLocale = locale === 'en' ? 'en' : 'es'

    console.log('[checkout] STRIPE_SECRET_KEY presente:', !!process.env.STRIPE_SECRET_KEY)
    console.log('[checkout] creando sesión:', { amountCents, isMonthly, safeLocale, baseUrl })

    const lineItem: Stripe.Checkout.SessionCreateParams.LineItem[] = [
      {
        price_data: {
          currency: 'eur',
          product_data: {
            name: isMonthly ? 'Donación mensual — Misión Código' : 'Donación — Misión Código',
            description: 'Apoyas la educación gratuita para niños y niñas 🚀',
          },
          unit_amount: amountCents,
          ...(isMonthly ? { recurring: { interval: 'month' } } : {}),
        },
        quantity: 1,
      },
    ]

    const session = await stripe.checkout.sessions.create({
      mode: isMonthly ? 'subscription' : 'payment',
      line_items: lineItem,
      success_url: `${baseUrl}/${safeLocale}/donar/gracias?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/${safeLocale}/donar`,
      metadata: { locale: safeLocale, isMonthly: String(isMonthly) },
      locale: safeLocale === 'en' ? 'en' : 'es',
    })

    console.log('[checkout] sesión creada:', session.id, '— url:', session.url)
    return Response.json({ url: session.url })
  } catch (err) {
    console.error('[checkout] error completo:', err)
    if (err instanceof Error) {
      console.error('[checkout] message:', err.message)
      console.error('[checkout] stack:', err.stack)
    }
    return Response.json({ error: 'Error al crear la sesión de pago' }, { status: 500 })
  }
}
