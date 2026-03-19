import { Link, useLocation, useMatches } from '@tanstack/react-router';
import { type ComponentProps, Fragment } from 'react';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { HomeIcon } from '@/components/icons/Home.Icon';
import HelpIcon from '@/components/icons/Help.Icon';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { t } from '@/lib/helpers/translate';
import { cn } from '@/lib/utils/index';

function PageBreadcrumb() {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter(Boolean);

  if (pathnames.length === 0) return null;

  return (
    <Breadcrumb>
      <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/">
                <HomeIcon className="h-4 w-4" size={16} />
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          {pathnames.length > 0 && <BreadcrumbSeparator />}
          {pathnames.map((value, index) => {
            const isLast = index === pathnames.length - 1;
            const to = `/${pathnames.slice(0, index + 1).join('/')}`;
            const translatedValue = t(value);

            return (
              <Fragment key={to}>
                <BreadcrumbItem>
                  {isLast ? (
                    <BreadcrumbPage>{translatedValue}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink asChild>
                      <Link to={to as string}>{translatedValue}</Link>
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
                {!isLast && <BreadcrumbSeparator />}
              </Fragment>
            );
          })}
        </BreadcrumbList>
    </Breadcrumb>
  );
}

function Card({ className, asPage, children, ...props }: ComponentProps<'div'> & { asPage?: boolean }) {
  return (
    <div data-slot="card" className={cn('flex flex-col gap-6 rounded-lg border bg-card py-6 text-card-foreground', className)} {...props}>
      {asPage && (
        <div className="flex items-center justify-between px-6 -mb-2">
          <PageBreadcrumb />
          <CardDescription />
        </div>
      )}
      {children}
    </div>
  );
}

function CardHeader({ className, title, children, ...props }: ComponentProps<'div'> & { title?: string }) {
  const location = useLocation();
  const matches = useMatches();

  const getTitle = (title: string | undefined) => {
    if (title) return title;

    for (let i = matches.length - 1; i >= 0; i--) {
      const match = matches[i];
       if (match && match.staticData) {
        if (typeof match.staticData.getTitle === 'function') {
          return match.staticData.getTitle();
        }
        if (typeof match.staticData.title === 'string') {
          return match.staticData.title;
        }
      }
    }

    const pathnames = location.pathname.split('/').filter(Boolean);
    if (pathnames.length > 0) {
      return t(pathnames[pathnames.length - 1]);
    }
  };

  return (
    <div data-slot="card-header" className={cn('flex flex-col items-start justify-between gap-2 px-6 sm:flex-row sm:items-center', className)} {...props}>
      <CardTitle>{getTitle(title)}</CardTitle>
      {children}
    </div>
  );
}

function CardTitle({ className, ...props }: ComponentProps<'div'>) {
  return <div data-slot="card-title" className={cn('font-semibold leading-none', className)} {...props} />;
}

function CardDescription({ className, ...props }: ComponentProps<'div'>) {
  const matches = useMatches();
  let description = '';
  
  for (let i = matches.length - 1; i >= 0; i--) {
    const match = matches[i];
    if (match?.staticData && typeof match.staticData.description === 'string') {
      description = match.staticData.description;
      break;
    }
  }

  if (!description) return null;

  return (
    <div data-slot="card-description" className={cn('flex items-center text-muted-foreground', className)} {...props}>
      <Tooltip>
        <TooltipTrigger type="button" className="cursor-help transition-colors hover:text-foreground">
          <HelpIcon className="size-5" />
        </TooltipTrigger>
        <TooltipContent side="left" className="max-w-xs font-normal">
          <p>{description}</p>
        </TooltipContent>
      </Tooltip>
    </div>
  );
}

function CardAction({ className, ...props }: ComponentProps<'div'>) {
  return <div data-slot="card-action" className={cn('col-start-2 row-span-2 row-start-1 self-start justify-self-end flex w-full flex-col items-center gap-2 sm:w-auto sm:flex-row', className)} {...props} />;
}

function CardContent({ className, ...props }: ComponentProps<'div'>) {
  return <div data-slot="card-content" className={cn('px-6', className)} {...props} />;
}

function CardFooter({ className, ...props }: ComponentProps<'div'>) {
  return <div data-slot="card-footer" className={cn('flex items-center px-6 [.border-t]:pt-6', className)} {...props} />;
}

export { Card, CardHeader, CardFooter, CardTitle, CardAction, CardDescription, CardContent };
