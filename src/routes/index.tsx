import { createFileRoute, redirect } from "@tanstack/react-router";
import { useAuth } from "@/hooks/use-auth";

/**
 * Rota raiz (/)
 * Redireciona para a primeira página apropriada baseado no estado de autenticação
 */
export const Route = createFileRoute("/")({
  beforeLoad: async () => {
    const { isAuthenticated } = useAuth.getState();

    // Se autenticado, vai para área privada, senão vai para login
    throw redirect({
      to: isAuthenticated ? "/components" : "/auth",
    });
  },
});
