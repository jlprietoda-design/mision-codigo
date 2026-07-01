import { stripe } from '@/lib/stripe'
import { createServiceClient } from '@/lib/supabase/service'

// Tell Next.js not to parse the body — Stripe needs the raw bytes for signature verification
export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature') ?? ''
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET ?? ''

  if (!webhookSecret || webhookSecret.startsWith('whsec_...')) {
    // Webhook secret not configured yet — acknowledge silently
    return new Response('Webhook secret not configured', { status: 200 })
  }

  let event: ReturnType<typeof stripe.webhooks.constructEvent>

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err) {
    console.error('[webhook] signature verification failed:', err)
    return new Response('Invalid signature', { status: 400 })
  }

  const supabase = createServiceClient()

  try {
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object
      const amountTotal = session.amount_total ?? 0
      const isMonthly = session.metadata?.isMonthly === 'true'
      const locale = session.metadata?.locale ?? 'es'
      const sessionId = session.id

      await supabase.from('donations').upsert(
        {
          stripe_session_id: sessionId,
          amount: amountTotal,
          currency: session.currency ?? 'eur',
          provider: 'stripe',
          is_recurring: isMonthly,
          locale,
        },
        { onConflict: 'stripe_session_id' },
      )
    }

    if (event.type === 'customer.subscription.created') {
      const subscription = event.data.object
      const sessionId = subscription.metadata?.session_id as string | undefined
      if (sessionId) {
        await supabase
          .from('donations')
          .update({ is_recurring: true })
          .eq('stripe_session_id', sessionId)
      }
    }
  } catch (err) {
    console.error('[webhook] db error:', err)
    // Still return 200 so Stripe doesn't retry
  }

  return new Response('ok', { status: 200 })
}
