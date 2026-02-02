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
  return usePermissions((state) => state.hasPermission(path));
}

// Helper to check multiple permissions at once
export function useHasPermissions(paths: PermissionPath[]): Record<string, boolean> {
  const hasPermission = usePermissions((state) => state.hasPermission);

  const result: Record<string, boolean> = {};
  for (const path of paths) {
    result[path] = hasPermission(path);
  }
  return result;
}

interface RolePath {
  path: string;
}

interface RoleData {
  id: string;
  roles: RolePath[];
}
