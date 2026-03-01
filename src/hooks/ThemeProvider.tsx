import { ThemeProvider as NextThemesProvider, type ThemeProviderProps } from 'next-themes';
import { useEffect, useState } from 'react';

function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div style={{ visibility: 'hidden' }}>{children}</div>;
  }

  return (
    <NextThemesProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange {...props}>
      {children}
    </NextThemesProvider>
  );
}

export default ThemeProvider;
