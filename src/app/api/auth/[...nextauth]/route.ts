import NextAuth, { type NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { compare } from "bcryptjs"
import prisma from "@/lib/prisma"
import { type NextRequest } from "next/server"

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const user = await prisma.user.findUnique({
          where: { email: credentials?.email },
        })

        if (!user) throw new Error("No user found")

        const isValid = await compare(credentials!.password, user.passwordHash)
        if (!isValid) throw new Error("Invalid password")

        return {
          id: user.id,
          email: user.email,
          role: user.role,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.role = user.role
      return token
    },
    async session({ session, token }) {
      session.user.role = token.role
      return session
    },
  },
  pages: {
    signIn: "/sign-in",
  },
  secret: process.env.NEXTAUTH_SECRET,
}

// Explicit wrapper for compatibility with App Router and Vercel
const handler = NextAuth(authOptions)

export function GET(req: NextRequest, ctx: any) {
  return handler(req, ctx)
}

export function POST(req: NextRequest, ctx: any) {
  return handler(req, ctx)
}
