import { Outlet } from "@tanstack/react-router";
import { LanguageSwitcher } from "@/components/language-switcher";

/**
 * Shared layout for all authentication pages
 * Features: Background image, logo, language switcher, footer
 */
export function AuthLayout({ children }: { children?: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950">
      {/* Animated Background */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=1600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />
      </div>

      {/* Language Switcher */}
      <div className="absolute top-4 right-4 z-20">
        <LanguageSwitcher />
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-md p-4">{children || <Outlet />}</div>

      {/* Footer */}
      <div className="absolute bottom-4 left-0 right-0 text-center z-10">
        <p className="text-zinc-500 text-xs">
          IoT Log powered by{" "}
          <a href="https://www.bykonz.com?origin=iotlog" target="_blank" rel="noreferrer" className="text-zinc-400 hover:text-white transition-colors">
            Bykonz
          </a>{" "}
          © {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
}
