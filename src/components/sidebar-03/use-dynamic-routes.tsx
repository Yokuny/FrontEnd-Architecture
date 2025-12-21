'use client';

import { useMemo } from 'react';
import { useIntl } from 'react-intl';
import { buildSidebarRoutes, type SidebarRoute } from '@/config/sidebarRoutes';
import type { Route } from './nav-main';

// Converter SidebarRoute para formato do nav-main.tsx
function convertToNavRoutes(routes: SidebarRoute[], intl: ReturnType<typeof useIntl>): Route[] {
  return routes.map((route) => {
    const title = intl.formatMessage({ id: route.labelKey, defaultMessage: route.labelKey });

    return {
      id: route.id,
      title,
      icon: route.icon ? <route.icon className="size-4" /> : undefined,
      link: route.path,
      subs: route.children?.map((child) => ({
        title: intl.formatMessage({ id: child.labelKey, defaultMessage: child.labelKey }),
        link: child.path,
        icon: child.icon ? <child.icon className="size-4" /> : undefined,
      })),
    };
  });
}

export function useDynamicRoutes(): Route[] {
  const intl = useIntl();

  return useMemo(() => {
    const sidebarRoutes = buildSidebarRoutes();
    return convertToNavRoutes(sidebarRoutes, intl);
  }, [intl]);
}
