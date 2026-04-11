import NextAuth from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id:      string
      email:   string
      isAdmin: boolean
    }
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    id:      string
    isAdmin: boolean
  }
}