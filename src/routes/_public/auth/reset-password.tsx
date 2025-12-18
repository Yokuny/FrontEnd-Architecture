import { createFileRoute, useSearch } from "@tanstack/react-router";
import { useState } from "react";
import { AuthLayout } from "@/routes/_public/auth/@components/AuthLayout";
import { RequestStep } from "@/routes/_public/auth/@components/RequestStep";
import { ResetStep } from "@/routes/_public/auth/@components/ResetStep";
import { SuccessStep } from "@/routes/_public/auth/@components/SuccessStep";
import { type ResetStep as ResetStepType, resetSearchSchema } from "@/routes/_public/auth/@interface/reset-password.types";

// ============================================================================
// Route Definition
// ============================================================================

export const Route = createFileRoute("/_public/auth/reset-password")({
  component: ResetPasswordPage,
  validateSearch: resetSearchSchema,
});

// ============================================================================
// Main Component
// ============================================================================

function ResetPasswordPage() {
  const search = useSearch({ from: "/_public/auth/reset-password" }) as { request?: string };

  const [step, setStep] = useState<ResetStepType>(search.request ? "reset" : "request");
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
