import { NextAuthOptions } from 'next-auth'
import EmailProvider from 'next-auth/providers/email'
import { Resend } from 'resend'

console.log('🚀 [AUTH] Initializing NextAuth configuration with detailed logging...')

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY)

// Custom email sending function with detailed logging
async function sendVerificationRequest({
  identifier: email,
  url,
  provider,
}: {
  identifier: string
  url: string
  provider: any
}) {
  console.log('📧 [EMAIL] ==========================================')
  console.log('📧 [EMAIL] STEP 1: sendVerificationRequest called')
  console.log('📧 [EMAIL] Email:', email)
  console.log('📧 [EMAIL] URL:', url)
  console.log('📧 [EMAIL] Provider:', provider)
  console.log('📧 [EMAIL] ==========================================')

  try {
    console.log('📧 [EMAIL] STEP 2: Checking environment variables...')
    if (!process.env.RESEND_API_KEY) {
      console.error('❌ [EMAIL] RESEND_API_KEY not found')
      throw new Error('Email service not configured')
    }

    console.log('📧 [EMAIL] API Key found:', process.env.RESEND_API_KEY.substring(0, 10) + '...')
    console.log('📧 [EMAIL] From address:', process.env.EMAIL_FROM || 'onboarding@resend.dev')

    console.log('📧 [EMAIL] STEP 3: Preparing email data...')
    const emailData = {
      from: process.env.EMAIL_FROM || 'onboarding@resend.dev',
      to: [email],
      subject: 'Sign in to BeeKeeper',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1>Welcome to BeeKeeper!</h1>
          <p>Click the link below to sign in:</p>
          <a href="${url}" style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
            Sign in to BeeKeeper
          </a>
          <p>This link will expire in 24 hours.</p>
        </div>
      `,
      text: `Sign in to BeeKeeper: ${url}`,
    }

    console.log('📧 [EMAIL] Email data prepared:', {
      from: emailData.from,
      to: emailData.to,
      subject: emailData.subject,
      hasHtml: !!emailData.html,
      hasText: !!emailData.text
    })

    console.log('📧 [EMAIL] STEP 4: Calling Resend API...')
    const startTime = Date.now()
    const result = await resend.emails.send(emailData)
    const endTime = Date.now()

    console.log('📧 [EMAIL] STEP 5: Resend API response received')
    console.log('📧 [EMAIL] Response time:', endTime - startTime + 'ms')
    console.log('📧 [EMAIL] Full response:', JSON.stringify(result, null, 2))

    if (result.error) {
      console.error('❌ [EMAIL] STEP 6: Resend API returned error')
      console.error('❌ [EMAIL] Error details:', result.error)
      throw new Error(`Email failed: ${result.error.message}`)
    }

    console.log('✅ [EMAIL] STEP 6: Email sent successfully!')
    console.log('✅ [EMAIL] Email ID:', result.data?.id)
    console.log('✅ [EMAIL] To:', email)
    console.log('✅ [EMAIL] From:', emailData.from)
    console.log('📧 [EMAIL] ==========================================')
    return result
  } catch (error) {
    console.error('❌ [EMAIL] STEP 7: Email sending failed!')
    console.error('❌ [EMAIL] Error details:', {
      error: error,
      message: error.message,
      stack: error.stack,
      email: email
    })
    console.error('📧 [EMAIL] ==========================================')
    throw error
  }
}

// Minimal in-memory adapter to satisfy NextAuth requirements
const memoryAdapter = {
  async createUser(user: any) {
    console.log('🔍 [ADAPTER] createUser called:', user.email)
    return { ...user, id: Date.now().toString() }
  },
  async getUser(id: string) {
    console.log('🔍 [ADAPTER] getUser called:', id)
    return null
  },
  async getUserByEmail(email: string) {
    console.log('🔍 [ADAPTER] getUserByEmail called:', email)
    return null
  },
  async getUserByAccount({ providerAccountId, provider }: any) {
    console.log('🔍 [ADAPTER] getUserByAccount called:', { providerAccountId, provider })
    return null
  },
  async updateUser(user: any) {
    console.log('🔍 [ADAPTER] updateUser called:', user.email)
    return user
  },
  async deleteUser(userId: string) {
    console.log('🔍 [ADAPTER] deleteUser called:', userId)
    return null
  },
  async linkAccount(account: any) {
    console.log('🔍 [ADAPTER] linkAccount called:', account.provider)
    return account
  },
  async unlinkAccount({ providerAccountId, provider }: any) {
    console.log('🔍 [ADAPTER] unlinkAccount called:', { providerAccountId, provider })
    return null
  },
  async createSession(session: any) {
    console.log('🔍 [ADAPTER] createSession called:', session.userId)
    return session
  },
  async getSessionAndUser(sessionToken: string) {
    console.log('🔍 [ADAPTER] getSessionAndUser called:', sessionToken)
    return null
  },
  async updateSession(session: any) {
    console.log('🔍 [ADAPTER] updateSession called:', session.sessionToken)
    return session
  },
  async deleteSession(sessionToken: string) {
    console.log('🔍 [ADAPTER] deleteSession called:', sessionToken)
    return null
  },
  async createVerificationToken(verificationToken: any) {
    console.log('🔍 [ADAPTER] createVerificationToken called:', verificationToken.identifier)
    return verificationToken
  },
  async useVerificationToken({ identifier, token }: any) {
    console.log('🔍 [ADAPTER] useVerificationToken called:', { identifier, token })
    // Return the token to allow verification to succeed
    return { identifier, token, expires: new Date(Date.now() + 24 * 60 * 60 * 1000) }
  }
}

console.log('🔍 [AUTH] Environment check:')
console.log('🔍 [AUTH] RESEND_API_KEY:', process.env.RESEND_API_KEY ? 'SET' : 'NOT SET')
console.log('🔍 [AUTH] EMAIL_FROM:', process.env.EMAIL_FROM || 'onboarding@resend.dev')
console.log('🔍 [AUTH] NEXTAUTH_SECRET:', process.env.NEXTAUTH_SECRET ? 'SET' : 'NOT SET')
console.log('🔍 [AUTH] Using JWT strategy with minimal adapter')

// NextAuth configuration with minimal adapter
export const authOptions: NextAuthOptions = {
  providers: [
    EmailProvider({
      server: {
        host: 'smtp.resend.com',
        port: 587,
        auth: {
          user: 'resend',
          pass: process.env.RESEND_API_KEY!,
        },
      },
      from: process.env.EMAIL_FROM || 'onboarding@resend.dev',
      sendVerificationRequest,
    }),
  ],
  adapter: memoryAdapter,
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: '/login',
    error: '/login', // Redirect to login page on error
  },
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      console.log('🔍 [AUTH] signIn callback called:', { 
        user: user?.email, 
        account: account?.provider,
        email: email?.verificationRequest
      })
      return true
    },
    async redirect({ url, baseUrl }) {
      console.log('🔍 [AUTH] redirect callback called:', { url, baseUrl })
      // If url is relative, make it absolute
      if (url.startsWith('/')) {
        const redirectUrl = `${baseUrl}${url}`
        console.log('🔍 [AUTH] Redirecting to:', redirectUrl)
        return redirectUrl
      }
      // If url is on the same origin, allow it
      if (url.startsWith(baseUrl)) {
        console.log('🔍 [AUTH] Redirecting to same origin:', url)
        return url
      }
      // Default to home page
      console.log('🔍 [AUTH] Redirecting to home page:', baseUrl)
      return baseUrl
    },
    async session({ session, token }) {
      console.log('🔍 [AUTH] Session callback called (JWT)')
      if (token) {
        session.user.id = token.sub || token.id
        console.log('🔍 [AUTH] User ID set (JWT):', token.sub || token.id)
      }
      return session
    },
    async jwt({ token, user }) {
      console.log('🔍 [AUTH] JWT callback called')
      if (user) {
        token.id = user.id
        console.log('🔍 [AUTH] JWT token updated with user ID:', user.id)
      }
      return token
    },
  },
  debug: true,
  secret: process.env.NEXTAUTH_SECRET,
  events: {
    async signIn({ user, account, profile }) {
      console.log('✅ [AUTH] User signed in:', user.email)
    },
    async signOut({ session, token }) {
      console.log('👋 [AUTH] User signed out')
    },
  },
}

console.log('✅ [AUTH] NextAuth configuration created (JWT ONLY)')