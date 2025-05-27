import { getToken } from 'next-auth/jwt'
import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

function extractUserId(req: NextRequest): string {
  const segments = req.nextUrl.pathname.split('/')
  return segments[segments.indexOf('users') + 1]
}

export async function GET(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
  if (!token || token.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const userId = extractUserId(req)

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { activities: true },
  })

  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

  return NextResponse.json(user)
}

export async function PUT(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
  if (!token || token.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const userId = extractUserId(req)
  const body = await req.json()

  const updated = await prisma.user.update({
    where: { id: userId },
    data: {
      firstName: body.firstName,
      lastName: body.lastName,
      email: body.email,
      mobileNumber: body.mobileNumber,
      portfolioBalance: parseFloat(body.portfolioBalance),
      allTimeEarnings: parseFloat(body.allTimeEarnings),
      estimatedYield: parseFloat(body.estimatedYield),
      maxRiskPerDay: parseFloat(body.maxRiskPerDay),
    },
  })

  return NextResponse.json(updated)
}
