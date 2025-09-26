// Test script to verify Resend email configuration
// Run with: node scripts/test-email.js

require('dotenv').config()
const { Resend } = require('resend')

async function testEmail() {
  const resend = new Resend(process.env.RESEND_API_KEY)
  
  if (!process.env.RESEND_API_KEY) {
    console.error('❌ RESEND_API_KEY is not set in environment variables')
    console.log('Please add RESEND_API_KEY to your .env file')
    return
  }

  if (!process.env.EMAIL_FROM) {
    console.error('❌ EMAIL_FROM is not set in environment variables')
    console.log('Please add EMAIL_FROM to your .env file')
    return
  }

  console.log('🧪 Testing Resend email configuration...')
  console.log(`📧 From: ${process.env.EMAIL_FROM}`)
  console.log(`🔑 API Key: ${process.env.RESEND_API_KEY.substring(0, 10)}...`)

  try {
    const result = await resend.emails.send({
      from: process.env.EMAIL_FROM,
      to: ['test@example.com'], // This will fail but we can check the API key
      subject: 'Test Email from BeeKeeper',
      html: '<p>This is a test email to verify Resend configuration.</p>',
    })

    if (result.error) {
      if (result.error.message.includes('Invalid email')) {
        console.log('✅ Resend API key is valid! (Email validation failed as expected)')
        console.log('📝 Note: Make sure to verify your sender domain in Resend dashboard')
      } else {
        console.error('❌ Resend error:', result.error)
      }
    } else {
      console.log('✅ Email sent successfully!')
    }
  } catch (error) {
    console.error('❌ Error testing email:', error.message)
  }
}

testEmail()
