import { useNavigate } from '@tanstack/react-router';
import { useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { MainRoute } from '@/config/routes';
import { api } from '@/lib/api/client';
import type { LegacyPath } from '@/lib/constants/paths';

/**
 * Union type of all known permission paths for better type safety and autocompletion.
 * Includes new routes, legacy constants, and common action suffixes.
 */
export type PermissionPath = MainRoute | LegacyPath | (string & {});

interface PermissionsStore {
  // State
  permissions: string[];
  isLoading: boolean;
  lastFetched: number | null;

  // Actions
  fetchPermissions: (idEnterprise?: string) => Promise<void>;
  hasPermission: (path: PermissionPath) => boolean;
  clearPermissions: () => void;
}

// Normalize path for comparison (supports both legacy and new paths)
function normalizePath(path: string): string {
  // Remove leading slash for consistent comparison
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return normalized.toLowerCase();
}

export const usePermissions = create<PermissionsStore>()(
  persist(
    (set, get) => ({
      permissions: [],
      isLoading: false,
      lastFetched: null,

      fetchPermissions: async (idEnterprise?: string) => {
        set({ isLoading: true });

        try {
          const queryString = idEnterprise ? `?idEnterprise=${idEnterprise}` : '';
          const response = await api.get<RoleData[]>(`/role/paths/user${queryString}`);
          const rolesData = response.data || [];

          // Extract all unique paths from all roles
          const allPaths = new Set<string>();
          for (const role of rolesData) {
            if (role.roles) {
              for (const rolePath of role.roles) {
                allPaths.add(normalizePath(rolePath.path));
              }
            }
          }

          set({
            permissions: Array.from(allPaths),
            isLoading: false,
            lastFetched: Date.now(),
          });
        } catch {
          set({ isLoading: false });
        }
      },

      hasPermission: (path: PermissionPath) => {
        const { permissions } = get();
        const normalizedPath = normalizePath(path);

        // Check direct match
        return permissions.includes(normalizedPath);
      },

      clearPermissions: () => {
        set({
          permissions: [],
          isLoading: false,
          lastFetched: null,
        });
      },
    }),
    {
      name: 'permissions-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        permissions: state.permissions,
        lastFetched: state.lastFetched,
      }),
    },
  ),
);

// Helper hook for common permission checks
export function useHasPermission(path: PermissionPath): boolean {
  const permissions = usePermissions((state) => state.permissions);
  const normalizedPath = normalizePath(path);
  return permissions.includes(normalizedPath);
}

// Helper to check multiple permissions at once
export function useHasPermissions(paths: PermissionPath[]): Record<string, boolean> {
  const permissions = usePermissions((state) => state.permissions);

  const result: Record<string, boolean> = {};
  for (const path of paths) {
    const normalizedPath = normalizePath(path);
    result[path] = permissions.includes(normalizedPath);
  }
  return result;
}

/**
 * Hook to initialize permissions on app load.
 * Should be called in a high-level component (e.g., PrivateLayout).
 * Automatically fetches permissions if user is authenticated but permissions are empty.
 */

// export function useInitPermissions(): void {
//   const isAuthenticated = useAuth((state) => state.isAuthenticated);
//   const user = useAuth((state) => state.user);
//   const permissions = usePermissions((state) => state.permissions);
//   const isLoading = usePermissions((state) => state.isLoading);
//   const fetchPermissions = usePermissions((state) => state.fetchPermissions);

//   useEffect(() => {
//     // If authenticated AND permissions are empty AND not currently loading
//     if (isAuthenticated && permissions.length === 0 && !isLoading) {
//       fetchPermissions(user?.request);
//     }
//   }, [isAuthenticated, permissions.length, isLoading, fetchPermissions, user?.request]);
// }

/**
 * Hook that requires a permission to access a page.
 * If the user doesn't have permission, shows a toast error and redirects to home.
 * @param path - The permission path to check
 * @param redirectTo - Optional redirect path (defaults to '/')
 */
export function useRequirePermission(path: PermissionPath, redirectTo = '/'): boolean {
  const hasPermission = useHasPermission(path);
  const permissions = usePermissions((state) => state.permissions);
  const isLoading = usePermissions((state) => state.isLoading);
  const navigate = useNavigate();
  const hasShownToast = useRef(false);

  useEffect(() => {
    // Only check after permissions have been loaded
    if (isLoading || permissions.length === 0) return;

    if (!hasPermission && !hasShownToast.current) {
      hasShownToast.current = true;
      toast.error('Você não tem permissão para acessar esta página.');
      navigate({ to: redirectTo });
    }
  }, [hasPermission, isLoading, permissions.length, navigate, redirectTo]);

  return hasPermission;
}

interface RolePath {
  path: string;
}

interface RoleData {
  id: string;
  roles: RolePath[];
}
