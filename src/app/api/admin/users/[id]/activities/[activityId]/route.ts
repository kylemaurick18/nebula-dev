import { getToken } from 'next-auth/jwt'
import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function DELETE(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
  if (!token || token.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const url = new URL(req.url)
  const pathSegments = url.pathname.split('/')
  const userId = pathSegments[pathSegments.indexOf('users') + 1]
  const activityId = pathSegments[pathSegments.indexOf('activities') + 1]

  // Start a transaction to handle both the activity deletion and balance updates
  const result = await prisma.$transaction(async (tx) => {
    // Get the activity before deleting it
    const activity = await tx.activity.findUnique({
      where: { id: activityId },
    })

    if (!activity) {
      throw new Error('Activity not found')
    }

    // Delete the activity
    await tx.activity.delete({
      where: { id: activityId },
    })

    // Update user's balance and earnings based on activity type
    if (activity.type === 'deposit') {
      await tx.user.update({
        where: { id: userId },
        data: {
          portfolioBalance: {
            decrement: activity.amount,
          },
        },
      })
    } else if (activity.type === 'withdrawal') {
      await tx.user.update({
        where: { id: userId },
        data: {
          portfolioBalance: {
            increment: activity.amount,
          },
        },
      })
    } else if (activity.type === 'earning') {
      await tx.user.update({
        where: { id: userId },
        data: {
          portfolioBalance: {
            decrement: activity.amount,
          },
          allTimeEarnings: {
            decrement: activity.amount,
          },
        },
      })
    }

    return { success: true }
  })

  return NextResponse.json(result)
} 