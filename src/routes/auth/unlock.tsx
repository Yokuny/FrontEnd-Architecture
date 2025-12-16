import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute, useNavigate, useSearch } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, CheckCircle2, Mail, Shield } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

// ============================================================================
// Types & Schemas
// ============================================================================

const unlockSearchSchema = z.object({
  r: z.string().optional(), // Request ID from blocked login attempt
});

const unlockMethodSchema = z.object({
  method: z.enum(["email", "sms"]),
});

const unlockCodeSchema = z.object({
  code: z.string().min(6, "Code must be at least 6 characters").max(10),
});

type UnlockMethodFormValues = z.infer<typeof unlockMethodSchema>;
type UnlockCodeFormValues = z.infer<typeof unlockCodeSchema>;

type UnlockStep = "select-method" | "verify-code" | "success";

interface UnlockOption {
  type: "email" | "sms";
  destination: string; // Masked email or phone
}

// ============================================================================
// Route Definition
// ============================================================================

export const Route = createFileRoute("/auth/unlock")({
  component: UnlockPage,
  validateSearch: unlockSearchSchema,
});

// ============================================================================
// Main Component
// ============================================================================

function UnlockPage() {
  const navigate = useNavigate();
  const search = useSearch({ from: "/auth/unlock" }) as { r?: string };

  const [step, setStep] = useState<UnlockStep>("select-method");
  const [unlockOptions] = useState<UnlockOption[]>([
    { type: "email", destination: "u***@example.com" },
    { type: "sms", destination: "+55 ** **** 1234" },
  ]);
  const [selectedMethod, setSelectedMethod] = useState<"email" | "sms">("email");

  const requestId = search.r;

  // If no request ID, redirect to login
  if (!requestId) {
    navigate({ to: "/auth" });
    return null;
  }

  const renderStep = () => {
    switch (step) {
      case "select-method":
        return <SelectMethodStep options={unlockOptions} onSubmit={handleMethodSelect} onBack={() => navigate({ to: "/auth" })} />;
      case "verify-code":
        return (
          <VerifyCodeStep
            destination={unlockOptions.find((o) => o.type === selectedMethod)?.destination || ""}
            onSubmit={handleCodeVerify}
            onBack={() => setStep("select-method")}
            onResend={handleResendCode}
          />
        );
      case "success":
        return <SuccessStep onContinue={() => navigate({ to: "/auth" })} />;
      default:
        return null;
    }
  };

  async function handleMethodSelect(data: UnlockMethodFormValues) {
    setSelectedMethod(data.method);

    try {
      const response = await fetch("/api/auth/send-unlock-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requestId,
          method: data.method,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send unlock code");
      }

      toast.success(`Unlock code sent to your ${data.method === "email" ? "email" : "phone"}`);
      setStep("verify-code");
    } catch (error) {
      console.error("Send unlock code error:", error);
      toast.error("Failed to send unlock code. Please try again.");
    }
  }

  async function handleCodeVerify(data: UnlockCodeFormValues) {
    try {
      const response = await fetch("/api/auth/verify-unlock-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requestId,
          code: data.code,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Invalid code");
      }

      toast.success("Account unlocked successfully!");
      setStep("success");
    } catch (error) {
      console.error("Verify unlock code error:", error);
      toast.error(error instanceof Error ? error.message : "Invalid code. Please try again.");
    }
  }

  async function handleResendCode() {
    try {
      const response = await fetch("/api/auth/send-unlock-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requestId,
          method: selectedMethod,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to resend code");
      }

      toast.success("Code resent successfully!");
    } catch (error) {
      console.error("Resend code error:", error);
      toast.error("Failed to resend code. Please try again.");
    }
  }

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

interface SelectMethodStepProps {
  options: UnlockOption[];
  onSubmit: (data: UnlockMethodFormValues) => void;
  onBack: () => void;
}

function SelectMethodStep({ options, onSubmit, onBack }: SelectMethodStepProps) {
  const form = useForm<UnlockMethodFormValues>({
    resolver: zodResolver(unlockMethodSchema),
    defaultValues: {
      method: "email",
    },
  });

  return (
    <Card className="border-0 shadow-2xl bg-black/40 backdrop-blur-xl text-white border-white/10 ring-1 ring-white/20">
      <CardHeader className="text-center pb-4">
        <div className="mx-auto mb-6 bg-gradient-to-br from-amber-500/20 to-amber-500/5 p-4 rounded-2xl w-fit backdrop-blur-sm border border-amber-500/20 shadow-lg shadow-amber-500/10">
          <Shield className="h-12 w-12 text-amber-500" />
        </div>
        <CardTitle className="text-2xl font-bold tracking-tight text-white">Account Locked</CardTitle>
        <CardDescription className="text-zinc-400">
          Your account has been temporarily locked due to multiple failed login attempts. Choose a method to unlock your account.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6 pt-2">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="method"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-zinc-300 font-medium">Unlock Method</FormLabel>
                  <FormControl>
                    <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="space-y-3">
                      {options.map((option) => (
                        <div
                          key={option.type}
                          className="flex items-center space-x-3 p-4 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 transition-all cursor-pointer"
                        >
                          <RadioGroupItem value={option.type} id={option.type} className="border-white/30 text-primary" />
                          <label htmlFor={option.type} className="flex-1 cursor-pointer">
                            <div className="flex items-center gap-3">
                              {option.type === "email" ? <Mail className="h-5 w-5 text-zinc-400" /> : <Shield className="h-5 w-5 text-zinc-400" />}
                              <div>
                                <p className="text-white font-medium">{option.type === "email" ? "Email" : "SMS"}</p>
                                <p className="text-zinc-500 text-sm">{option.destination}</p>
                              </div>
                            </div>
                          </label>
                        </div>
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full h-12 font-semibold text-base bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-600 shadow-lg shadow-amber-600/30 hover:shadow-amber-600/50 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
              size="lg"
            >
              Send Unlock Code
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </form>
        </Form>

        <Button variant="ghost" size="sm" onClick={onBack} className="w-full text-zinc-400 hover:text-white hover:bg-white/5 transition-colors">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Login
        </Button>
      </CardContent>
    </Card>
  );
}

interface VerifyCodeStepProps {
  destination: string;
  onSubmit: (data: UnlockCodeFormValues) => void;
  onBack: () => void;
  onResend: () => void;
}

function VerifyCodeStep({ destination, onSubmit, onBack, onResend }: VerifyCodeStepProps) {
  const [resendCooldown, setResendCooldown] = useState(0);

  const form = useForm<UnlockCodeFormValues>({
    resolver: zodResolver(unlockCodeSchema),
    defaultValues: {
      code: "",
    },
  });

  const handleResend = () => {
    onResend();
    setResendCooldown(60);
    const interval = setInterval(() => {
      setResendCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  return (
    <Card className="border-0 shadow-2xl bg-black/40 backdrop-blur-xl text-white border-white/10 ring-1 ring-white/20">
      <CardHeader className="text-center pb-4">
        <div className="mx-auto mb-6 bg-gradient-to-br from-amber-500/20 to-amber-500/5 p-4 rounded-2xl w-fit backdrop-blur-sm border border-amber-500/20 shadow-lg shadow-amber-500/10">
          <Shield className="h-12 w-12 text-amber-500" />
        </div>
        <CardTitle className="text-2xl font-bold tracking-tight text-white">Enter Unlock Code</CardTitle>
        <CardDescription className="text-zinc-400">
          We sent a code to <span className="text-white font-medium">{destination}</span>
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6 pt-2">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-zinc-300 font-medium">Unlock Code</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Enter code"
                      className="h-12 text-center text-2xl tracking-widest bg-white/5 border-white/10 text-white placeholder:text-zinc-500 hover:bg-white/10 hover:border-white/20 focus-visible:border-amber-500 focus-visible:ring-amber-500/30 transition-all duration-200"
                      autoComplete="one-time-code"
                      autoFocus
                      maxLength={10}
                    />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full h-12 font-semibold text-base bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-600 shadow-lg shadow-amber-600/30 hover:shadow-amber-600/50 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
              size="lg"
            >
              Verify Code
            </Button>
          </form>
        </Form>

        <div className="flex items-center justify-between text-sm">
          <Button variant="ghost" size="sm" onClick={onBack} className="text-zinc-400 hover:text-white hover:bg-white/5 transition-colors">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <button
            onClick={handleResend}
            disabled={resendCooldown > 0}
            className="text-amber-500 hover:text-amber-400 transition-colors font-medium disabled:text-zinc-600 disabled:cursor-not-allowed"
          >
            {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend code"}
          </button>
        </div>
      </CardContent>
    </Card>
  );
}

function SuccessStep({ onContinue }: { onContinue: () => void }) {
  return (
    <Card className="border-0 shadow-2xl bg-black/40 backdrop-blur-xl text-white border-white/10 ring-1 ring-white/20">
      <CardContent className="flex flex-col items-center justify-center py-12 space-y-6">
        <div className="bg-gradient-to-br from-green-500/20 to-green-500/5 p-6 rounded-full backdrop-blur-sm border border-green-500/20 shadow-lg shadow-green-500/10">
          <CheckCircle2 className="h-16 w-16 text-green-500" />
        </div>
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-white">Account Unlocked!</h2>
          <p className="text-zinc-400">Your account has been successfully unlocked. You can now log in.</p>
        </div>
        <Button
          onClick={onContinue}
          className="w-full h-12 font-semibold text-base bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-600 shadow-lg shadow-green-600/30 hover:shadow-green-600/50 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
          size="lg"
        >
          Continue to Login
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </CardContent>
    </Card>
  );
}
