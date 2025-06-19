# Clerk Authentication Setup for ClaimSaver+

## Setup Instructions

### 1. Create a Clerk Account

1. Go to [clerk.com](https://clerk.com)
2. Sign up for a free account
3. Create a new application

### 2. Get Your API Keys

1. In your Clerk dashboard, go to the "API Keys" section
2. Copy your **Publishable Key** and **Secret Key**

### 3. Configure Environment Variables

Update the `.env.local` file with your actual Clerk keys:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_actual_publishable_key_here
CLERK_SECRET_KEY=sk_test_your_actual_secret_key_here

# Clerk URLs
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/
```

### 4. Configure Clerk Dashboard

1. In your Clerk dashboard, go to "User & Authentication" → "Email, Phone, Username"
2. Enable the authentication methods you want (Email, Phone, etc.)
3. Go to "User & Authentication" → "Social Connections" to enable social logins if desired

### 5. Customize Appearance (Optional)

1. In your Clerk dashboard, go to "Appearance"
2. Customize the colors, fonts, and branding to match ClaimSaver+
3. You can use the brand colors: Blue (#2563eb to #1d4ed8)

### 6. Test the Integration

1. Run your development server: `npm run dev`
2. Click the "Sign In" button in the navbar
3. Test the sign-up and sign-in flows

## Features Implemented

- ✅ **Sign In Button**: Opens Clerk's modal for authentication
- ✅ **User Button**: Shows user avatar and dropdown when signed in
- ✅ **Responsive Design**: Works on both desktop and mobile
- ✅ **Dark Mode Support**: Authentication modals support dark mode
- ✅ **Smooth Animations**: Maintains the navbar's beautiful animations

## Next Steps

1. **Protected Routes**: Add middleware to protect specific pages
2. **User Dashboard**: Create a dashboard for authenticated users
3. **Profile Management**: Add user profile pages
4. **Role-based Access**: Implement different user roles (client, attorney, admin)

## Troubleshooting

- Make sure your environment variables are correctly set
- Check that your Clerk application is properly configured
- Ensure you're using the correct API keys for your environment (test/production)
- If you see TypeScript errors, try restarting your development server
