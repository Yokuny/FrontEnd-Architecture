import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createRouter, RouterProvider } from '@tanstack/react-router';
import { ThemeProvider } from 'next-themes';
import { StrictMode, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { Toaster } from 'sonner';
import i18n from './config/i18n';
import { useLocale } from './hooks/use-locale';
import { routeTree } from './routeTree.gen';

import './styles.css';

// Create QueryClient instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 10,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
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

// App component with all providers
function App() {
  const locale = useLocale((state) => state.locale);

  useEffect(() => {
    i18n.changeLanguage(locale);
  }, [locale]);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange themes={['light', 'dark', 'ocean-blue', 'sunset']}>
        <RouterProvider router={router} />
        <Toaster position="bottom-left" expand={false} richColors closeButton />
      </ThemeProvider>
    </QueryClientProvider>
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
