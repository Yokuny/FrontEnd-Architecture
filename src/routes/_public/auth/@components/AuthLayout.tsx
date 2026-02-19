import { Outlet } from '@tanstack/react-router';

import { RevealImage } from '@/components/gsap/reveal-text';
import { LanguageSwitcher } from '@/components/sidebar/switch-language';
import { ThemeSwitcher } from '@/components/sidebar/switch-theme';
import { useIsMobile } from '@/hooks/use-mobile';

export function AuthLayout({ children }: { children?: React.ReactNode }) {
  const isMobile = useIsMobile();

  return (
    <div className="flex min-h-screen">
      {/* Left Side - Login Form */}
      <div className="relative flex w-full flex-col items-center justify-center bg-background px-4 py-20 md:p-8 lg:w-1/2">
        {/* Language & Theme Switcher */}
        <div className="absolute top-4 right-4 z-20 flex items-center gap-2 lg:top-6 lg:right-6">
          <ThemeSwitcher />
          <LanguageSwitcher />
        </div>

        {/* Logo */}
        <div className="absolute top-4 left-4 lg:top-6 lg:left-6">
          <img src="/logo192.png" alt="IoT Log" className="h-10 w-10" />
        </div>

        {/* Main Content */}
        <div className="w-full max-w-md">{children || <Outlet />}</div>

        {/* Footer */}
        <div className="absolute right-0 bottom-4 left-0 text-center">
          <p className="text-muted-foreground text-xs">
            IoT Log powered by{' '}
            <a href="https://www.bykonz.com?origin=iotlog" target="_blank" rel="noreferrer" className="text-foreground hover:underline">
              Bykonz
            </a>{' '}
            © {new Date().getFullYear()}
          </p>
        </div>
      </div>

      {/* Right Side - Presentation (only renders on desktop) */}
      {!isMobile && (
        <div className="hidden w-1/2 flex-col overflow-hidden lg:flex">
          <div className="perspective-normal relative flex flex-1 items-center justify-center overflow-hidden">
            <RevealImage
              src="/3.png"
              alt="System Interface 3"
              className="absolute top-[10%] left-[10%] -z-10 w-3xl -translate-y-1/2 skew-x-12 -skew-y-3 rounded-lg transition-transform duration-500 ease-out hover:scale-105"
              gsapVars={{ delay: 0.1, y: 100, rotate: -5 }}
            />

            <RevealImage
              src="/2.png"
              alt="System Interface 2"
              className="absolute right-[15%] bottom-[10%] -z-10 w-3xl -translate-x-1/4 skew-x-8 -skew-y-3 rounded-lg duration-500 hover:scale-105"
              gsapVars={{ delay: 0.2, y: -50, rotate: 5 }}
            />

            <RevealImage
              src="/1.png"
              alt="System Interface 1"
              className="absolute top-[30%] left-[10%] z-0 w-3xl -translate-x-1/2 -translate-y-1/2 skew-x-12 -skew-y-3 rounded-lg shadow-2xl duration-500 hover:scale-[1.02]"
              gsapVars={{ delay: 0, scale: 0.9 }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
