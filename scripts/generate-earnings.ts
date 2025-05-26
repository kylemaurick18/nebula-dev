import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const user = await prisma.user.findUnique({
    where: { email: 'test@gmail.com' },
  })

  if (!user) {
    console.error('User not found')
    return
  }

  const now = new Date()
  const entries = []

  for (let i = 0; i < 96 * 7; i++) { // 96 per day * 7 days (every 15min)
    const timestamp = new Date(now.getTime() - i * 15 * 60 * 1000)
    const earning = {
      userId: user.id,
      asset: 'BTC',
      orderType: 'Market buy order',
      date: timestamp,
      tradeId: `TRD-${timestamp.getTime()}`,
      commissionFee: parseFloat((Math.random() * 10).toFixed(2)),
      profitLoss: parseFloat(((Math.random() - 0.5) * 100).toFixed(2)), // between -50 and +50
    }
    entries.push(earning)
  }

  const created = await prisma.earning.createMany({
    data: entries,
  })

  console.log(`✅ Created ${created.count} earnings for ${user.email}`)
}

main().finally(() => prisma.$disconnect())
