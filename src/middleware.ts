import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    const path = req.nextUrl.pathname
    const token = req.nextauth.token

    // If the user is authenticated and trying to access the root path,
    // redirect them to the dashboard
    if (path === '/' && token) {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }

    // Check admin access for admin routes
    if (path.startsWith('/admin')) {
      if (!token) {
        return NextResponse.redirect(new URL('/sign-in', req.url))
      }
      if (token.role !== 'ADMIN') {
        return NextResponse.redirect(new URL('/dashboard', req.url))
      }
    }

    // For all other cases, just continue with the request
    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const path = req.nextUrl.pathname
        // Allow access to root path without authentication
        if (path === '/') return true
        // Require authentication for all other protected routes
        return !!token
      }
    }
  }
)

// Protect all routes under these paths
export const config = {
  matcher: [
    '/',
    '/dashboard/:path*',
    '/deposit/:path*',
    '/withdraw/:path*',
    '/admin/:path*'
  ]
} 