const { PrismaClient } = require('@prisma/client')
const { hash } = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  const hashedPassword = await hash('admin123', 10)
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@nebula.com' },
    update: {},
    create: {
      email: 'admin@nebula.com',
      firstName: 'Admin',
      lastName: 'User',
      mobileNumber: '1234567890',
      passwordHash: hashedPassword,
      accountType: 'Admin',
      status: 'Active',
      portfolioBalance: 0,
      allTimeEarnings: 0,
      estimatedYield: 0,
      maxRiskPerDay: 0,
      role: 'ADMIN',
    },
  })

  console.log({ admin })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 