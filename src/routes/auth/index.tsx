import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AlertCircle, ArrowLeft, ArrowRight, CheckCircle2, Eye, EyeOff, Loader2, Lock, Mail } from "lucide-react";
import { nanoid } from "nanoid";
import { useEffect, useRef, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { useForm } from "react-hook-form";
import { FormattedMessage, useIntl } from "react-intl";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

// ============================================================================
// Constants & Types
// ============================================================================

const REMEMBER_EMAIL_KEY = "loginRememberEmail";

type AuthStep = "email" | "recaptcha" | "verify" | "password" | "reset-request" | "reset-password";

interface AuthOption {
  isPassword: boolean;
  isSso: boolean;
  token?: string;
}

// ============================================================================
// Validation Schemas
// ============================================================================

const emailSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  rememberEmail: z.boolean(),
});

const passwordSchema = z.object({
  password: z.string().min(1, { message: "Password is required." }),
});

const resetRequestSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
});

const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters." })
      .regex(/[a-z]/, { message: "Password must contain a lowercase letter." })
      .regex(/[A-Z]/, { message: "Password must contain an uppercase letter." })
      .regex(/[*@#!?_\-=+$]/, { message: "Password must contain a special character." }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match.",
    path: ["confirmPassword"],
  });

type EmailFormValues = z.infer<typeof emailSchema>;
type PasswordFormValues = z.infer<typeof passwordSchema>;
type ResetRequestFormValues = z.infer<typeof resetRequestSchema>;
type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

// ============================================================================
// Route Definition
// ============================================================================

export const Route = createFileRoute("/auth/")({
  component: AuthPage,
});

// ============================================================================
// Main Component
// ============================================================================

