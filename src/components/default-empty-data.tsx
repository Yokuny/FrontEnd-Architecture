import * as React from 'react';
import Card from '@/components/icons/Card.Icon';
import Cloud from '@/components/icons/Cloud.Icon';
import Face from '@/components/icons/Face.Icon';
import Mail from '@/components/icons/Mail.Icon';
import Package from '@/components/icons/Package.Icon';
import Search from '@/components/icons/Search.Icon';
import Service from '@/components/icons/Service.Icon';
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from '@/components/ui/empty';
import { t } from '@/lib/helpers/translate';

const ICONS = [Search, Search, Card, Mail, Cloud, Face, Service, Service, Package];

const EmptyData = () => {
  const Icon = React.useMemo(() => {
    return ICONS[Math.floor(Math.random() * ICONS.length)];
  }, []);

  return (
    <Empty className="border-2 bg-accent/30">
      <EmptyHeader>
        <Icon className="zoom-in-50 size-6 animate-in text-muted-foreground duration-500" />
        <EmptyTitle>{t('not.found')}</EmptyTitle>
        <EmptyDescription className="font-mono leading-tight">{t('not.found.description')}</EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
};

export default EmptyData;
