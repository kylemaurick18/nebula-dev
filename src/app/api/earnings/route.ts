import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.email) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { activities: true },
  })

  if (!user) {
    return new NextResponse('User not found', { status: 404 })
  }

  return NextResponse.json(user)
}
