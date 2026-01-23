import { createFileRoute, Link } from '@tanstack/react-router';
import { MessageSquare, ScanSearch } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Item, ItemContent, ItemDescription, ItemMedia, ItemTitle } from '@/components/ui/item';

export const Route = createFileRoute('/_private/ia/')({
  component: IAHubPage,
});

function IAHubPage() {
  const { t } = useTranslation();

  const menuItems = [
    {
      title: t('ai.prompt'),
      description: t('ai.prompt.description'),
      icon: MessageSquare,
      to: '/ia/prompt' as const,
    },
    {
      title: t('ai.anomaly.detector'),
      description: t('ai.anomaly.detector.description'),
      icon: ScanSearch,
      to: '/ia/anomaly-detector' as const,
    },
  ];

  return (
    <Card>
      <CardHeader title={t('ai')} />
      <CardContent className="grid gap-4 md:grid-cols-2">
        {menuItems.map((item) => (
          <Item key={item.to} variant="outline" className="h-full cursor-pointer" asChild>
            <Link to={item.to}>
              <ItemMedia variant="icon">
                <item.icon className="size-5" />
              </ItemMedia>
              <ItemContent>
                <ItemTitle className="text-base">{item.title}</ItemTitle>
                <ItemDescription>{item.description}</ItemDescription>
              </ItemContent>
            </Link>
          </Item>
        ))}
      </CardContent>
    </Card>
  );
}
