import { useMsal } from '@azure/msal-react';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface SSOButtonProps {
  onSuccess: (data: { token: string; idToken: string }) => void;
}

/**
 * Azure AD SSO login button
 * Uses MSAL for popup authentication
 */
export function SSOButton({ onSuccess }: SSOButtonProps) {
  const { instance } = useMsal();
  const [isLoading, setIsLoading] = useState(false);

  const handleSSOLogin = async () => {
    setIsLoading(true);

    try {
      const response = await instance.loginPopup({
        scopes: ['user.read'],
        prompt: 'select_account',
      });

      if (response.accessToken && response.idToken) {
        onSuccess({
          token: response.accessToken,
          idToken: response.idToken,
        });
      }
    } catch {
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      type="button"
      onClick={handleSSOLogin}
      disabled={isLoading}
      className="w-full h-12 font-semibold text-base bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-600 shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
      size="lg"
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          Authenticating...
        </>
      ) : (
        <>
          <svg aria-label="Microsoft" className="mr-2 h-5 w-5" viewBox="0 0 21 21" fill="none">
            <title>Microsoft logo</title>
            <path d="M10.5 0C4.701 0 0 4.701 0 10.5S4.701 21 10.5 21 21 16.299 21 10.5 16.299 0 10.5 0z" fill="#fff" />
            <path d="M15.75 10.5h-4.5v4.5h-1.5v-4.5h-4.5v-1.5h4.5v-4.5h1.5v4.5h4.5v1.5z" fill="#0078D4" />
          </svg>
          Sign in with Microsoft
        </>
      )}
    </Button>
  );
}
