import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    // If the user is authenticated, allow them to access the page
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
    '/admin/:path*'
  ]
} 