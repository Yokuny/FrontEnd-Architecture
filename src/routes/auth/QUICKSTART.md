# Quick Start Guide - New Auth System

## 🚀 Getting Started

### 1. Environment Setup

Create or update your `.env` file:

```env
# Google reCAPTCHA v3
VITE_RECAPTCHA_SITE_KEY=your_recaptcha_site_key_here

# API Configuration
VITE_API_URL=http://localhost:8080/api
```

### 2. Wrap Your App with ReCaptchaProvider

Update your main app file (e.g., `src/main.tsx` or `src/App.tsx`):

```tsx
import { ReCaptchaProvider } from "@/components/recaptcha-provider";

function App() {
  return (
    <ReCaptchaProvider>
      {/* Your app content */}
      <RouterProvider router={router} />
    </ReCaptchaProvider>
  );
}
```

### 3. Configure Routes

The auth routes are already configured in:
- `/auth` - Main login page
- `/auth/unlock` - Account unlock page

### 4. API Integration

Update your API client to match the expected endpoints. Here's a basic example:

```typescript
// src/lib/api.ts
const API_URL = import.meta.env.VITE_API_URL;

export async function verifyEmail(email: string, reCaptcha: string) {
  const response = await fetch(`${API_URL}/auth/verifyemail`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, reCaptcha }),
  });
  
  if (!response.ok) throw new Error("Failed to verify email");
  return response.json();
}

export async function login(email: string, password: string) {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw error;
  }
  
  return response.json();
}

// Add more API functions as needed...
```

### 5. Test the Flow

1. **Start your dev server:**
   ```bash
   npm run dev
   ```

2. **Navigate to `/auth`**

3. **Test the login flow:**
   - Enter email
   - Complete reCAPTCHA (invisible)
   - Enter password or use SSO
   - Verify redirect to `/home`

4. **Test password reset:**
   - Click "Forgot password?"
   - Enter email
   - Check email for reset link
   - Create new password

5. **Test account unlock:**
   - Trigger account lock (multiple failed attempts)
   - Get redirected to `/auth/unlock`
   - Choose unlock method
   - Enter code
   - Verify account unlocked

## 🎨 Customization

### Change Primary Color

Update your Tailwind config or CSS variables:

```css
/* src/index.css */
@layer base {
  :root {
    --primary: 210 100% 50%; /* HSL values */
  }
}
```

### Modify Background Image

In `src/routes/auth/index.tsx`, update the background URL:

```tsx
style={{
  backgroundImage: `url('your-image-url-here')`,
}}
```

### Add Custom Logo

Replace the placeholder logo in the `EmailStep` component:

```tsx
<div className="h-12 w-12 ...">
  <img src="/your-logo.png" alt="Logo" />
</div>
```

## 🔧 Troubleshooting

### reCAPTCHA Not Loading

**Problem:** reCAPTCHA badge doesn't appear or verification fails.

**Solutions:**
1. Check `VITE_RECAPTCHA_SITE_KEY` is set correctly
2. Verify domain is registered in Google reCAPTCHA console
3. Check browser console for errors
4. Ensure `ReCaptchaProvider` wraps your app

### API Calls Failing

**Problem:** Login or other API calls return errors.

**Solutions:**
1. Verify `VITE_API_URL` is correct
2. Check network tab in browser DevTools
3. Ensure backend CORS is configured
4. Verify API endpoints match expected format

### Styles Not Applying

**Problem:** Components look unstyled or broken.

**Solutions:**
1. Ensure Tailwind CSS is configured correctly
2. Check `tailwind.config.js` includes auth routes
3. Verify shadcn components are installed
4. Run `npm run dev` to rebuild

### TypeScript Errors

**Problem:** Type errors in auth components.

**Solutions:**
1. Run `npm install` to ensure all deps are installed
2. Check `tsconfig.json` is configured correctly
3. Restart TypeScript server in your IDE
4. Run `npm run check` to see all errors

## 📱 Mobile Testing

Test on different screen sizes:

```bash
# Desktop
http://localhost:3000/auth

# Mobile (use Chrome DevTools)
1. Open DevTools (F12)
2. Toggle device toolbar (Ctrl+Shift+M)
3. Select mobile device
4. Test all flows
```

## 🧪 Testing Checklist

- [ ] Email validation works
- [ ] Remember email persists across sessions
- [ ] Password visibility toggle works
- [ ] SSO button appears when available
- [ ] Forgot password flow completes
- [ ] Password reset validation works
- [ ] Account unlock flow works
- [ ] reCAPTCHA verifies successfully
- [ ] Error messages display correctly
- [ ] Success redirects work
- [ ] Mobile responsive
- [ ] Keyboard navigation works
- [ ] Screen reader accessible

## 🚢 Deployment

### Build for Production

```bash
npm run build
```

### Environment Variables

Set these in your production environment:

```env
VITE_RECAPTCHA_SITE_KEY=prod_recaptcha_key
VITE_API_URL=https://api.yourapp.com
```

### Deploy

Deploy the `dist` folder to your hosting provider:

- **Vercel**: `vercel deploy`
- **Netlify**: `netlify deploy --prod`
- **AWS S3**: `aws s3 sync dist/ s3://your-bucket`

## 📚 Additional Resources

- [shadcn/ui Documentation](https://ui.shadcn.com)
- [React Hook Form](https://react-hook-form.com)
- [Zod Documentation](https://zod.dev)
- [TanStack Router](https://tanstack.com/router)
- [Google reCAPTCHA](https://developers.google.com/recaptcha)

## 🆘 Support

If you encounter issues:

1. Check the [README.md](./README.md) for detailed documentation
2. Review the [MIGRATION.md](./MIGRATION.md) for comparison with old system
3. Search existing issues in the repository
4. Create a new issue with:
   - Steps to reproduce
   - Expected behavior
   - Actual behavior
   - Screenshots (if applicable)
   - Browser/OS information

## 🎉 Success!

You're now ready to use the new authentication system. Happy coding! 🚀
