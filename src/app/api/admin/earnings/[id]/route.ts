import { getToken } from 'next-auth/jwt'
import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

import { NextRequest } from 'next/server'

export async function DELETE(req: NextRequest, context: any) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })

  if (!token || token.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = context.params

  await prisma.activity.delete({
    where: { id },
  })

  return NextResponse.json({ success: true })
}
