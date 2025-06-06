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

  // Start a transaction to handle both the activity and potential affiliate earnings
  const result = await prisma.$transaction(async (tx) => {
    // Create the activity
    const activity = await tx.activity.create({
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

    // Update user's balance and earnings based on activity type
    if (body.type === 'deposit') {
      await tx.user.update({
        where: { id: userId },
        data: {
          portfolioBalance: {
            increment: body.amount,
          },
        },
      })
    } else if (body.type === 'withdrawal') {
      await tx.user.update({
        where: { id: userId },
        data: {
          portfolioBalance: {
            decrement: body.amount,
          },
        },
      })
    } else if (body.type === 'earning') {
      await tx.user.update({
        where: { id: userId },
        data: {
          portfolioBalance: {
            increment: body.amount,
          },
          allTimeEarnings: {
            increment: body.amount,
          },
        },
      })
    }

    // If this is a deposit, handle affiliate earnings
    if (body.type === 'deposit') {
      const user = await tx.user.findUnique({
        where: { id: userId },
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
            portfolioBalance: {
              increment: 50,
            },
            allTimeEarnings: {
              increment: 50,
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
