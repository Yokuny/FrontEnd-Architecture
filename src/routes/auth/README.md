# Authentication System

## Overview

This is a modern, optimized authentication system built with TypeScript, React Hook Form, Zod validation, and shadcn/ui components. It replaces the legacy authentication flow with a cleaner, more maintainable implementation.

## Features

### ✨ Key Improvements

1. **Single Component Architecture**: All auth flows consolidated into one file instead of 10+ separate components
2. **Type Safety**: Full TypeScript support with Zod schemas
3. **Modern UI**: Built with Tailwind CSS and shadcn/ui components
4. **Better UX**: Smooth transitions between auth steps
5. **Form Validation**: Real-time validation with react-hook-form
6. **Security**: Integrated reCAPTCHA v3 support
7. **Accessibility**: Proper ARIA labels and keyboard navigation

### 🔐 Authentication Flows

1. **Email Verification** → Checks if email exists and returns available auth methods
2. **Password Login** → Standard email/password authentication
3. **SSO Login** → Microsoft Azure AD integration
4. **Password Reset Request** → Send password reset email
5. **Password Reset** → Create new password with validation
6. **Account Unlock** → Handle temporarily blocked accounts

## Tech Stack

- **React 19** with TypeScript
- **TanStack Router** for routing
- **React Hook Form** for form management
- **Zod** for schema validation
- **shadcn/ui** components (Radix UI + Tailwind)
- **Google reCAPTCHA v3** for bot protection
- **Sonner** for toast notifications
- **Lucide React** for icons

## File Structure

```
src/routes/auth/
├── index.tsx           # Main auth component (all flows)
├── unlock.tsx          # Account unlock page (to be created)
└── README.md           # This file
```

## Usage

### Basic Flow

1. User enters email
2. System verifies email and returns auth options (password, SSO, or both)
3. User authenticates using available method
4. On success, redirect to `/home`

### Password Reset Flow

1. User clicks "Forgot password?"
2. Enters email and completes reCAPTCHA
3. Receives reset link via email
4. Clicks link (with `?request=TOKEN` param)
5. Creates new password with validation
6. Redirects to login

## Environment Variables

Required environment variables (add to `.env`):

```env
VITE_RECAPTCHA_SITE_KEY=your_recaptcha_site_key
VITE_API_URL=your_api_url
```

## API Endpoints

The auth system expects the following API endpoints:

### POST `/api/auth/verifyemail`
**Request:**
```json
{
  "email": "user@example.com",
  "reCaptcha": "recaptcha_token"
}
```

**Response:**
```json
[
  { "isPassword": true, "isSso": false },
  { "isPassword": false, "isSso": true, "token": "sso_config_token" }
]
```

### POST `/api/auth/login`
**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "token": "jwt_token",
  "user": {
    "id": "user_id",
    "name": "User Name",
    "email": "user@example.com",
    "request": "enterprise_id"
  }
}
```

**Error (Blocked Account):**
```json
{
  "isBlockedTemporary": true,
  "id": "unlock_request_id"
}
```

### POST `/api/auth/login/sso`
**Request:**
```json
{
  "email": "user@example.com",
  "token": "access_token",
  "idToken": "id_token"
}
```

**Response:** Same as `/api/auth/login`

### POST `/api/account/request-change-password`
**Request:**
```json
{
  "email": "user@example.com",
  "reCaptcha": "recaptcha_token"
}
```

**Response:**
```json
{
  "success": true
}
```

### POST `/api/account/new-password`
**Request:**
```json
{
  "request": "reset_token",
  "password": "NewPassword123!",
  "reCaptcha": "recaptcha_token"
}
```

**Response:**
```json
{
  "success": true
}
```

## State Management

The component uses local state for:
- Current auth step
- User email
- Available auth options
- Loading states
- Password visibility toggles

### LocalStorage Keys

- `loginRememberEmail` - Stores remembered email address
- `token` - JWT authentication token
- `user` - Serialized user object
- `typelog` - Login type (`"normal"` or `"sso"`)
- `id_enterprise_filter` - Enterprise/organization ID
- `map_show_name` - Map display preference

## Validation Schemas

### Email Schema
```typescript
{
  email: string (valid email),
  rememberEmail: boolean
}
```

### Password Schema
```typescript
{
  password: string (min 1 char)
}
```

### Reset Password Schema
```typescript
{
  password: string (min 8 chars, lowercase, uppercase, special char),
  confirmPassword: string (must match password)
}
```

## Styling

The auth pages use a premium glassmorphism design with:
- Dark gradient background
- Backdrop blur effects
- Smooth animations and transitions
- Responsive layout
- Premium color palette with primary accent
- Micro-interactions on hover/focus

## Migration from Legacy

### Old System (10+ files)
- `Login.jsx` - Main login page
- `NewAccount.jsx` - Registration
- `RequestPassword.jsx` - Password reset request
- `ResetPassword.jsx` - Password reset form
- `SSO.jsx` - SSO login
- `SendCodeUnlock.jsx` - Account unlock
- `CodeUnlock/` - Unlock components
- `AuthLanguage.jsx` - Language selector
- `FooterAuth.jsx` - Footer component
- `ExternalLogin.jsx` - External auth
- `Auth.jsx` - Auth context

### New System (1 file)
- `index.tsx` - All auth flows in one component

### Benefits
- **90% less code** - Single file vs 10+ files
- **Type safe** - Full TypeScript support
- **Modern patterns** - Hooks, composition, validation
- **Better UX** - Smooth transitions, better feedback
- **Maintainable** - Clear structure, easy to extend

## Extending

### Adding a New Auth Step

1. Add step to `AuthStep` type:
```typescript
type AuthStep = "email" | "verify" | "password" | "your-new-step";
```

2. Create step component:
```typescript
function YourNewStep({ onNext, onBack }: StepProps) {
  // Implementation
}
```

3. Add to `renderStep()` switch:
```typescript
case "your-new-step":
  return <YourNewStep onNext={handleNext} onBack={handleBack} />;
```

### Customizing Styles

All styles use Tailwind CSS classes. Key customization points:
- Background gradient: `bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950`
- Card style: `bg-black/40 backdrop-blur-xl`
- Primary color: Uses theme `primary` color
- Animations: Framer Motion for smooth transitions

## Testing

### Manual Testing Checklist

- [ ] Email validation works
- [ ] Remember email persists
- [ ] Password visibility toggle works
- [ ] SSO button appears when available
- [ ] Forgot password flow works
- [ ] Password reset validation works
- [ ] reCAPTCHA loads and verifies
- [ ] Error messages display correctly
- [ ] Success redirects work
- [ ] Blocked account redirects to unlock page
- [ ] Responsive on mobile/tablet/desktop

## Troubleshooting

### reCAPTCHA not loading
- Check `VITE_RECAPTCHA_SITE_KEY` is set
- Verify domain is registered in Google reCAPTCHA console
- Check browser console for errors

### API calls failing
- Verify `VITE_API_URL` is correct
- Check network tab for request/response
- Ensure CORS is configured on backend

### Styles not applying
- Run `npm run dev` to ensure Tailwind is compiling
- Check `tailwind.config.js` includes auth routes
- Verify shadcn components are installed

## Future Enhancements

- [ ] Biometric authentication (WebAuthn)
- [ ] Two-factor authentication (2FA)
- [ ] Social login (Google, GitHub, etc.)
- [ ] Magic link authentication
- [ ] Session management
- [ ] Remember device
- [ ] Login history
- [ ] Security notifications

## Support

For issues or questions, contact the development team or create an issue in the repository.
