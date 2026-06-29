import createIntlMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'
import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const handleI18n = createIntlMiddleware(routing)

function getLocaleFromPath(pathname: string): string {
  const match = pathname.match(/^\/(es|en)(?:\/|$)/)
  return match ? match[1] : routing.defaultLocale
}

function isProtected(pathname: string): boolean {
  return /^\/(es|en)\/app\//.test(pathname)
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (isProtected(pathname)) {
    const locale = getLocaleFromPath(pathname)

    // The intl middleware doesn't run for protected routes, so we must set
    // X-NEXT-INTL-LOCALE manually — otherwise getRequestConfig always returns
    // the default locale and useLocale() breaks locale switching.
    const requestHeaders = new Headers(request.headers)
    requestHeaders.set('X-NEXT-INTL-LOCALE', locale)

    let response = NextResponse.next({ request: { headers: requestHeaders } })

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
            response = NextResponse.next({ request: { headers: requestHeaders } })
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options)
            )
          },
        },
      }
    )

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      const loginUrl = new URL(`/${locale}/login`, request.url)
      loginUrl.searchParams.set('next', pathname)
      return NextResponse.redirect(loginUrl)
    }

    return response
  }

  return handleI18n(request)
}

export const config = {
  matcher: ['/((?!_next|_vercel|.*\\..*).*)', '/'],
}
