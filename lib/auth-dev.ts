import { NextAuthOptions } from 'next-auth'
import EmailProvider from 'next-auth/providers/email'
import { sendVerificationRequest } from './email-provider'

// Development-only auth configuration that works without Supabase
export const authOptionsDev: NextAuthOptions = {
  providers: [
    EmailProvider({
      server: process.env.RESEND_API_KEY ? {
        host: 'smtp.resend.com',
        port: 587,
        auth: {
          user: 'resend',
          pass: process.env.RESEND_API_KEY,
        },
      } : undefined,
      from: process.env.EMAIL_FROM || 'BeeKeeper <onboarding@resend.dev>',
      sendVerificationRequest,
    }),
  ],
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async session({ session, token }) {
      // JWT strategy - no database required
      if (session.user && token) {
        session.user.id = token.sub || token.id
      }
      return session
    },
    async jwt({ token, user }) {
      // Persist the user id to the token right after signin
      if (user) {
        token.id = user.id
      }
      return token
    },
  },
  debug: true,
  secret: process.env.NEXTAUTH_SECRET || 'fallback-secret-for-development',
  session: {
    strategy: 'jwt',
  },
}
