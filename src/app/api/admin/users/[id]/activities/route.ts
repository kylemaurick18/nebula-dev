import { getToken } from 'next-auth/jwt'
import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function POST(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
  if (!token || token.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const url = new URL(req.url)
  const pathSegments = url.pathname.split('/')
  const userId = pathSegments[pathSegments.indexOf('users') + 1]

  const body = await req.json()

  const activity = await prisma.activity.create({
    data: {
      userId,
      type: body.type,
      description: body.description,
      date: new Date(body.date),
      tradeId: body.tradeId,
      commissionFee: body.commissionFee,
      amount: body.amount,
    },
  })

  return NextResponse.json(activity)
}
