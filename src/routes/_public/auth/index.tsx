import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Eye, EyeOff, Loader2, Mail } from "lucide-react";
import { useRef, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { useForm } from "react-hook-form";
import { FormattedMessage, useIntl } from "react-intl";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldLabel } from "@/components/ui/field";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/use-auth";
import { useLogin, useLoginSSO, useVerifyEmail } from "@/hooks/use-auth-api";
import { AuthLayout } from "@/routes/_public/auth/componentes/AuthLayout";
import { SSOButton } from "@/routes/_public/auth/componentes/SSOButton";

// ============================================================================
// Types & Schemas
// ============================================================================

const emailSchema = z.object({
  email: z.string().email("Invalid email address"),
});

const passwordSchema = z.object({
  password: z.string().min(1, "Password is required"),
});

type EmailFormValues = z.infer<typeof emailSchema>;
type PasswordFormValues = z.infer<typeof passwordSchema>;

type LoginStep = "email" | "recaptcha" | "options";

interface LoginOption {
  isPassword?: boolean;
  isSso?: boolean;
  token?: string;
}

const REMEMBER_EMAIL_KEY = "loginRememberEmail";

// ============================================================================
// Route Definition
// ============================================================================

export const Route = createFileRoute("/_public/auth/")({
  component: LoginPage,
});

// ============================================================================
// Step Components
// ============================================================================

interface EmailStepProps {
  email: string;
  onEmailChange: (email: string) => void;
  rememberEmail: boolean;
  onRememberChange: (remember: boolean) => void;
  onSubmit: () => void;
}

function EmailStep({ email, onEmailChange, rememberEmail, onRememberChange, onSubmit }: EmailStepProps) {
  const intl = useIntl();
  const form = useForm<EmailFormValues>({
    resolver: zodResolver(emailSchema),
    defaultValues: { email },
  });

  const handleSubmit = (data: EmailFormValues) => {
    onEmailChange(data.email);
    onSubmit();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-zinc-300 font-medium">
                <FormattedMessage id="login.email" defaultMessage="Email" />
              </FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    {...field}
                    type="email"
                    placeholder={intl.formatMessage({ id: "login.email.placeholder", defaultMessage: "Enter your email" })}
                    className="h-12 bg-white/5 border-white/10 text-white placeholder:text-zinc-500 hover:bg-white/10 hover:border-white/20 focus-visible:border-blue-500 focus-visible:ring-blue-500/30 transition-all duration-200 pr-12"
                    autoFocus
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <Mail className="h-5 w-5 text-zinc-500" />
                  </div>
                </div>
              </FormControl>
              <FormMessage className="text-red-400" />
            </FormItem>
          )}
        />

        <div className="flex items-center space-x-2">
          <Checkbox
            id="remember"
            checked={rememberEmail}
            onCheckedChange={(checked) => onRememberChange(checked === true)}
            className="border-white/30 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
          />
          <Label htmlFor="remember" className="text-sm text-zinc-300 font-normal cursor-pointer">
            <FormattedMessage id="remember.email" defaultMessage="Remember email" />
          </Label>
        </div>

        <Button
          type="submit"
          className="w-full h-12 font-semibold text-base bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-600 shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
          size="lg"
        >
          <FormattedMessage id="next" defaultMessage="Next" />
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </form>
    </Form>
  );
}

interface RecaptchaStepProps {
  email: string;
  recaptchaRef: React.RefObject<ReCAPTCHA>;
  onVerify: (token: string | null) => void;
  onBack: () => void;
  isLoading: boolean;
}

function RecaptchaStep({ email, recaptchaRef, onVerify, onBack, isLoading }: RecaptchaStepProps) {
  return (
    <div className="space-y-5">
      <Field>
        <FieldLabel className="text-zinc-300 font-medium">
          <FormattedMessage id="login.email" defaultMessage="Email" />
        </FieldLabel>
        <Input type="email" value={email} disabled className="h-12 bg-white/5 border-white/10 text-white opacity-60" />
      </Field>

      {isLoading ? (
        <div className="flex justify-center items-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        </div>
      ) : (
        <div className="flex justify-center">
          <ReCAPTCHA ref={recaptchaRef} sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY || ""} onChange={onVerify} theme="dark" />
        </div>
      )}

      <Button type="button" variant="ghost" onClick={onBack} className="w-full text-zinc-400 hover:text-white hover:bg-white/5 transition-colors">
        <ArrowLeft className="mr-2 h-4 w-4" />
        <FormattedMessage id="back" defaultMessage="Back" />
      </Button>
    </div>
  );
}

interface LoginOptionsStepProps {
  email: string;
  loginOptions: LoginOption[];
  showPassword: boolean;
  onTogglePassword: () => void;
  onPasswordLogin: (data: PasswordFormValues) => void;
  onSSOLogin: (data: { token: string; idToken: string }) => void;
  onBack: () => void;
}

