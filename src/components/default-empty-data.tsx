'use client';

import { Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from '@/components/ui/empty';

const EmptyData = () => {
  const { t } = useTranslation();
  return (
    <Empty className="border-2 bg-accent/5">
      <EmptyHeader>
        <Search className="size-6 text-muted-foreground" />
        <EmptyTitle className="font-medium">{t('not.found')}</EmptyTitle>
        <EmptyDescription>{t('not.found.description')}</EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
};

export default EmptyData;
