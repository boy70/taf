import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { compare } from "bcryptjs"
import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

import { prisma } from "../lib/db"

export enum UserRole {
  SUPERADMIN = "SUPERADMIN",
  HR = "HR",
  EMPLOYEE = "EMPLOYEE",
  REGULAR_USER = "REGULAR_USER",
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth/login",
    signOut: "/auth/logout",
    error: "/auth/error",
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          console.log("🔐 Auth attempt for email:", credentials?.email)
          
          if (!credentials?.email || !credentials?.password) {
            console.log("❌ Missing credentials")
            return null
          }

          // Test database connection
          try {
            await prisma.$connect()
            console.log("✅ Database connection successful")
          } catch (dbError) {
            console.error("❌ Database connection failed:", dbError)
            throw new Error("Database connection failed")
          }

          const user = await prisma.user.findUnique({
            where: {
              email: credentials.email,
            },
          })

          if (!user) {
            console.log("❌ User not found:", credentials.email)
            return null
          }

          console.log("✅ User found:", user.email)

          const isPasswordValid = await compare(credentials.password, user.password)

          if (!isPasswordValid) {
            console.log("❌ Invalid password for user:", credentials.email)
            return null
          }

          console.log("✅ Authentication successful for:", user.email)

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role as unknown as UserRole,
            startupId: user.startupId,
          }
        } catch (error) {
          console.error("❌ Auth error:", error)
          throw error
        }
      },
    }),
  ],
  callbacks: {
    async session({ token, session }) {
      try {
        if (token) {
          session.user.id = token.id as string
          session.user.name = token.name as string
          session.user.email = token.email as string
          session.user.role = token.role as UserRole | undefined
          session.user.startupId = token.startupId as string | null
        }
        return session
      } catch (error) {
        console.error("❌ Session callback error:", error)
        throw error
      }
    },
    async jwt({ token, user }) {
      try {
        if (user) {
          token.id = user.id
          token.role = user.role
          token.startupId = user.startupId
        }
        return token
      } catch (error) {
        console.error("❌ JWT callback error:", error)
        throw error
      }
    },
  },
  events: {
    async signIn({ user, account, profile, isNewUser }) {
      console.log("✅ Sign in successful:", { user: user.email, isNewUser })
    },
    async signOut({ session, token }) {
      console.log("✅ Sign out successful")
    },
    async createUser({ user }) {
      console.log("✅ User created:", user.email)
    },
  },
  debug: process.env.NODE_ENV === "development",
}

