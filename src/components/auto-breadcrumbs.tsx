import { Link, useMatches } from '@tanstack/react-router';
import { Home } from 'lucide-react';
import { Fragment, useMemo } from 'react';
import { Breadcrumb, BreadcrumbEllipsis, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';

export function AutoBreadcrumbs() {
  const matches = useMatches();

  const breadcrumbs = useMemo(() => {
    const lastMatch = matches[matches.length - 1];
    if (!lastMatch) return [];

    const segments = lastMatch.pathname.split('/').filter(Boolean);
    const crumbs = [];
    let cumulativePath = '';

    for (const segment of segments) {
      cumulativePath += `/${segment}`;

      const match = matches.find((m) => m.pathname === cumulativePath || m.pathname === `${cumulativePath}/`);

      let title: string | undefined;

      if (match?.staticData?.getTitle && typeof match.staticData.getTitle === 'function') {
        title = match.staticData.getTitle();
      } else if (match?.staticData?.title) {
        title = match.staticData.title;
      } else if ((match?.context as any)?.title) {
        title = (match?.context as any).title;
      }

      // Fallback: tenta capitalizar
      if (!title) {
        title = segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ');
      }

      crumbs.push({
        title,
        path: cumulativePath,
      });
    }

    return crumbs;
  }, [matches]);

  // Se tiver mais que 3 segmentos após a Home, colapsamos
  const shouldCollapse = breadcrumbs.length > 3;

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link to="/">
              <Home className="size-4" />
              <span className="sr-only">Home</span>
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>

        {breadcrumbs.length > 0 && <BreadcrumbSeparator />}

        {shouldCollapse ? (
          <>
            <BreadcrumbItem>
              <BreadcrumbEllipsis />
            </BreadcrumbItem>
            <BreadcrumbSeparator />

            {/* Mostra os dois últimos */}
            {breadcrumbs.slice(-2).map((crumb, index, array) => {
              const isLast = index === array.length - 1;
              return (
                <Fragment key={crumb.path}>
                  <BreadcrumbItem>
                    {isLast ? (
                      <BreadcrumbPage>{crumb.title}</BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink asChild>
                        <Link to={crumb.path as any}>{crumb.title}</Link>
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                  {!isLast && <BreadcrumbSeparator />}
                </Fragment>
              );
            })}
          </>
        ) : (
          breadcrumbs.map((crumb, index) => {
            const isLast = index === breadcrumbs.length - 1;
            return (
              <Fragment key={crumb.path}>
                <BreadcrumbItem>
                  {isLast ? (
                    <BreadcrumbPage>{crumb.title}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink asChild>
                      <Link to={crumb.path as any}>{crumb.title}</Link>
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
                {!isLast && <BreadcrumbSeparator />}
              </Fragment>
            );
          })
        )}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
