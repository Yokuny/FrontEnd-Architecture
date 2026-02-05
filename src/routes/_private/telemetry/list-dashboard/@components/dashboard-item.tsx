import { useNavigate } from '@tanstack/react-router';
import { BarChart, Building2, Folder, Layers, Layout, LayoutDashboard, Link as LinkIcon, MoreVertical, Pen, User } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import DefaultLoading from '@/components/default-loading';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Item, ItemContent, ItemDescription, ItemMedia, ItemTitle } from '@/components/ui/item';
import { useDashboardFolderFiles } from '@/hooks/use-dashboards-api';
import { cn } from '@/lib/utils';
import type { Dashboard } from '../@interface/dashboard.types';

// import { useHasPermission } from '@/hooks/use-permissions';

export function DashboardItem({ item }: { item: Dashboard }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  // const hasPermissionViewer = useHasPermission('/list-dashboard');
  // const hasPermissionEditor = useHasPermission('/add-dashboard');

  const isFolder = item.typeData === 'folder';
  const isUrl = item.typeData === 'url.external';

  // For folders, we fetch content when opened
  const { data: folderContent, isLoading } = useDashboardFolderFiles(item.id, isOpen && isFolder);

  const handleClick = () => {
    if (isFolder) {
      setIsOpen(!isOpen);
    } else if (isUrl) {
      navigate({ to: '/my-frame', search: { id: item.id } } as any);
    } else {
      navigate({ to: item.typeLayout === 'group' ? '/my-group-dashboard' : '/my-dashboard', search: { id: item.id } } as any);
    }
  };

  return (
    <>
      <Item variant="outline" className={cn('cursor-pointer', isFolder ? 'border-l-4 border-l-yellow-500' : 'border-l-2 border-l-primary')} onClick={handleClick}>
        <div className="flex flex-1 items-center gap-4">
          <ItemMedia variant="image" className="text-muted-foreground">
            {isFolder ? <Folder className="size-5 text-yellow-600" /> : <LayoutDashboard className="size-5" />}
          </ItemMedia>
          <ItemContent className="gap-0 text-foreground">
            <ItemTitle className="text-base">{item.description || item.name}</ItemTitle>
            {item.enterprise && (
              <ItemDescription className="flex items-center gap-2">
                <Building2 className="size-3 shrink-0 text-muted-foreground" />
                {item.enterprise.name}
                {item.code && ` / ${item.code}`}
              </ItemDescription>
            )}
          </ItemContent>
        </div>

        <div className="flex items-center gap-4">
          {/* Visibility */}
          <div className="hidden items-center md:flex">
            <div className="flex items-center gap-1 font-medium text-muted-foreground text-xs uppercase tracking-wider">
              <span>{t(item.visibility?.toLowerCase())}</span>
            </div>
          </div>

          {/* Type/Link */}
          <div className="hidden items-center md:flex">
            {isUrl ? (
              <div className="flex items-center gap-1 font-medium text-muted-foreground text-xs uppercase tracking-wider">
                <LinkIcon className="size-3" />
                <span>Link</span>
              </div>
            ) : item.typeLayout ? (
              <div className="flex items-center gap-1 font-medium text-muted-foreground text-xs uppercase tracking-wider">
                {item.typeLayout === 'group' ? <Layers className="size-3" /> : <Layout className="size-3" />}
                <span>{t(item.typeLayout)}</span>
              </div>
            ) : null}
          </div>

          {/* User */}
          <div className="hidden items-center md:flex">
            <div className="flex items-center gap-1 font-medium text-muted-foreground text-xs uppercase tracking-wider">
              <User className="size-3" />
              <span>{item.user?.name}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* {(hasPermissionViewer || (hasPermissionEditor && item.isCanEdit)) && ( */}
          {item.isCanEdit && (
            <div className="flex items-center justify-end border-l pl-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="size-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {/* {hasPermissionViewer && !isFolder && ( */}
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate({ to: item.typeLayout === 'group' ? '/my-group-dashboard' : '/my-dashboard', search: { id: item.id } } as any);
                    }}
                  >
                    <BarChart className="mr-2 size-4" />
                    {t('charts')}
                  </DropdownMenuItem>
                  {/* )} */}
                  {/* {hasPermissionEditor && item.isCanEdit && ( */}
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate({ to: '/add-dashboard', search: { id: item.id } } as any);
                    }}
                  >
                    <Pen className="mr-2 size-4" />
                    {t('edit')}
                  </DropdownMenuItem>
                  {/* )} */}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>
      </Item>

      {/* Recursive Folder Content */}
      {isFolder && isOpen && (
        <div className="mt-2 ml-8 flex flex-col gap-2 border-l-2 pl-4">
          {isLoading ? (
            <DefaultLoading />
          ) : !folderContent?.length ? (
            <div className="py-2 text-muted-foreground text-sm italic">{t('folder.empty')}</div>
          ) : (
            folderContent.map((subItem) => <DashboardItem key={subItem.id} item={subItem} />)
          )}
        </div>
      )}
    </>
  );
}
