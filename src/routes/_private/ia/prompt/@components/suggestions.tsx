import { useNavigate } from '@tanstack/react-router';
import { ExternalLink, Navigation, Search } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Item, ItemContent, ItemDescription, ItemTitle } from '@/components/ui/item';
import type { NavigationResult } from '../@utils/ai/navigationAgent';

export function Suggestions({ result, onNavigate }: AssistantPanelProps) {
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
          <ItemDescription className="text-xs">Sugestão de Navegação</ItemDescription>
        </div>

        <ItemTitle>{result.route.semantic_text.split('.')[0]}</ItemTitle>
      </ItemContent>
      <div className="flex-1 space-y-2">
        {Object.keys(result.params).length > 0 && (
          <div className="flex flex-wrap gap-2 py-2">
            {Object.entries(result.params).map(([key, value]) => (
              <Badge variant="outline" key={key}>
                <Search className="size-3 text-muted-foreground" />
                <ItemDescription className="leading-none">{key}:</ItemDescription>
                <span>{value}</span>
              </Badge>
            ))}
          </div>
        )}
      </div>
      <Button onClick={handleNavigate}>
        <ExternalLink className="size-3" />
      </Button>
    </Item>
  );
}

interface AssistantPanelProps {
  result: NavigationResult | null;
  onNavigate?: () => void;
}
