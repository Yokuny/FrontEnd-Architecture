import { createFileRoute } from '@tanstack/react-router';
import DefaultFormLayout from '@/components/default-form-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export const Route = createFileRoute('/_private/permissions/layout-test')({
  component: LayoutTestPage,
});

function LayoutTestPage() {
  const demoSections = [
    {
      title: 'Seção Horizontal (Padrão)',
      description: 'Este é o padrão onde o título e a descrição ficam à esquerda e os campos à direita.',
      fields: [
        <div key="h1" className="space-y-2">
          <Label>Campo 1</Label>
          <Input placeholder="Digite algo..." />
        </div>,
        <div key="h2" className="space-y-2">
          <Label>Campo 2</Label>
          <Input placeholder="Digite algo..." />
        </div>,
      ],
    },
    {
      title: 'Seção Horizontal - Múltiplos Campos',
      fields: [
        <div key="h3" className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Subcampo A</Label>
            <Input />
          </div>
          <div className="space-y-2">
            <Label>Subcampo B</Label>
            <Input />
          </div>
        </div>,
      ],
    },
  ];

  const verticalSections = [
    {
      title: 'Seção Vertical',
      description: 'Neste modo, o título e a descrição ficam acima dos campos, ocupando toda a largura.',
      fields: [
        <div key="v1" className="space-y-2">
          <Label>Campo Full Width</Label>
          <Input placeholder="Este campo ocupa a largura total da seção" />
        </div>,
        <div key="v2" className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Meia Largura 1</Label>
            <Input />
          </div>
          <div className="space-y-2">
            <Label>Meia Largura 2</Label>
            <Input />
          </div>
        </div>,
      ],
    },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader title="Demo do DefaultFormLayout" />
        <CardContent className="p-0">
          <Tabs defaultValue="horizontal">
            <div className="px-6 pt-6 md:px-10">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="horizontal">Modo Horizontal</TabsTrigger>
                <TabsTrigger value="vertical">Modo Vertical</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="horizontal">
              <DefaultFormLayout layout="horizontal" sections={demoSections} />
            </TabsContent>

            <TabsContent value="vertical">
              <DefaultFormLayout layout="vertical" sections={verticalSections} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Card>
        <CardHeader title="Visualização Direta (Sem Tabs)" />
        <CardContent className="p-0">
          <div className="p-6 md:p-10 bg-muted/50">
            <h3 className="text-lg font-medium mb-4">Exemplo Real de Uso (Misto)</h3>
            <p className="text-sm text-muted-foreground mb-8">Abaixo um exemplo de como o componente se comporta quando renderizado diretamente.</p>
          </div>
          <DefaultFormLayout
            layout="horizontal"
            sections={[
              {
                title: 'Informações Básicas',
                description: 'Layout horizontal para dados simples.',
                fields: [<Input key="1" placeholder="Nome" />, <Input key="2" placeholder="E-mail" />],
              },
            ]}
          />
          <DefaultFormLayout
            layout="vertical"
            sections={[
              {
                title: 'Configurações Avançadas',
                description: 'Layout vertical para tabelas ou listas complexas que precisam de espaço.',
                fields: [
                  <div key="3" className="p-12 border-2 border-dashed rounded-lg text-center text-muted-foreground">
                    Área para Tabela ou Componente Complexo
                  </div>,
                ],
              },
            ]}
          />
        </CardContent>
        <CardFooter layout="multi">
          <span className="text-sm text-muted-foreground">Layout de teste v1.0</span>
          <Button variant="ghost">Precisa de ajuda?</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
