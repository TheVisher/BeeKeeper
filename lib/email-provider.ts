import { Resend } from 'resend'

// Initialize Resend only if API key is available
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

export async function sendVerificationRequest({
  identifier: email,
  url,
  provider,
}: {
  identifier: string
  url: string
  provider: any
}) {
  try {
    console.log(`Sending verification email to: ${email}`)
    
    if (!process.env.RESEND_API_KEY || !resend) {
      console.error('RESEND_API_KEY is not configured')
      throw new Error('Email service is not configured. Please contact support.')
    }

    const result = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'BeeKeeper <onboarding@resend.dev>',
      to: [email],
      subject: 'Sign in to BeeKeeper',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #333; text-align: center;">Welcome to BeeKeeper</h1>
          <p style="color: #666; font-size: 16px;">Click the button below to sign in to your account:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${url}" style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
              Sign In to BeeKeeper
            </a>
          </div>
          <p style="color: #999; font-size: 14px; text-align: center;">
            If the button doesn't work, copy and paste this link into your browser:<br>
            <a href="${url}" style="color: #007bff;">${url}</a>
          </p>
          <p style="color: #999; font-size: 12px; text-align: center; margin-top: 30px;">
            This link will expire in 24 hours. If you didn't request this email, you can safely ignore it.
          </p>
        </div>
      `,
      text: `Sign in to BeeKeeper\n\nClick this link to sign in: ${url}\n\nThis link will expire in 24 hours.`,
    })

    if (result.error) {
      console.error('Resend error:', result.error)
      throw new Error(`Failed to send email: ${result.error.message}`)
    }

    console.log('Email sent successfully:', result.data?.id)
    return result.data
  } catch (error) {
    console.error('Error sending verification email:', error)
    throw new Error('Failed to send verification email. Please try again.')
  }
}
