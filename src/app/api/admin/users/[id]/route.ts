import { getToken } from 'next-auth/jwt'
import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
  if (!token || token.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const user = await prisma.user.findUnique({
    where: { id: params.id },
    include: { activities: true },
  })

  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

  return NextResponse.json(user)
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
  if (!token || token.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()

  const updated = await prisma.user.update({
    where: { id: params.id },
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
