import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const isAuth = !!token
    const isAuthPage = req.nextUrl.pathname.startsWith('/sign-in')

    if (isAuthPage) {
      if (isAuth) {
        return NextResponse.redirect(new URL('/dashboard', req.url))
      }
      return null
    }

    if (!isAuth) {
      let from = req.nextUrl.pathname
      if (req.nextUrl.search) {
        from += req.nextUrl.search
      }

      return NextResponse.redirect(
        new URL(`/sign-in?from=${encodeURIComponent(from)}`, req.url)
      )
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token
    },
    pages: {
      signIn: '/sign-in'
    }
  }
)

// Protect all routes under these paths
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/deposit/:path*',
    '/withdraw/:path*',
    '/admin/:path*',
    '/sign-in'
  ]
} 