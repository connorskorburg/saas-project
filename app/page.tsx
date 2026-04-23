import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

async function checkServices() {
  return {
    supabase: !!(
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    ),
    openai: !!process.env.OPENAI_API_KEY,
    stripe: !!process.env.STRIPE_SECRET_KEY,
    posthog: !!(
      process.env.NEXT_PUBLIC_POSTHOG_PROJECT_ID &&
      process.env.NEXT_PUBLIC_POSTHOG_HOST
    ),
  }
}

export default async function Home() {
  let user = null
  try {
    const supabase = await createClient()
    const { data } = await supabase.auth.getUser()
    user = data.user
  } catch (error) {
    console.error('Error fetching user:', error)
  }

  const services = await checkServices()

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-lg p-8">
          <h1 className="text-4xl font-bold mb-8 text-center">
            AI SaaS MVP Status
          </h1>

          {/* Auth Status */}
          <div className="mb-8 p-4 bg-zinc-100 dark:bg-zinc-800 rounded">
            <h2 className="text-xl font-semibold mb-4">Authentication</h2>
            {user ? (
              <div>
                <p className="mb-2">
                  ✓ Signed in as: <span className="font-mono">{user.email}</span>
                </p>
                <form action="/auth/logout" method="POST">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    Sign Out
                  </button>
                </form>
              </div>
            ) : (
              <div className="space-x-4">
                <Link
                  href="/auth/login"
                  className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Login
                </Link>
                <Link
                  href="/auth/signup"
                  className="inline-block px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Service Status */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Service Status</h2>
            <div className="space-y-3">
              {Object.entries(services).map(([service, status]) => (
                <div
                  key={service}
                  className="flex items-center justify-between p-3 bg-zinc-100 dark:bg-zinc-800 rounded"
                >
                  <span className="font-medium capitalize">{service}</span>
                  <span className={status ? 'text-green-600' : 'text-red-600'}>
                    {status ? '✓ Connected' : '✗ Not configured'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* API Info */}
          <div className="mt-8 pt-8 border-t border-zinc-200 dark:border-zinc-700">
            <h2 className="text-xl font-semibold mb-4">Available APIs</h2>
            <div className="space-y-2 text-sm">
              <p>• <span className="font-mono">POST /api/chat</span> - AI streaming chat endpoint</p>
              <p>• <span className="font-mono">POST /api/checkout</span> - Stripe checkout session</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