function LoginOptionsStep({ loginOptions, showPassword, onTogglePassword, onPasswordLogin, onSSOLogin, onBack }: LoginOptionsStepProps) {
  const intl = useIntl();
  const navigate = useNavigate();

  const hasPassword = loginOptions.some((opt) => opt.isPassword);
  const ssoOption = loginOptions.find((opt) => opt.isSso);

  const form = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { password: "" },
  });

  return (
    <div className="space-y-5">
      {hasPassword && ssoOption && (
        <p className="text-center text-sm text-zinc-400">
          <FormattedMessage id="login.with" defaultMessage="Sign in with" />
        </p>
      )}

      {ssoOption && <SSOButton onSuccess={onSSOLogin} />}

      {hasPassword && ssoOption && (
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-white/10" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-black/40 px-2 text-zinc-500">
              <FormattedMessage id="condition.or" defaultMessage="Or" />
            </span>
          </div>
        </div>
      )}

      {hasPassword && (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onPasswordLogin)} className="space-y-5">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-zinc-300 font-medium">
                    <FormattedMessage id="login.password" defaultMessage="Password" />
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        {...field}
                        type={showPassword ? "text" : "password"}
                        placeholder={intl.formatMessage({ id: "login.password.placeholder", defaultMessage: "Enter your password" })}
                        className="h-12 bg-white/5 border-white/10 text-white placeholder:text-zinc-500 hover:bg-white/10 hover:border-white/20 focus-visible:border-blue-500 focus-visible:ring-blue-500/30 transition-all duration-200 pr-12"
                        autoFocus
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={onTogglePassword}
                        className="absolute right-1 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white hover:bg-transparent transition-colors"
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full h-12 font-semibold text-base bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-600 shadow-lg shadow-green-600/30 hover:shadow-green-600/50 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
              size="lg"
            >
              <FormattedMessage id="login.button-text" defaultMessage="Sign In" />
            </Button>
          </form>
        </Form>
      )}

      <div className="flex items-center justify-between text-sm">
        <Button type="button" variant="ghost" onClick={onBack} className="text-zinc-400 hover:text-white hover:bg-white/5 transition-colors">
          <ArrowLeft className="mr-2 h-4 w-4" />
          <FormattedMessage id="back" defaultMessage="Back" />
        </Button>

        {hasPassword && (
          <Button
            type="button"
            variant="link"
            onClick={() => navigate({ to: "/auth/reset-password" })}
            className="h-auto p-0 text-blue-400 hover:text-blue-300 transition-colors font-medium decoration-transparent hover:no-underline"
          >
            <FormattedMessage id="lost.password" defaultMessage="Forgot password?" />
          </Button>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// Main Component
// ============================================================================

function LoginPage() {
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  const [step, setStep] = useState<LoginStep>("email");
  const [email, setEmail] = useState("");
  const [loginOptions, setLoginOptions] = useState<LoginOption[]>([]);
  const [showPassword, setShowPassword] = useState(false);

  const { rememberEmail, setRememberEmail, isLoading } = useAuth();
  const { mutate: verifyEmail, isPending: isVerifying } = useVerifyEmail();
  const { mutate: login } = useLogin();
  const { mutate: loginSSO } = useLoginSSO();

  // Load remembered email on mount
  useState(() => {
    const saved = localStorage.getItem(REMEMBER_EMAIL_KEY);
    if (saved) {
      setEmail(saved);
      setRememberEmail(true);
    }
  });

  // Save/remove remembered email
  useState(() => {
    if (rememberEmail && email) {
      localStorage.setItem(REMEMBER_EMAIL_KEY, email);
    } else if (!rememberEmail) {
      localStorage.removeItem(REMEMBER_EMAIL_KEY);
    }
  });

  const handleEmailSubmit = () => {
    setStep("recaptcha");
  };

  const handleRecaptchaVerify = (token: string | null) => {
    if (!token) return;

    verifyEmail(
      { email, reCaptcha: token },
      {
        onSuccess: (data) => {
          if (data && data.length > 0) {
            setLoginOptions(data);
            setStep("options");
          } else {
            // No login options available
            setStep("email");
            recaptchaRef.current?.reset();
          }
        },
        onError: () => {
          setStep("email");
          recaptchaRef.current?.reset();
        },
      },
    );
  };

  const handlePasswordLogin = (data: PasswordFormValues) => {
    login({ email, password: data.password });
  };

  const handleSSOLogin = ({ token, idToken }: { token: string; idToken: string }) => {
    loginSSO({ email, token, idToken });
  };

  const handleBackToEmail = () => {
    setStep("email");
    recaptchaRef.current?.reset();
  };

  const renderStep = () => {
    switch (step) {
      case "email":
        return <EmailStep email={email} onEmailChange={setEmail} rememberEmail={rememberEmail} onRememberChange={setRememberEmail} onSubmit={handleEmailSubmit} />;
      case "recaptcha":
        return (
          <RecaptchaStep
            email={email}
            recaptchaRef={recaptchaRef as React.RefObject<ReCAPTCHA>}
            onVerify={handleRecaptchaVerify}
            onBack={handleBackToEmail}
            isLoading={isVerifying}
          />
        );
      case "options":
        return (
          <LoginOptionsStep
            email={email}
            loginOptions={loginOptions}
            showPassword={showPassword}
            onTogglePassword={() => setShowPassword(!showPassword)}
            onPasswordLogin={handlePasswordLogin}
            onSSOLogin={handleSSOLogin}
            onBack={handleBackToEmail}
          />
        );
      default:
        return null;
    }
  };

  return (
    <AuthLayout>
      <Card className="border-0 shadow-2xl bg-black/40 backdrop-blur-xl text-white border-white/10 ring-1 ring-white/20">
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-2xl font-bold tracking-tight text-white">
            <FormattedMessage id="login.title" defaultMessage="Welcome Back" />
          </CardTitle>
          <CardDescription className="text-zinc-400">
            <FormattedMessage id="login.subtitle" defaultMessage="Sign in to your account" />
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pt-2">{renderStep()}</CardContent>
      </Card>

      {isLoading && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Loader2 className="h-12 w-12 animate-spin text-white" />
        </div>
      )}
    </AuthLayout>
  );
}
