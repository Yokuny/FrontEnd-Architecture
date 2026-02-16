import { useNavigate } from '@tanstack/react-router';
import { ExternalLink, Navigation } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Item, ItemContent, ItemDescription, ItemTitle } from '@/components/ui/item';
import type { AssistantPanelProps } from './@interface/ai-prompt.interface';

export function Suggestions({ result, onNavigate }: AssistantPanelProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  if (!result) return null;

  const handleNavigate = () => {
    navigate({ to: result.path, search: result.params } as any);
    if (onNavigate) onNavigate();
  };

  return (
    <Item className="border-muted bg-secondary py-0.5">
      <ItemContent className="gap-0">
        <div className="flex items-stretch gap-1">
          <Navigation className="size-3 text-muted-foreground" />
          <ItemDescription className="text-xs">{t('ai.navigation_suggestion')}</ItemDescription>
        </div>
        <ItemTitle>{result.route.semantic_text.split('.')[0]}</ItemTitle>
      </ItemContent>
      {/* <div className="flex-1">
        {Object.keys(result.params).length > 0 && (
          <div className="flex flex-wrap gap-1 py-1">
            {Object.entries(result.params).map(([key, value]) => (
              <Badge variant="outline" className="max-w-40 " key={key}>
                <Search className="size-3 text-muted-foreground" />
                <ItemDescription className="leading-none">{key}:</ItemDescription>
                <span>{value}</span>
              </Badge>
            ))}
          </div>
        )}
      </div> */}
      <Button onClick={handleNavigate}>
        <ExternalLink className="size-3" />
      </Button>
    </Item>
  );
}