function AuthPage() {
  const navigate = useNavigate();
  const intl = useIntl();
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  const [step, setStep] = useState<AuthStep>("email");
  const [email, setEmail] = useState("");
  const [reCaptcha, setReCaptcha] = useState("");
  const [authOptions, setAuthOptions] = useState<AuthOption[]>([]);
  const [showPassword, setShowPassword] = useState(false);

  // Reset reCAPTCHA when token is cleared
  useEffect(() => {
    if (!reCaptcha && recaptchaRef?.current) {
      recaptchaRef.current.reset();
    }
  }, [reCaptcha]);

  // Determine which auth methods are available
  const hasSsoAuth = authOptions.find((opt) => opt.isSso);

  // Render the appropriate step
  const renderStep = () => {
    switch (step) {
      case "email":
        return <EmailStep onNext={handleEmailSubmit} />;
      case "recaptcha":
        return <RecaptchaStep email={email} recaptchaRef={recaptchaRef} onVerify={handleRecaptchaVerify} onBack={() => setStep("email")} />;
      case "verify":
        return <VerifyingStep />;
      case "password":
        return (
          <PasswordStep
            email={email}
            showPassword={showPassword}
            onTogglePassword={() => setShowPassword(!showPassword)}
            onBack={() => setStep("email")}
            onSubmit={handlePasswordSubmit}
            onForgotPassword={() => setStep("reset-request")}
            hasSso={!!hasSsoAuth}
            ssoToken={hasSsoAuth?.token}
            onSsoLogin={handleSsoLogin}
          />
        );
      case "reset-request":
        return <ResetRequestStep recaptchaRef={recaptchaRef} onBack={() => setStep("email")} onSubmit={handleResetRequest} />;
      case "reset-password":
        return <ResetPasswordStep recaptchaRef={recaptchaRef} onBack={() => setStep("email")} onSubmit={handleResetPassword} />;
      default:
        return <EmailStep onNext={handleEmailSubmit} />;
    }
  };

  // ============================================================================
  // Handlers
  // ============================================================================

  async function handleEmailSubmit(data: EmailFormValues) {
    setEmail(data.email);

    // Save email preference
    if (data.rememberEmail) {
      localStorage.setItem(REMEMBER_EMAIL_KEY, data.email);
    } else {
      localStorage.removeItem(REMEMBER_EMAIL_KEY);
    }

    // Move to reCAPTCHA step
    setStep("recaptcha");
  }

  async function handleRecaptchaVerify(token: string) {
    setReCaptcha(token);
    setStep("verify");

    try {
      // Verify email and get auth options
      const response = await fetch("/api/auth/verifyemail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, reCaptcha: token }),
      });

      if (!response.ok) {
        throw new Error("Failed to verify email");
      }

      const options: AuthOption[] = await response.json();

      if (options.length > 0) {
        setAuthOptions(options);
        setStep("password");
      } else {
        toast.error(intl.formatMessage({ id: "login.no-auth-methods" }));
        setStep("email");
      }
    } catch (error) {
      console.error("Email verification error:", error);
      toast.error(intl.formatMessage({ id: "login.verify-error" }));
      setStep("email");
      setReCaptcha("");
    }
  }

  async function handlePasswordSubmit(data: PasswordFormValues) {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password: data.password }),
      });

      if (!response.ok) {
        const errorData = await response.json();

        // Check if account is temporarily blocked
        if (errorData.isBlockedTemporary) {
          navigate({ to: "/auth/unlock", search: { r: errorData.id } });
          return;
        }

        throw new Error(errorData.message || "Login failed");
      }

      const { token, user } = await response.json();

      // Store token and user data
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("typelog", "normal");
      localStorage.setItem("map_show_name", "true");

      if (user?.request) {
        localStorage.setItem("id_enterprise_filter", user.request);
      }

      toast.success(intl.formatMessage({ id: "login.success" }));
      navigate({ to: "/" });
    } catch (error) {
      console.error("Login error:", error);
      toast.error(error instanceof Error ? error.message : intl.formatMessage({ id: "login.error" }));
    }
  }

  async function handleSsoLogin(_token: string, _idToken: string) {
    try {
      const response = await fetch("/api/auth/login/sso", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, token: _token, idToken: _idToken }),
      });

      if (!response.ok) {
        const errorData = await response.json();

        if (errorData.isBlockedTemporary) {
          navigate({ to: "/auth/unlock", search: { r: errorData.id } });
          return;
        }

        throw new Error(errorData.message || "SSO login failed");
      }

      const { token: authToken, user } = await response.json();

      localStorage.setItem("token", authToken);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("typelog", "sso");
      localStorage.setItem("map_show_name", "true");
      localStorage.setItem("id_enterprise_filter", user?.request || "");

      toast.success(intl.formatMessage({ id: "login.sso-success" }));
      navigate({ to: "/" });
    } catch (error) {
      console.error("SSO login error:", error);
      toast.error(error instanceof Error ? error.message : intl.formatMessage({ id: "login.sso-error" }));
    }
  }

  async function handleResetRequest(data: ResetRequestFormValues, reCaptchaToken: string) {
    try {
      const response = await fetch("/api/account/request-change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: data.email.trim(), reCaptcha: reCaptchaToken }),
      });

      if (!response.ok) {
        throw new Error("Failed to send reset email");
      }

      toast.success(intl.formatMessage({ id: "email.send" }));
      setStep("email");
    } catch (error) {
      console.error("Reset request error:", error);
      toast.error(intl.formatMessage({ id: "reset.error" }));
    }
  }

  async function handleResetPassword(data: ResetPasswordFormValues, reCaptchaToken: string) {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const requestToken = urlParams.get("request");

      if (!requestToken) {
        toast.error(intl.formatMessage({ id: "change.required" }));
        return;
      }

      const response = await fetch("/api/account/new-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          request: requestToken,
          password: data.password,
          reCaptcha: reCaptchaToken,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to reset password");
      }

      toast.success(intl.formatMessage({ id: "save.successfull" }));
      setTimeout(() => navigate({ to: "/auth" }), 1000);
    } catch (error) {
      console.error("Reset password error:", error);
      toast.error(intl.formatMessage({ id: "reset.password-error" }));
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950">
      {/* Animated Background */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=1600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-md p-4">{renderStep()}</div>

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

// ============================================================================
// Step Components
// ============================================================================

function EmailStep({ onNext }: { onNext: (data: EmailFormValues) => void }) {
  const intl = useIntl();
  const form = useForm<EmailFormValues>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: "",
      rememberEmail: false,
    },
  });

  // Load remembered email
  useEffect(() => {
    const savedEmail = localStorage.getItem(REMEMBER_EMAIL_KEY);
    if (savedEmail) {
      form.setValue("email", savedEmail);
      form.setValue("rememberEmail", true);
    }
  }, [form]);

  return (
    <Card className="border-0 shadow-2xl bg-black/40 backdrop-blur-xl text-white border-white/10 ring-1 ring-white/20">
      <CardHeader className="text-center pb-4">
        <div className="mx-auto mb-6 bg-gradient-to-br from-primary/20 to-primary/5 p-4 rounded-2xl w-fit backdrop-blur-sm border border-primary/20 shadow-lg shadow-primary/10">
          <div className="h-12 w-12 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center font-bold text-2xl text-primary-foreground shadow-lg">
            IO
          </div>
        </div>
        <CardTitle className="text-3xl font-bold tracking-tight text-white bg-gradient-to-r from-white to-zinc-300 bg-clip-text text-transparent">
          <FormattedMessage id="login.welcome" defaultMessage="Welcome Back" />
        </CardTitle>
        <CardDescription className="text-zinc-400 text-base">
          <FormattedMessage id="login.subtitle" defaultMessage="Sign in to your IoT Log account" />
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6 pt-2">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onNext)} className="space-y-5">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-zinc-300 font-medium">
                    <FormattedMessage id="login.email" defaultMessage="Email Address" />
                  </FormLabel>
                  <FormControl>
                    <div className="relative group">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-zinc-500 group-focus-within:text-primary transition-colors duration-200" />
                      <Input
                        {...field}
                        type="email"
                        placeholder={intl.formatMessage({ id: "login.email-placeholder", defaultMessage: "name@example.com" })}
                        className="pl-11 h-12 bg-white/5 border-white/10 text-white placeholder:text-zinc-500 hover:bg-white/10 hover:border-white/20 focus-visible:border-primary focus-visible:ring-primary/30 transition-all duration-200"
                        autoComplete="email"
                        autoFocus
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="rememberEmail"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="border-white/30 data-[state=checked]:bg-primary data-[state=checked]:border-primary data-[state=checked]:text-primary-foreground"
                    />
                  </FormControl>
                  <FormLabel className="font-normal text-sm text-zinc-300 cursor-pointer select-none">
                    <FormattedMessage id="remember.email" defaultMessage="Remember my email" />
                  </FormLabel>
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full h-12 font-semibold text-base bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
              size="lg"
            >
              <FormattedMessage id="next" defaultMessage="Next" />
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </form>
        </Form>
      </CardContent>

      <CardFooter className="flex flex-col gap-3 text-center text-sm pt-2 pb-6">
        <Separator className="bg-white/10" />
        <p className="text-zinc-400 text-sm">
          <FormattedMessage id="login.no-account" defaultMessage="Don't have an account?" />{" "}
          <span className="text-primary font-medium">
            <FormattedMessage id="login.contact-admin" defaultMessage="Contact Admin" />
          </span>
        </p>
      </CardFooter>
    </Card>
  );
}

