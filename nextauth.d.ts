import { type DefaultSession } from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      name: string
      email: string
      emailVerified: boolean
      phoneNumber: string
      phoneNumberVerified: boolean
      role: string
      image?: string
    } & DefaultSession['user']
  }
}
