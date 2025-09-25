# Supabase Setup Guide

## 🚀 Quick Start

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for the project to be ready (usually takes 2-3 minutes)
3. Go to **Settings** → **API** to get your credentials

### 2. Environment Variables

Create a `.env.local` file in your project root with these variables:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE=your_service_role_key_here

# NextAuth Configuration
NEXTAUTH_SECRET=your_nextauth_secret_key_here
NEXTAUTH_URL=http://localhost:3000

# Email Configuration (for magic link authentication)
EMAIL_SERVER_HOST=smtp.gmail.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=your_email@gmail.com
EMAIL_SERVER_PASSWORD=your_app_password
EMAIL_FROM=noreply@yourdomain.com

# Development Configuration
ALLOW_DEV_HEADER=true
```

### 3. Database Schema

Run this SQL in your Supabase SQL Editor:

```sql
-- Create cards table
CREATE TABLE cards (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('link', 'image', 'note')),
  title TEXT NOT NULL,
  description TEXT,
  url TEXT,
  image TEXT,
  favicon TEXT,
  domain TEXT,
  tags TEXT[] DEFAULT '{}',
  pinned BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_cards_user_id ON cards(user_id);
CREATE INDEX idx_cards_created_at ON cards(created_at DESC);
CREATE INDEX idx_cards_type ON cards(type);
CREATE INDEX idx_cards_pinned ON cards(pinned);

-- Enable Row Level Security
ALTER TABLE cards ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own cards" ON cards
  FOR SELECT USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert their own cards" ON cards
  FOR INSERT WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can update their own cards" ON cards
  FOR UPDATE USING (auth.uid()::text = user_id);

CREATE POLICY "Users can delete their own cards" ON cards
  FOR DELETE USING (auth.uid()::text = user_id);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_cards_updated_at
  BEFORE UPDATE ON cards
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

### 4. Email Configuration (Optional)

For magic link authentication, you can use:

#### Gmail (Recommended for development)
1. Enable 2-factor authentication on your Gmail account
2. Generate an "App Password" in your Google Account settings
3. Use your Gmail address and the app password in the environment variables

#### Other SMTP Providers
- **SendGrid**: Use their SMTP settings
- **Mailgun**: Use their SMTP settings
- **AWS SES**: Use their SMTP settings

### 5. NextAuth Secret

Generate a secure secret for NextAuth:

```bash
openssl rand -base64 32
```

Or use an online generator: [next-auth.js.org/configuration/options#secret](https://next-auth.js.org/configuration/options#secret)

## 🔧 Development Mode

The app supports a development mode where you can test without setting up email authentication:

1. Set `ALLOW_DEV_HEADER=true` in your `.env.local`
2. The browser extension can use a dev user ID header
3. Cards will be saved to the database but associated with the dev user

## 🚀 Production Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add all environment variables in Vercel dashboard
4. Deploy!

### Other Platforms

Make sure to set all environment variables in your hosting platform:
- Railway
- Netlify
- AWS
- DigitalOcean

## 🔍 Troubleshooting

### Common Issues

1. **"Missing Supabase environment variables"**
   - Check that all Supabase variables are set correctly
   - Make sure there are no extra spaces in the values

2. **"E-mail login requires an adapter"**
   - Make sure `SUPABASE_SERVICE_ROLE` is set
   - Check that the Supabase adapter is properly configured

3. **"Failed to fetch cards"**
   - Check your RLS policies in Supabase
   - Make sure the user is properly authenticated

4. **Magic link not working**
   - Check your email configuration
   - Make sure `NEXTAUTH_URL` is set correctly
   - Check spam folder

### Debug Mode

Set `NODE_ENV=development` to see more detailed error messages.

## 📚 Next Steps

Once Supabase is configured:

1. **Sign up** with your email address
2. **Create cards** using the extension or web interface
3. **Organize** with tags and pinning
4. **Search** and filter your collection

Your data is now persisted in Supabase and will survive app restarts!