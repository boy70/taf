import "next-auth"

declare module "next-auth" {
  interface User {
    id: string
    name: string
    email: string
    role: "SUPERADMIN" | "HR" | "EMPLOYEE" | "REGULAR_USER"
    startupId: string | null
  }

  interface Session {
    user: User
  }
} 