interface RecaptchaStepProps {
  email: string;
  recaptchaRef: React.RefObject<ReCAPTCHA>;
  onVerify: (token: string) => void;
  onBack: () => void;
}

function RecaptchaStep({ email, recaptchaRef, onVerify, onBack }: RecaptchaStepProps) {
  const intl = useIntl();

  return (
    <Card className="border-0 shadow-2xl bg-black/40 backdrop-blur-xl text-white border-white/10 ring-1 ring-white/20">
      <CardHeader className="text-center pb-4">
        <div className="mx-auto mb-6 bg-gradient-to-br from-primary/20 to-primary/5 p-4 rounded-2xl w-fit backdrop-blur-sm border border-primary/20 shadow-lg shadow-primary/10">
          <div className="h-12 w-12 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center font-bold text-2xl text-primary-foreground shadow-lg">
            IO
          </div>
        </div>
        <CardTitle className="text-2xl font-bold tracking-tight text-white">
          <FormattedMessage id="login.verify-human" defaultMessage="Verify you're human" />
        </CardTitle>
        <CardDescription className="text-zinc-400">{email}</CardDescription>
      </CardHeader>

      <CardContent className="space-y-6 pt-2">
        <div className="flex justify-center">
          <ReCAPTCHA
            ref={recaptchaRef}
            sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY || ""}
            onChange={(value) => value && onVerify(value)}
            theme="dark"
            size="normal"
            key={nanoid(5)}
          />
        </div>

        <Button variant="ghost" size="sm" onClick={onBack} className="w-full text-zinc-400 hover:text-white hover:bg-white/5 transition-colors">
          <ArrowLeft className="mr-2 h-4 w-4" />
          <FormattedMessage id="back" defaultMessage="Back" />
        </Button>
      </CardContent>
    </Card>
  );
}

