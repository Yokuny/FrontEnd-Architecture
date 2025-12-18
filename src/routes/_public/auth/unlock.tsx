import { createFileRoute, useNavigate, useSearch } from "@tanstack/react-router";
import { useState } from "react";
import { useSendUnlockCode, useVerifyUnlockCode } from "@/hooks/use-auth-api";
import { AuthLayout } from "@/routes/_public/auth/@components/AuthLayout";
import { SelectMethodStep } from "@/routes/_public/auth/@components/SelectMethodStep";
import { UnlockSuccessStep } from "@/routes/_public/auth/@components/UnlockSuccessStep";
import { VerifyCodeStep } from "@/routes/_public/auth/@components/VerifyCodeStep";
import { type UnlockCodeFormValues, type UnlockMethodFormValues, type UnlockOption, type UnlockStep, unlockSearchSchema } from "@/routes/_public/auth/@interface/unlock.types";

// ============================================================================
// Route Definition
// ============================================================================

export const Route = createFileRoute("/_public/auth/unlock")({
  component: UnlockPage,
  validateSearch: unlockSearchSchema,
});

// ============================================================================
// Main Component
// ============================================================================

function UnlockPage() {
  const navigate = useNavigate();
  const search = useSearch({ from: "/_public/auth/unlock" }) as { r?: string };

  const [step, setStep] = useState<UnlockStep>("select-method");
  const [unlockOptions] = useState<UnlockOption[]>([
    { type: "email", destination: "u***@example.com" },
    { type: "sms", destination: "+55 ** **** 1234" },
  ]);
  const [selectedMethod, setSelectedMethod] = useState<"email" | "sms">("email");

  const { mutate: sendUnlockCode } = useSendUnlockCode();
  const { mutate: verifyUnlockCode } = useVerifyUnlockCode();

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
        return <UnlockSuccessStep onContinue={() => navigate({ to: "/auth" })} />;
      default:
        return null;
    }
  };

  function handleMethodSelect(data: UnlockMethodFormValues) {
    setSelectedMethod(data.method);

    sendUnlockCode(
      { requestId: String(requestId), method: data.method },
      {
        onSuccess: () => {
          setStep("verify-code");
        },
      },
    );
  }

  function handleCodeVerify(data: UnlockCodeFormValues) {
    verifyUnlockCode(
      { requestId: String(requestId), code: data.code },
      {
        onSuccess: () => {
          setStep("success");
        },
      },
    );
  }

  function handleResendCode() {
    sendUnlockCode({ requestId: String(requestId), method: selectedMethod });
  }

  return (
    <AuthLayout>
      <div className="w-full">{renderStep()}</div>
    </AuthLayout>
  );
}
