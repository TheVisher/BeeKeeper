# Development Setup Guide - Fixed Dev User ID

## 🚀 **Quick Setup**

### **1. Create `.env.local` File**

Create a `.env.local` file in your project root with these variables:

```env
# BeeKeeper Development Configuration

# Enable dev header authentication for browser extension
ALLOW_DEV_HEADER=true

# Fixed dev user ID for local development
DEV_USER_ID=00000000-0000-4000-8000-000000000000

# NextAuth Configuration (optional for demo mode)
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=http://localhost:3000

# Supabase Configuration (optional - leave empty for demo mode)
# NEXT_PUBLIC_SUPABASE_URL=
# SUPABASE_SERVICE_ROLE=
# NEXT_PUBLIC_SUPABASE_ANON_KEY=

# Email Configuration (optional - leave empty for demo mode)
# EMAIL_SERVER_HOST=
# EMAIL_SERVER_PORT=
# EMAIL_SERVER_USER=
# EMAIL_SERVER_PASSWORD=
# EMAIL_FROM=
```

### **2. Restart the Application**

After creating the `.env.local` file, restart your BeeKeeper application:

```bash
# Stop the current server (Ctrl+C)
# Then restart:
pnpm dev
```

### **3. Build and Load Extension**

```bash
# Build the extension
cd extension
pnpm build

# Load in Chrome/Edge:
# 1. Go to chrome://extensions/
# 2. Enable Developer Mode
# 3. Click "Load unpacked"
# 4. Select extension/dist folder
```

## 🎯 **How It Works**

### **Fixed Dev User ID System**

1. **Environment Variable**: `DEV_USER_ID=00000000-0000-4000-8000-000000000000`
2. **API Routes**: All routes check for `ALLOW_DEV_HEADER=true`
3. **Extension**: Automatically sends the fixed dev user ID in headers
4. **No Authentication Required**: Works without signing in

### **API Flow**

```typescript
// In all API routes:
const allowDev = process.env.ALLOW_DEV_HEADER === 'true'
const devUserId = process.env.DEV_USER_ID

let userId: string | null = null

if (allowDev) {
  const h = request.headers.get('x-dev-user-id') || devUserId || null
  if (h) userId = h
}

// Fallback to real session if no dev header
if (!userId) {
  const session = await getServerSession(authOptions)
  userId = session?.user?.id ?? null
}
```

### **Extension Integration**

```typescript
// Extension automatically sends:
headers['x-dev-user-id'] = '00000000-0000-4000-8000-000000000000'

// API receives and uses the fixed dev user ID
```

## 🔧 **Testing**

### **Test API Directly**

```bash
curl -X POST http://localhost:3000/api/clip \
  -H "Content-Type: application/json" \
  -H "x-dev-user-id: 00000000-0000-4000-8000-000000000000" \
  -d '{"url":"https://example.com"}'
```

### **Test Extension**

1. **Load the extension** in Chrome/Edge
2. **Right-click** on any webpage
3. **Select "Save to BeeKeeper"**
4. **Fill in the form** and click Save
5. **Card should be created** without authentication

### **Test Web App**

1. **Open** `http://localhost:3000`
2. **Click "Add Card"** button
3. **Enter a URL** and click Create
4. **Card should appear** in the grid

## 🚨 **Troubleshooting**

### **401 Unauthorized Error**

**Cause**: Environment variables not set or app not restarted

**Solution**:
1. **Check `.env.local`** exists with correct values
2. **Restart the app** after adding env vars
3. **Verify** `ALLOW_DEV_HEADER=true`

### **Extension Not Working**

**Cause**: Extension not loaded or API not accessible

**Solution**:
1. **Rebuild extension**: `cd extension && pnpm build`
2. **Reload extension** in Chrome extensions page
3. **Check console** for CORS errors

### **Cards Not Appearing**

**Cause**: Database not configured or dev user ID mismatch

**Solution**:
1. **Check console logs** for "Using dev user ID: ..."
2. **Verify** the same dev user ID is used everywhere
3. **Check Supabase** configuration if using database

## 📱 **User Experience**

### **For Developers**

- ✅ **No authentication required**
- ✅ **Extension works out of the box**
- ✅ **All CRUD operations available**
- ✅ **Consistent dev user ID**

### **For Production**

- ✅ **Real authentication required**
- ✅ **User-specific data isolation**
- ✅ **Secure session management**
- ✅ **No dev bypass in production**

## 🔄 **Switching Modes**

### **Enable Dev Mode**

```env
ALLOW_DEV_HEADER=true
DEV_USER_ID=00000000-0000-4000-8000-000000000000
```

### **Disable Dev Mode**

```env
ALLOW_DEV_HEADER=false
# Remove or comment out DEV_USER_ID
```

### **Production Mode**

```env
# Remove both dev flags
# Configure real Supabase and email settings
```

## 🎉 **Benefits**

1. **Seamless Development**: Extension works without setup
2. **Consistent Testing**: Same dev user ID everywhere
3. **Easy Onboarding**: New developers can start immediately
4. **Production Ready**: Easy to disable for production
5. **Secure**: Dev mode only works locally

The fixed dev user ID system makes development much smoother while maintaining security in production!
