import { Outlet } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';

import { RevealText } from '@/components/gsap/reveal-text';
import { LanguageSwitcher } from '@/components/sidebar/switcher-language';
import { ThemeSwitcher } from '@/components/sidebar/switcher-theme';
import { MorphingText } from '@/components/ui/morphing-text';
import { useIsMobile } from '@/hooks/use-mobile';

/**
 * Shared layout for all authentication pages
 * Features: Split-screen layout with login on left, presentation on right
 * Mobile: Full-width form with simplified header
 */
export function AuthLayout({ children }: { children?: React.ReactNode }) {
  const { t } = useTranslation();
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
        <div className="relative hidden w-1/2 flex-col overflow-hidden bg-linear-to-br from-zinc-950 via-zinc-900 to-zinc-950 lg:flex">
          {/* Background Pattern */}
          <div className="absolute inset-0 z-0">
            <div
              className="absolute inset-0 bg-center bg-cover bg-no-repeat opacity-10"
              style={{
                backgroundImage: `url('https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=1600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0')`,
              }}
            />
            <div className="absolute inset-0 bg-linear-to-t from-zinc-950 via-transparent to-zinc-950/50" />
          </div>

          {/* Title and Subtitle */}
          <div className="relative z-10 px-12 pt-16">
            <MorphingText texts={[t('auth.morphing.think'), t('auth.morphing.work'), t('auth.morphing.achieve')]} className="text-white" />

            <RevealText type="lines" className="mt-4 lg:mt-6" gsapVars={{ filter: 'blur(8px)', duration: 1.5, stagger: 0.15, delay: 0.25 }}>
              <p className="text-center font-medium text-sm text-zinc-400 leading-snug md:text-base lg:text-lg">{t('auth.hero.description')}</p>
            </RevealText>
          </div>

          {/* Animated Images */}
          <div className="perspective-[400px] relative flex flex-1 items-center justify-center overflow-hidden">
            <div className="absolute start-1/2 top-1/2 -z-2 h-96 w-[500px] -translate-x-1/2 -translate-y-1/4 skew-x-12 -skew-y-3 overflow-hidden rounded-lg border border-zinc-700 shadow-2xl">
              <img src="/images/demo/sidebar-1.jpg" alt="Dashboard Sidebar" className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-zinc-900/30" />
            </div>

            <div className="absolute start-[60%] top-[30%] -z-1 h-96 w-[550px] -translate-x-1/2 skew-x-12 -skew-y-3 overflow-hidden rounded-lg border border-zinc-700 shadow-2xl">
              <img src="/images/demo/hero-1.jpg" alt="Dashboard Preview" className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-zinc-900/20" />
            </div>

            {/* Bottom Gradient */}
            <div className="absolute inset-x-0 bottom-0 z-10 h-32 bg-linear-to-t from-zinc-950 to-transparent" />
          </div>
        </div>
      )}
    </div>
  );
}
