import { EventType, PublicClientApplication } from '@azure/msal-browser';
import { MsalProvider } from '@azure/msal-react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createRouter, RouterProvider } from '@tanstack/react-router';
import { ThemeProvider } from 'next-themes';
import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { IntlProvider } from 'react-intl';
import { Toaster } from 'sonner';
// Import configurations and contexts
import { msalConfig } from './config/authConfig';
// import { SocketProvider } from './config/SocketConfig.tsx';
import { useLocale } from './hooks/use-locale';
// Import the generated route tree
import { routeTree } from './routeTree.gen';

import './styles.css';

// Import translations
import enText from './lib/translations/en.json';
import esText from './lib/translations/es.json';
import ptText from './lib/translations/pt.json';
import reportWebVitals from './reportWebVitals.ts';

// Create QueryClient instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes (formerly cacheTime)
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Create MSAL instance
const msalInstance = new PublicClientApplication(msalConfig);

// Set active account if available
if (!msalInstance.getActiveAccount() && msalInstance.getAllAccounts().length > 0) {
  msalInstance.setActiveAccount(msalInstance.getAllAccounts()[0]);
}

// Add event callback for login success
msalInstance.addEventCallback((event) => {
  if (event.eventType === EventType.LOGIN_SUCCESS && event.payload && 'account' in event.payload && event.payload.account) {
    msalInstance.setActiveAccount(event.payload.account);
  }
});

// Create a new router instance
const router = createRouter({
  routeTree,
  context: {
    queryClient,
  },
  defaultPreload: 'intent',
  scrollRestoration: true,
  defaultStructuralSharing: true,
  defaultPreloadStaleTime: 0,
});

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

// Available messages by locale
const messages: Record<string, Record<string, string>> = {
  en: enText,
  es: esText,
  pt: ptText,
};

// App component with all providers
function App() {
  // Use Zustand store for locale - this will automatically re-render when locale changes
  const locale = useLocale((state) => state.locale);

  return (
    <MsalProvider instance={msalInstance}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <IntlProvider locale={locale} messages={messages[locale]} defaultLocale="en">
            {/* <SocketProvider> */}
            <RouterProvider router={router} />
            <Toaster position="top-right" expand={false} richColors closeButton />
            {/* </SocketProvider> */}
          </IntlProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </MsalProvider>
  );
}

// Render the app
const rootElement = document.getElementById('app');
if (rootElement && !rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
