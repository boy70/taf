import "next-auth"
import { UserRole } from "./user"

declare module "next-auth" {
  interface User {
    id: string
    name?: string | null
    email?: string | null
    image?: string | null
    role?: UserRole
    startupId?: string | null
  }

  interface Session {
    user: User & {
      id: string
      role?: UserRole
      startupId?: string | null
    }
  }
} 