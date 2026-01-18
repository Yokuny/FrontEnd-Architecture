'use client';

import { Bird, CloudOff, Database, FileSearch, Ghost, Inbox, PackageOpen, Search, Telescope } from 'lucide-react';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from '@/components/ui/empty';

const ICONS = [FileSearch, Search, Database, Inbox, CloudOff, Ghost, Telescope, Bird, PackageOpen];

const EmptyData = () => {
  const { t } = useTranslation();

  const Icon = React.useMemo(() => {
    return ICONS[Math.floor(Math.random() * ICONS.length)];
  }, []);

  return (
    <Empty className="border-2 bg-accent/30">
      <EmptyHeader>
        <Icon className="size-6 text-muted-foreground animate-in zoom-in-50 duration-500" />
        <EmptyTitle>{t('not.found')}</EmptyTitle>
        <EmptyDescription className="leading-tight font-mono">{t('not.found.description')}</EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
};

export default EmptyData;
