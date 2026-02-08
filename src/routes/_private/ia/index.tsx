import { createFileRoute, Link } from '@tanstack/react-router';
import { MessageSquare, ScanSearch } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AIPromptSheet } from '@/components/ai-prompt';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Item, ItemContent, ItemDescription, ItemMedia, ItemTitle } from '@/components/ui/item';

export const Route = createFileRoute('/_private/ia/')({
  component: IAHubPage,
  staticData: {
    title: 'ai',
    description:
      'Hub de Inteligência Artificial - menu centralizado de ferramentas de IA incluindo chatbot com prompt engineering e detector de anomalias com machine learning. Ponto de entrada para recursos de análise preditiva e assistentes inteligentes',
    tags: ['ai', 'ia', 'artificial-intelligence', 'inteligência-artificial', 'hub', 'menu', 'ml', 'machine-learning', 'chatbot', 'anomaly', 'prompt', 'nexai'],
    examplePrompts: ['Acessar ferramentas de IA', 'Usar chatbot inteligente', 'Detectar anomalias', 'Ver menu de IA', 'Navegar para recursos de machine learning'],
    searchParams: [],
    relatedRoutes: [
      { path: '/_private/ia/anomaly-detector', relation: 'child', description: 'Detector de anomalias ML' },
      { path: '/_private', relation: 'parent', description: 'Dashboard principal' },
    ],
    entities: ['AITool', 'Enterprise'],
    capabilities: ['Navegar para chatbot', 'Navegar para detector de anomalias', 'Visualizar menu de IA', 'Acessar ferramentas ML'],
  },
});

function IAHubPage() {
  const { t } = useTranslation();
  const [isPromptOpen, setIsPromptOpen] = useState(false);

  return (
    <>
      <Card>
        <CardHeader />
        <CardContent className="grid gap-4 md:grid-cols-2">
          <Item variant="outline" className="h-full cursor-pointer" onClick={() => setIsPromptOpen(true)}>
            <ItemMedia variant="icon">
              <MessageSquare className="size-5" />
            </ItemMedia>
            <ItemContent>
              <ItemTitle className="text-base">{t('ai.prompt')}</ItemTitle>
              <ItemDescription>{t('ai.anomaly.detector')}</ItemDescription>
            </ItemContent>
          </Item>

          <Item variant="outline" className="h-full cursor-pointer" asChild>
            <Link to="/ia/anomaly-detector">
              <ItemMedia variant="icon">
                <ScanSearch className="size-5" />
              </ItemMedia>
              <ItemContent>
                <ItemTitle className="text-base">{t('ai.anomaly.detector')}</ItemTitle>
                <ItemDescription>{t('ai.anomaly.detector')}</ItemDescription>
              </ItemContent>
            </Link>
          </Item>
        </CardContent>
      </Card>
      <AIPromptSheet open={isPromptOpen} onOpenChange={setIsPromptOpen} />
    </>
  );
}
