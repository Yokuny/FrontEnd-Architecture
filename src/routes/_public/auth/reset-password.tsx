import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute, useNavigate, useSearch } from "@tanstack/react-router";
import { ArrowLeft, CheckCircle2, Eye, EyeOff, Loader2, Mail, Shield } from "lucide-react";
import { useRef, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { useForm } from "react-hook-form";
import { FormattedMessage, useIntl } from "react-intl";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field } from "@/components/ui/field";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useRequestPasswordReset, useResetPassword } from "@/hooks/use-auth-api";
import { AuthLayout } from "@/routes/_public/auth/componentes/AuthLayout";

// ============================================================================
// Types & Schemas
// ============================================================================

const resetSearchSchema = z.object({
  request: z.string().optional(), // Reset request ID from email link
});

const requestResetSchema = z.object({
  email: z.string().email("Invalid email address"),
  reCaptcha: z.string().min(1, "Please complete the reCAPTCHA"),
});

const resetPasswordSchema = z
  .object({
    code: z.string().min(6, "Code must be at least 6 characters"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[*,@,#,!,?,_,\-,=,+,$]/, "Password must contain at least one special character"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type RequestResetFormValues = z.infer<typeof requestResetSchema>;
type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

type ResetStep = "request" | "reset" | "success";

// ============================================================================
// Route Definition
// ============================================================================

export const Route = createFileRoute("/_public/auth/reset-password")({
  component: ResetPasswordPage,
  validateSearch: resetSearchSchema,
});

// ============================================================================
// Step Components
// ============================================================================

interface RequestStepProps {
  onSuccess: (email: string) => void;
}

function RequestStep({ onSuccess }: RequestStepProps) {
  const intl = useIntl();
  const navigate = useNavigate();
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  const { mutate: requestReset, isPending } = useRequestPasswordReset();

  const form = useForm<RequestResetFormValues>({
    resolver: zodResolver(requestResetSchema),
    defaultValues: {
      email: "",
      reCaptcha: "",
    },
  });

  const handleSubmit = (data: RequestResetFormValues) => {
    requestReset(
      { email: data.email.trim(), reCaptcha: data.reCaptcha },
      {
        onSuccess: () => {
          onSuccess(data.email);
        },
      },
    );
  };

  const handleRecaptchaChange = (token: string | null) => {
    form.setValue("reCaptcha", token || "");
  };

  return (
    <Card className="border-0 shadow-2xl bg-black/40 backdrop-blur-xl text-white border-white/10 ring-1 ring-white/20">
      <CardHeader className="text-center pb-4">
        <CardTitle className="text-2xl font-bold tracking-tight text-white">
          <FormattedMessage id="request.password" defaultMessage="Reset Password" />
        </CardTitle>
        <CardDescription className="text-zinc-400">
          <FormattedMessage id="request.password.instructions" defaultMessage="Enter your email to receive a reset code" />
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
                    <FormattedMessage id="login.email" defaultMessage="Email" />
                  </FormLabel>
                  <FormControl>
                    <Field>
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
                    </Field>
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />

            <div className="flex justify-center">
              <ReCAPTCHA ref={recaptchaRef} sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY || ""} onChange={handleRecaptchaChange} theme="dark" />
            </div>
            {form.formState.errors.reCaptcha && <p className="text-sm text-red-400 text-center">{form.formState.errors.reCaptcha.message}</p>}

            <Button
              type="submit"
              disabled={isPending}
              className="w-full h-12 font-semibold text-base bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-600 shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
              size="lg"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  <FormattedMessage id="sending" defaultMessage="Sending..." />
                </>
              ) : (
                <FormattedMessage id="continue" defaultMessage="Continue" />
              )}
            </Button>
          </form>
        </Form>

        <div className="text-center">
          <Button type="button" variant="ghost" size="sm" onClick={() => navigate({ to: "/auth" })} className="text-sm text-zinc-400 hover:text-white transition-colors gap-2">
            <ArrowLeft className="h-4 w-4" />
            <FormattedMessage id="back.login" defaultMessage="Back to Login" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

interface ResetStepProps {
  requestId: string;
}

function ResetStep({ requestId }: ResetStepProps) {
  const intl = useIntl();
  const navigate = useNavigate();
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { mutate: resetPassword, isPending } = useResetPassword();

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      code: "",
      password: "",
      confirmPassword: "",
    },
  });

  const password = form.watch("password");

  // Password strength indicators
  const passwordStrength = {
    minLength: password.length >= 8,
    hasLowerCase: /[a-z]/.test(password),
    hasUpperCase: /[A-Z]/.test(password),
    hasSpecialChar: /[*,@,#,!,?,_,\-,=,+,$]/.test(password),
  };

  const handleSubmit = (data: ResetPasswordFormValues) => {
    resetPassword({
      request: requestId,
      password: data.password,
      reCaptcha: data.code, // The code is actually the reCAPTCHA in this flow
    });
  };

  const handleRecaptchaChange = (token: string | null) => {
    form.setValue("code", token || "");
  };

  return (
    <Card className="border-0 shadow-2xl bg-black/40 backdrop-blur-xl text-white border-white/10 ring-1 ring-white/20">
      <CardHeader className="text-center pb-4">
        <div className="mx-auto mb-6 bg-gradient-to-br from-blue-500/20 to-blue-500/5 p-4 rounded-2xl w-fit backdrop-blur-sm border border-blue-500/20 shadow-lg shadow-blue-500/10">
          <Shield className="h-12 w-12 text-blue-500" />
        </div>
        <CardTitle className="text-2xl font-bold tracking-tight text-white">
          <FormattedMessage id="new.password" defaultMessage="Set New Password" />
        </CardTitle>
        <CardDescription className="text-zinc-400">
          <FormattedMessage id="new.password.details" defaultMessage="Choose a new password for your account" />
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6 pt-2">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5">
            {/* New Password */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-zinc-300 font-medium">
                    <FormattedMessage id="new.password" defaultMessage="New Password" />
                  </FormLabel>
                  <FormControl>
                    <Field>
                      <div className="relative">
                        <Input
                          {...field}
                          type={showPassword ? "text" : "password"}
                          placeholder={intl.formatMessage({ id: "new.password.placeholder", defaultMessage: "Enter new password" })}
                          className="h-12 bg-white/5 border-white/10 text-white placeholder:text-zinc-500 hover:bg-white/10 hover:border-white/20 focus-visible:border-blue-500 focus-visible:ring-blue-500/30 transition-all duration-200 pr-12"
                          autoFocus
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-1 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white hover:bg-transparent transition-colors"
                        >
                          {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </Button>
                      </div>
                    </Field>
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />

            {/* Password Strength Indicators */}
            {password && (
              <div className="space-y-2 p-4 bg-white/5 rounded-lg border border-white/10">
                <p className="text-sm text-zinc-400 font-medium">
                  <FormattedMessage id="password.requirements" defaultMessage="Password Requirements:" />
                </p>
                <div className="space-y-1">
                  <PasswordRequirement met={passwordStrength.minLength} text={intl.formatMessage({ id: "form.min.length", defaultMessage: "At least 8 characters" })} />
                  <PasswordRequirement met={passwordStrength.hasLowerCase} text={intl.formatMessage({ id: "form.has.lower.case", defaultMessage: "One lowercase letter" })} />
                  <PasswordRequirement met={passwordStrength.hasUpperCase} text={intl.formatMessage({ id: "form.has.upper.case", defaultMessage: "One uppercase letter" })} />
                  <PasswordRequirement
                    met={passwordStrength.hasSpecialChar}
                    text={intl.formatMessage({ id: "form.has.special.char", defaultMessage: "One special character (*@#!?_-=+$)" })}
                  />
                </div>
              </div>
            )}

            {/* Confirm Password */}
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-zinc-300 font-medium">
                    <FormattedMessage id="account.confirm.password" defaultMessage="Confirm Password" />
                  </FormLabel>
                  <FormControl>
                    <Field>
                      <div className="relative">
                        <Input
                          {...field}
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder={intl.formatMessage({ id: "account.confirm.password.placeholder", defaultMessage: "Re-enter password" })}
                          className="h-12 bg-white/5 border-white/10 text-white placeholder:text-zinc-500 hover:bg-white/10 hover:border-white/20 focus-visible:border-blue-500 focus-visible:ring-blue-500/30 transition-all duration-200 pr-12"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-1 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white hover:bg-transparent transition-colors"
                        >
                          {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </Button>
                      </div>
                    </Field>
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />

            {/* reCAPTCHA */}
            <div className="flex justify-center">
              <ReCAPTCHA ref={recaptchaRef} sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY || ""} onChange={handleRecaptchaChange} theme="dark" />
            </div>
            {form.formState.errors.code && <p className="text-sm text-red-400 text-center">{form.formState.errors.code.message}</p>}

            <Button
              type="submit"
              disabled={isPending}
              className="w-full h-12 font-semibold text-base bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-600 shadow-lg shadow-green-600/30 hover:shadow-green-600/50 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
              size="lg"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  <FormattedMessage id="resetting" defaultMessage="Resetting..." />
                </>
              ) : (
                <FormattedMessage id="save" defaultMessage="Reset Password" />
              )}
            </Button>
          </form>
        </Form>

        <div className="text-center">
          <Button type="button" variant="ghost" size="sm" onClick={() => navigate({ to: "/auth" })} className="text-sm text-zinc-400 hover:text-white transition-colors gap-2">
            <ArrowLeft className="h-4 w-4" />
            <FormattedMessage id="back.login" defaultMessage="Back to Login" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function SuccessStep() {
  const navigate = useNavigate();

  return (
    <Card className="border-0 shadow-2xl bg-black/40 backdrop-blur-xl text-white border-white/10 ring-1 ring-white/20">
      <CardContent className="flex flex-col items-center justify-center py-12 space-y-6">
        <div className="bg-gradient-to-br from-green-500/20 to-green-500/5 p-6 rounded-full backdrop-blur-sm border border-green-500/20 shadow-lg shadow-green-500/10">
          <CheckCircle2 className="h-16 w-16 text-green-500" />
        </div>
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-white">
            <FormattedMessage id="email.recover.send" defaultMessage="Check Your Email!" />
          </h2>
          <p className="text-zinc-400">
            <FormattedMessage id="email.send" defaultMessage="We've sent you a password reset code" />
          </p>
        </div>
        <Button
          onClick={() => navigate({ to: "/auth" })}
          className="w-full h-12 font-semibold text-base bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-600 shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
          size="lg"
        >
          <FormattedMessage id="back.login" defaultMessage="Back to Login" />
        </Button>
      </CardContent>
    </Card>
  );
}

function PasswordRequirement({ met, text }: { met: boolean; text: string }) {
  return (
    <div className="flex items-center gap-2 text-sm">
      {met ? <CheckCircle2 className="h-4 w-4 text-green-500" /> : <div className="h-4 w-4 rounded-full border-2 border-zinc-600" />}
      <span className={met ? "text-green-400" : "text-zinc-500"}>{text}</span>
    </div>
  );
}

// ============================================================================
// Main Component
// ============================================================================

function ResetPasswordPage() {
  const search = useSearch({ from: "/_public/auth/reset-password" }) as { request?: string };

  const [step, setStep] = useState<ResetStep>(search.request ? "reset" : "request");
  const [_email, setEmail] = useState("");
  const [requestId, _setRequestId] = useState(search.request || "");

  const renderStep = () => {
    switch (step) {
      case "request":
        return <RequestStep onSuccess={handleRequestSuccess} />;
      case "reset":
        return <ResetStep requestId={requestId} />;
      case "success":
        return <SuccessStep />;
      default:
        return null;
    }
  };

  function handleRequestSuccess(email: string) {
    setEmail(email);
    setStep("success");
  }

  return (
    <AuthLayout>
      <div className="w-full">{renderStep()}</div>
    </AuthLayout>
  );
}