function VerifyingStep() {
  const intl = useIntl();

  return (
    <Card className="border-0 shadow-2xl bg-black/40 backdrop-blur-xl text-white border-white/10 ring-1 ring-white/20">
      <CardContent className="flex flex-col items-center justify-center py-16 space-y-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="text-zinc-300 text-lg">
          <FormattedMessage id="login.verifying" defaultMessage="Verifying your email..." />
        </p>
      </CardContent>
    </Card>
  );
}

interface PasswordStepProps {
  email: string;
  showPassword: boolean;
  onTogglePassword: () => void;
  onBack: () => void;
  onSubmit: (data: PasswordFormValues) => void;
  onForgotPassword: () => void;
  hasSso: boolean;
  ssoToken?: string;
  onSsoLogin: (token: string, idToken: string) => void;
}

function PasswordStep({ email, showPassword, onTogglePassword, onBack, onSubmit, onForgotPassword, hasSso, ssoToken, onSsoLogin }: PasswordStepProps) {
  const intl = useIntl();
  const form = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      password: "",
    },
  });

  return (
    <Card className="border-0 shadow-2xl bg-black/40 backdrop-blur-xl text-white border-white/10 ring-1 ring-white/20">
      <CardHeader className="text-center pb-4">
        <div className="mx-auto mb-6 bg-gradient-to-br from-primary/20 to-primary/5 p-4 rounded-2xl w-fit backdrop-blur-sm border border-primary/20 shadow-lg shadow-primary/10">
          <div className="h-12 w-12 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center font-bold text-2xl text-primary-foreground shadow-lg">
            IO
          </div>
        </div>
        <CardTitle className="text-2xl font-bold tracking-tight text-white">
          <FormattedMessage id="login.enter-password" defaultMessage="Enter Password" />
        </CardTitle>
        <CardDescription className="text-zinc-400">{email}</CardDescription>
      </CardHeader>

      <CardContent className="space-y-6 pt-2">
        {hasSso && ssoToken && (
          <>
            <SsoLoginButton token={ssoToken} onLogin={onSsoLogin} />
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="bg-white/10" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-black/40 px-2 text-zinc-500">
                  <FormattedMessage id="condition.or" defaultMessage="Or" />
                </span>
              </div>
            </div>
          </>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-zinc-300 font-medium">
                    <FormattedMessage id="login.password" defaultMessage="Password" />
                  </FormLabel>
                  <FormControl>
                    <div className="relative group">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-zinc-500 group-focus-within:text-primary transition-colors duration-200" />
                      <Input
                        {...field}
                        type={showPassword ? "text" : "password"}
                        placeholder={intl.formatMessage({ id: "login.password-placeholder", defaultMessage: "Enter your password" })}
                        className="pl-11 pr-11 h-12 bg-white/5 border-white/10 text-white placeholder:text-zinc-500 hover:bg-white/10 hover:border-white/20 focus-visible:border-primary focus-visible:ring-primary/30 transition-all duration-200"
                        autoComplete="current-password"
                        autoFocus
                      />
                      <button type="button" onClick={onTogglePassword} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors">
                        {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                      </button>
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

        <div className="flex items-center justify-between text-sm">
          <Button variant="ghost" size="sm" onClick={onBack} className="text-zinc-400 hover:text-white hover:bg-white/5 transition-colors">
            <ArrowLeft className="mr-2 h-4 w-4" />
            <FormattedMessage id="back" defaultMessage="Back" />
          </Button>
          <button onClick={onForgotPassword} className="text-primary hover:text-primary/80 transition-colors font-medium">
            <FormattedMessage id="lost.password" defaultMessage="Forgot password?" />
          </button>
        </div>
      </CardContent>
    </Card>
  );
}

function SsoLoginButton({ token, onLogin }: { token: string; onLogin: (token: string, idToken: string) => void }) {
  const [isLoading, setIsLoading] = useState(false);
  const intl = useIntl();

  const handleSsoClick = async () => {
    setIsLoading(true);
    try {
      // Implement Microsoft SSO login logic here
      // This is a placeholder - you'll need to integrate with @azure/msal-react
      toast.info(intl.formatMessage({ id: "login.sso-coming-soon", defaultMessage: "SSO login coming soon" }));
      // When implemented, call: onLogin(accessToken, idToken);
    } catch (_error) {
      toast.error(intl.formatMessage({ id: "login.sso-error", defaultMessage: "SSO login failed" }));
    } finally {
      setIsLoading(false);
    }
  };

  // Avoid unused parameter warnings
  void token;
  void onLogin;

  return (
    <Button
      onClick={handleSsoClick}
      disabled={isLoading}
      variant="outline"
      className="w-full h-12 bg-white/5 border-white/10 text-white hover:bg-white/10 hover:border-white/20 transition-all duration-200"
      size="lg"
    >
      {isLoading ? (
        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
      ) : (
        <svg className="mr-2 h-5 w-5" viewBox="0 0 23 23" fill="none">
          <path d="M11 0H0v11h11V0z" fill="#F25022" />
          <path d="M23 0H12v11h11V0z" fill="#7FBA00" />
          <path d="M11 12H0v11h11V12z" fill="#00A4EF" />
          <path d="M23 12H12v11h11V12z" fill="#FFB900" />
        </svg>
      )}
      <FormattedMessage id="login.sso-microsoft" defaultMessage="Sign in with Microsoft" />
    </Button>
  );
}

interface ResetRequestStepProps {
  recaptchaRef: React.RefObject<ReCAPTCHA>;
  onBack: () => void;
  onSubmit: (data: ResetRequestFormValues, reCaptcha: string) => void;
}

function ResetRequestStep({ recaptchaRef, onBack, onSubmit }: ResetRequestStepProps) {
  const intl = useIntl();
  const [reCaptcha, setReCaptcha] = useState("");

  const form = useForm<ResetRequestFormValues>({
    resolver: zodResolver(resetRequestSchema),
    defaultValues: {
      email: "",
    },
  });

  const handleSubmit = (data: ResetRequestFormValues) => {
    if (!reCaptcha) {
      toast.error(intl.formatMessage({ id: "recaptcha.required", defaultMessage: "Please complete the reCAPTCHA" }));
      return;
    }
    onSubmit(data, reCaptcha);
  };

  return (
    <Card className="border-0 shadow-2xl bg-black/40 backdrop-blur-xl text-white border-white/10 ring-1 ring-white/20">
      <CardHeader className="text-center pb-4">
        <CardTitle className="text-2xl font-bold tracking-tight text-white">
          <FormattedMessage id="request.password" defaultMessage="Reset Password" />
        </CardTitle>
        <CardDescription className="text-zinc-400">
          <FormattedMessage id="request.password.instructions" defaultMessage="Enter your email address and we'll send you a link to reset your password." />
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6 pt-2">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-zinc-300 font-medium">
                    <FormattedMessage id="email" defaultMessage="Email Address" />
                  </FormLabel>
                  <FormControl>
                    <div className="relative group">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-zinc-500 group-focus-within:text-primary transition-colors duration-200" />
                      <Input
                        {...field}
                        type="email"
                        placeholder={intl.formatMessage({ id: "login.email-placeholder", defaultMessage: "name@example.com" })}
                        className="pl-11 h-12 bg-white/5 border-white/10 text-white placeholder:text-zinc-500 hover:bg-white/10 hover:border-white/20 focus-visible:border-primary focus-visible:ring-primary/30 transition-all duration-200"
                        autoComplete="email"
                        autoFocus
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />

            <div className="flex justify-center">
              <ReCAPTCHA ref={recaptchaRef} sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY || ""} onChange={(value) => setReCaptcha(value || "")} theme="dark" size="normal" />
            </div>

            <Button
              type="submit"
              className="w-full h-12 font-semibold text-base bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
              size="lg"
            >
              <FormattedMessage id="continue" defaultMessage="Send Reset Link" />
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </form>
        </Form>

        <Button variant="ghost" size="sm" onClick={onBack} className="w-full text-zinc-400 hover:text-white hover:bg-white/5 transition-colors">
          <ArrowLeft className="mr-2 h-4 w-4" />
          <FormattedMessage id="back.login" defaultMessage="Back to Login" />
        </Button>
      </CardContent>
    </Card>
  );
}

interface ResetPasswordStepProps {
  recaptchaRef: React.RefObject<ReCAPTCHA>;
  onBack: () => void;
  onSubmit: (data: ResetPasswordFormValues, reCaptcha: string) => void;
}

function ResetPasswordStep({ recaptchaRef, onBack, onSubmit }: ResetPasswordStepProps) {
  const intl = useIntl();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [reCaptcha, setReCaptcha] = useState("");

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const password = form.watch("password");

  // Password validation criteria
  const criteria = [
    {
      label: intl.formatMessage({ id: "form.min.length", defaultMessage: "At least 8 characters" }),
      valid: password.length >= 8,
    },
    {
      label: intl.formatMessage({ id: "form.has.lower.case", defaultMessage: "Contains lowercase letter" }),
      valid: /[a-z]/.test(password),
    },
    {
      label: intl.formatMessage({ id: "form.has.upper.case", defaultMessage: "Contains uppercase letter" }),
      valid: /[A-Z]/.test(password),
    },
    {
      label: intl.formatMessage({ id: "form.has.special.char", defaultMessage: "Contains special character" }),
      valid: /[*@#!?_\-=+$]/.test(password),
    },
  ];

  const handleSubmit = (data: ResetPasswordFormValues) => {
    if (!reCaptcha) {
      toast.error(intl.formatMessage({ id: "recaptcha.required", defaultMessage: "Please complete the reCAPTCHA" }));
      return;
    }
    onSubmit(data, reCaptcha);
  };

  return (
    <Card className="border-0 shadow-2xl bg-black/40 backdrop-blur-xl text-white border-white/10 ring-1 ring-white/20">
      <CardHeader className="text-center pb-4">
        <CardTitle className="text-2xl font-bold tracking-tight text-white">
          <FormattedMessage id="new.password" defaultMessage="Create New Password" />
        </CardTitle>
        <CardDescription className="text-zinc-400">
          <FormattedMessage id="new.password.details" defaultMessage="Choose a strong password for your account." />
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6 pt-2">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-zinc-300 font-medium">
                    <FormattedMessage id="new.password" defaultMessage="New Password" />
                  </FormLabel>
                  <FormControl>
                    <div className="relative group">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-zinc-500 group-focus-within:text-primary transition-colors duration-200" />
                      <Input
                        {...field}
                        type={showPassword ? "text" : "password"}
                        placeholder={intl.formatMessage({ id: "new.password", defaultMessage: "Enter new password" })}
                        className="pl-11 pr-11 h-12 bg-white/5 border-white/10 text-white placeholder:text-zinc-500 hover:bg-white/10 hover:border-white/20 focus-visible:border-primary focus-visible:ring-primary/30 transition-all duration-200"
                        autoComplete="new-password"
                        autoFocus
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
                      >
                        {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />

            {/* Password Criteria */}
            {password && (
              <div className="space-y-2 p-3 bg-white/5 rounded-lg border border-white/10">
                {criteria.map((criterion) => (
                  <div key={criterion.label} className="flex items-center gap-2 text-sm">
                    {criterion.valid ? <CheckCircle2 className="size-4 text-green-500 flex-shrink-0" /> : <AlertCircle className="size-4 text-zinc-500 flex-shrink-0" />}
                    <span className={criterion.valid ? "text-green-400" : "text-zinc-400"}>{criterion.label}</span>
                  </div>
                ))}
              </div>
            )}

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-zinc-300 font-medium">
                    <FormattedMessage id="account.confirm.password" defaultMessage="Confirm Password" />
                  </FormLabel>
                  <FormControl>
                    <div className="relative group">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-zinc-500 group-focus-within:text-primary transition-colors duration-200" />
                      <Input
                        {...field}
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder={intl.formatMessage({ id: "account.confirm.password", defaultMessage: "Confirm new password" })}
                        className="pl-11 pr-11 h-12 bg-white/5 border-white/10 text-white placeholder:text-zinc-500 hover:bg-white/10 hover:border-white/20 focus-visible:border-primary focus-visible:ring-primary/30 transition-all duration-200"
                        autoComplete="new-password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
                      >
                        {showConfirmPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />

            <div className="flex justify-center">
              <ReCAPTCHA ref={recaptchaRef} sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY || ""} onChange={(value) => setReCaptcha(value || "")} theme="dark" size="normal" />
            </div>

            <Button
              type="submit"
              className="w-full h-12 font-semibold text-base bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-600 shadow-lg shadow-green-600/30 hover:shadow-green-600/50 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
              size="lg"
            >
              <CheckCircle2 className="mr-2 h-5 w-5" />
              <FormattedMessage id="save" defaultMessage="Reset Password" />
            </Button>
          </form>
        </Form>

        <Button variant="ghost" size="sm" onClick={onBack} className="w-full text-zinc-400 hover:text-white hover:bg-white/5 transition-colors">
          <ArrowLeft className="mr-2 h-4 w-4" />
          <FormattedMessage id="back.login" defaultMessage="Back to Login" />
        </Button>
      </CardContent>
    </Card>
  );
}
