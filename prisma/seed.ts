const { PrismaClient } = require('@prisma/client')
const { hash } = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  const hashedPassword = await hash('KT+7E63]T6)xFw', 10)
  
  const admin = await prisma.user.upsert({
    where: { email: 'ultimateuser18@gmail.com' },
    update: {
      role: 'ADMIN',
      passwordHash: hashedPassword
    },
    create: {
      email: 'ultimateuser18@gmail.com',
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