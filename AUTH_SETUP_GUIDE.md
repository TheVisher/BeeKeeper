# BeeKeeper Authentication Setup Guide

This guide will help you set up the authentication system with Resend email provider for magic link authentication.

## Prerequisites

1. A Resend account (free tier available at [resend.com](https://resend.com))
2. A verified domain or use the default Resend domain for testing

## Step 1: Set up Resend

1. **Create a Resend account**
   - Go to [resend.com](https://resend.com)
   - Sign up for a free account
   - Verify your email address

2. **Get your API key**
   - Go to the [API Keys](https://resend.com/api-keys) page
   - Click "Create API Key"
   - Give it a name like "BeeKeeper Development"
   - Copy the API key (starts with `re_`)

3. **Verify your domain (optional for testing)**
   - Go to [Domains](https://resend.com/domains)
   - Add your domain and follow the DNS verification steps
   - Or use the default `onboarding@resend.dev` for testing

## Step 2: Configure Environment Variables

1. **Copy the example environment file**
   ```bash
   cp env.example .env.local
   ```

2. **Update your `.env.local` file with the following variables:**
   ```env
   # Resend Configuration
   RESEND_API_KEY=re_your_actual_api_key_here
   EMAIL_FROM=BeeKeeper <noreply@yourdomain.com>
   
   # Or for testing with default Resend domain:
   EMAIL_FROM=BeeKeeper <onboarding@resend.dev>
   ```

3. **Make sure you have all required Supabase and NextAuth variables:**
   ```env
   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE=your_supabase_service_role_key
   
   # NextAuth Configuration
   NEXTAUTH_SECRET=your_nextauth_secret_key
   NEXTAUTH_URL=http://localhost:3000
   ```

## Step 3: Test the Configuration

1. **Test the email configuration:**
   ```bash
   node scripts/test-email.js
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```

3. **Test the authentication flow:**
   - Go to `http://localhost:3000/login`
   - Enter your email address
   - Check your email for the magic link
   - Click the link to sign in

## Step 4: Troubleshooting

### Common Issues

1. **"Email service is not configured properly"**
   - Check that `RESEND_API_KEY` is set correctly
   - Verify the API key is valid in your Resend dashboard

2. **"Failed to send magic link"**
   - Check that `EMAIL_FROM` is set correctly
   - Make sure the sender domain is verified in Resend
   - Check the browser console and server logs for detailed error messages

3. **Emails not being received**
   - Check your spam folder
   - Verify the email address is correct
   - Make sure your domain is verified in Resend (if using custom domain)

### Debug Mode

The authentication system includes debug logging. Check your server console for detailed logs when `NODE_ENV=development`.

### Email Templates

The system uses a custom HTML email template. You can customize it in `lib/email-provider.ts` by modifying the `html` and `text` content.

## Features

- ✅ Magic link authentication (no passwords)
- ✅ Custom email templates with BeeKeeper branding
- ✅ Comprehensive error handling
- ✅ Loading states and user feedback
- ✅ Resend email functionality
- ✅ Development-friendly debugging
- ✅ Fallback error messages

## Security Notes

- Never commit your `.env.local` file to version control
- Use strong, unique API keys
- Verify your sender domain to avoid spam filters
- The magic links expire after 24 hours
- Consider rate limiting for production use

## Production Deployment

For production deployment:

1. Set up a verified domain in Resend
2. Update `EMAIL_FROM` to use your verified domain
3. Set `NEXTAUTH_URL` to your production domain
4. Use a strong `NEXTAUTH_SECRET`
5. Consider implementing rate limiting
6. Monitor email delivery rates in Resend dashboard
