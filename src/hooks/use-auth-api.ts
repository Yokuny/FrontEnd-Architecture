/**
 * TanStack Query hooks for authentication API operations
 */

import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { api } from "@/lib/api/client";
import { encryptSSOPayload } from "@/lib/auth/crypto";
import { useAuth } from "./use-auth";

// ============================================================================
// Types
// ============================================================================

interface LoginResponse {
  token: string;
  user?: unknown;
  isBlockedTemporary?: boolean;
  id?: string;
}

interface VerifyEmailResponse {
  isPassword?: boolean;
  isSso?: boolean;
  token?: string;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  reCaptcha: string;
  termsAccepted: boolean;
  language: string;
  enterprise?: string;
}

// ============================================================================
// Verify Email Hook
// ============================================================================

export function useVerifyEmail() {
  return useMutation({
    mutationFn: async ({ email, reCaptcha }: { email: string; reCaptcha: string }) => {
      const response = await api.post<VerifyEmailResponse[]>("/auth/verifyemail", {
        email,
        reCaptcha,
      });
      return response.data || [];
    },
    onError: (error: unknown) => {
      if ((error as { response: { data: { code: string } } }).response?.data?.code) {
        toast.error((error as { response: { data: { code: string } } }).response.data.code);
      }
    },
  });
}

// ============================================================================
// Login Hook (Password)
// ============================================================================

export function useLogin() {
  const { setAuth, setLocked, setLoading } = useAuth();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      setLoading(true);
      const response = await api.post<LoginResponse>("/auth/login", {
        email: email.trim(),
        password,
      });
      return response.data;
    },
    onSuccess: (data) => {
      setLoading(false);

      if (data?.isBlockedTemporary && data?.id) {
        setLocked({ id: data.id, isBlockedTemporary: true });
        navigate({ to: "/auth/unlock", search: { r: data.id } });
        return;
      }

      if (data?.token) {
        setAuth(data.token, "normal");
        toast.success("Login successful!");
        navigate({ to: "/components" });
      }
    },
    onError: () => {
      setLoading(false);
    },
  });
}

// ============================================================================
// Login SSO Hook
// ============================================================================

export function useLoginSSO() {
  const { setAuth, setLocked, setLoading } = useAuth();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async ({ email, token, idToken }: { email: string; token: string; idToken: string }) => {
      setLoading(true);
      const time = Date.now();
      const encryptedPayload = encryptSSOPayload(
        {
          email: email.trim(),
          token,
          idToken,
        },
        time,
      );

      const response = await api.post<LoginResponse>(
        "/auth/login/sso",
        { token: encryptedPayload },
        {
          defaultTakeCareError: true,
          headers: {
            "x-time": time.toString(),
          },
        },
      );
      return response.data;
    },
    onSuccess: (data) => {
      setLoading(false);

      if (data?.isBlockedTemporary && data?.id) {
        setLocked({ id: data.id, isBlockedTemporary: true });
        navigate({ to: "/auth/unlock", search: { r: data.id } });
        return;
      }

      if (data?.token) {
        setAuth(data.token, "sso");
        toast.success("SSO login successful!");
        navigate({ to: "/components" });
      }
    },
    onError: () => {
      setLoading(false);
    },
  });
}

// ============================================================================
// Register Hook
// ============================================================================

export function useRegister() {
  const { setAuth, setLoading } = useAuth();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (data: RegisterData) => {
      setLoading(true);
      const response = await api.post<LoginResponse>("/account/new-portal", data);
      return response.data;
    },
    onSuccess: (data) => {
      setLoading(false);

      if (data?.token) {
        setAuth(data.token, "normal");
        toast.success("Account created successfully!");
        navigate({ to: "/components" });
      }
    },
    onError: () => {
      setLoading(false);
    },
  });
}

// ============================================================================
// Request Password Reset Hook
// ============================================================================

export function useRequestPasswordReset() {
  return useMutation({
    mutationFn: async ({ email, reCaptcha }: { email: string; reCaptcha: string }) => {
      const response = await api.post("/account/request-change-password", {
        email: email.replace(/ /g, ""), // Remove spaces from email
        reCaptcha,
      });
      return response.data;
    },
    onSuccess: () => {
      toast.success("Password reset code sent to your email");
    },
  });
}

// ============================================================================
// Reset Password Hook
// ============================================================================

export function useResetPassword() {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async ({ request, password, reCaptcha }: { request: string; password: string; reCaptcha: string }) => {
      const response = await api.post("/account/new-password", {
        request,
        password,
        reCaptcha,
      });
      return response.data;
    },
    onSuccess: () => {
      toast.success("Password reset successfully!");
      setTimeout(() => {
        navigate({ to: "/auth" });
      }, 1000);
    },
  });
}

// ============================================================================
// Send Unlock Code Hook
// ============================================================================

export function useSendUnlockCode() {
  return useMutation({
    mutationFn: async ({ requestId, method }: { requestId: string; method: "email" | "sms" }) => {
      const response = await api.post("/auth/send-unlock-code", {
        requestId,
        method,
      });
      return response.data;
    },
    onSuccess: (_, variables) => {
      toast.success(`Unlock code sent to your ${variables.method === "email" ? "email" : "phone"}`);
    },
  });
}

// ============================================================================
// Verify Unlock Code Hook
// ============================================================================

export function useVerifyUnlockCode() {
  const { clearLocked } = useAuth();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async ({ requestId, code }: { requestId: string; code: string }) => {
      const response = await api.post("/auth/verify-unlock-code", {
        requestId,
        code,
      });
      return response.data;
    },
    onSuccess: () => {
      clearLocked();
      toast.success("Account unlocked successfully!");
      navigate({ to: "/auth" });
    },
  });
}
