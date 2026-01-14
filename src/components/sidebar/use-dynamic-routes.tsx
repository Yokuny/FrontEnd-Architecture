'use client';

import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { buildSidebarRoutes, type SidebarRoute } from '@/config/sidebarRoutes';
import type { Route } from './nav-main';

// Converter SidebarRoute para formato do nav-main.tsx
function convertToNavRoutes(routes: SidebarRoute[], t: (key: string) => string): Route[] {
  return routes.map((route) => {
    const title = t(route.labelKey);

    return {
      id: route.id,
      title,
      icon: route.icon ? <route.icon className="size-4" /> : undefined,
      link: route.path,
      subs: route.children?.map((child) => ({
        title: t(child.labelKey),
        link: child.path,
        icon: child.icon ? <child.icon className="size-4" /> : undefined,
      })),
    };
  });
}

export function useDynamicRoutes(): Route[] {
  const { t } = useTranslation();

  return useMemo(() => {
    const sidebarRoutes = buildSidebarRoutes();
    return convertToNavRoutes(sidebarRoutes, t);
  }, [t]);
}
