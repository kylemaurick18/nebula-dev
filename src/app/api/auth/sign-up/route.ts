import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      firstName,
      lastName,
      email,
      mobileNumber,
      password,
      accountType = "Standard",
      affiliateCode,
    } = body;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 });
    }

    const hashedPassword = await hash(password, 10);

    // Find referrer if affiliate code is provided
    let referredBy = null;
    if (affiliateCode) {
      const referrer = await prisma.user.findUnique({
        where: { affiliateCode },
      });
      if (referrer) {
        referredBy = referrer.id;
      }
    }

    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        mobileNumber,
        passwordHash: hashedPassword,
        accountType,
        status: "Active",
        portfolioBalance: 0,
        allTimeEarnings: 0,
        estimatedYield: 0,
        maxRiskPerDay: 0,
        role: "USER",
        referredBy,
      },
    });

    return NextResponse.json({ message: "User created", user });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
