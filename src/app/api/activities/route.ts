import { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
  if (!token || !token.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const user = await prisma.user.findUnique({
    where: { email: token.email },
    include: {
      activities: {
        orderBy: { date: 'desc' },
      },
    },
  })

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }

  return NextResponse.json(user)
}

export async function POST(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
  if (!token || !token.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const { type, description, date, tradeId, commissionFee, amount } = body

  // Start a transaction to handle both the activity and potential affiliate earnings
  const result = await prisma.$transaction(async (tx) => {
    // Create the activity
    const activity = await tx.activity.create({
      data: {
        userId: token.id as string,
        type,
        description,
        date: new Date(date),
        tradeId,
        commissionFee,
        amount,
      },
    })

    // If this is a deposit, handle affiliate earnings
    if (type === 'deposit') {
      const user = await tx.user.findUnique({
        where: { id: token.id as string },
        include: { referrer: true },
      })

      if (user?.referrer) {
        // Add affiliate earnings to referrer
        await tx.user.update({
          where: { id: user.referrer.id },
          data: {
            affiliateEarnings: {
              increment: 50, // $50 per deposit
            },
          },
        })

        // Create an activity record for the affiliate earnings
        await tx.activity.create({
          data: {
            userId: user.referrer.id,
            type: 'earning',
            description: `Affiliate earnings`,
            date: new Date(),
            amount: 50,
            commissionFee: 0,
          },
        })
      }
    }

    return activity
  })

  return NextResponse.json(result)
}
