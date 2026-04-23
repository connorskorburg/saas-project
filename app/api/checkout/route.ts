import { NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-03-25.dahlia',
})

export async function POST(req: Request) {
  const origin = req.headers.get('origin') || 'http://localhost:3000'

  try {
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Sample Product',
            },
            unit_amount: 2000, // $20.00
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}`,
    })

    return NextResponse.json({ url: session.url })
  } catch (err: any) {
    console.error('Error creating checkout session:', err)
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    )
  }
}
