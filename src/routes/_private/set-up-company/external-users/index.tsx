import { createFileRoute, useSearch } from '@tanstack/react-router';
import { Eye, EyeOff, Plus } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';

import EmptyData from '@/components/default-empty-data';
import DefaultLoading from '@/components/default-loading';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ModalNewExternalUser } from './@components/modal-new-external-user';
import { useExternalUsers, useExternalUsersApi } from './@hooks/use-external-users-api';

const searchSchema = z.object({
  id: z.string().optional(),
});

export const Route = createFileRoute('/_private/set-up-company/external-users/')({
  component: ExternalUsersPage,
  validateSearch: searchSchema,
  beforeLoad: () => ({
    title: 'usernames.external',
  }),
  staticData: {
    title: 'usernames.external',
    description:
      'Gerenciamento de usuários externos para integração com APIs e sistemas de terceiros. Configure tokens de autenticação e controle de acesso para usuários externos.',
    tags: ['setup', 'configuração', 'config', 'admin', 'integration', 'integração', 'external users', 'usuários externos', 'tokens', 'api', 'autenticação', 'authentication'],
    examplePrompts: [
      'Como criar um novo usuário externo para integração?',
      'Como gerar um token de acesso para API externa?',
      'Como desativar um usuário externo?',
      'Onde gerencio os tokens de autenticação?',
    ],
    searchParams: [{ name: 'id', type: 'string', description: 'ID da empresa para filtrar usuários externos', example: 'uuid-123' }],
    relatedRoutes: [
      { path: '/_private/set-up-company', relation: 'parent', description: 'Hub de configurações da empresa' },
      { path: '/_private/set-up-company/setup-api-external', relation: 'sibling', description: 'Configuração de APIs externas' },
      { path: '/_private/set-up-company/integration-list', relation: 'sibling', description: 'Lista de integrações' },
    ],
    entities: ['Enterprise', 'ExternalUser', 'Integration'],
    capabilities: [
      'Criar usuários externos',
      'Gerenciar tokens de acesso',
      'Ativar/desativar usuários externos',
      'Visualizar credenciais de integração',
      'Configurar autenticação de APIs',
    ],
  },
});

function ExternalUsersPage() {
  const { id: idEnterpriseQuery } = useSearch({ from: '/_private/set-up-company/external-users/' });

  if (!idEnterpriseQuery) {
    return (
      <Card>
        <CardHeader />
        <CardContent>
          <EmptyData />
        </CardContent>
      </Card>
    );
  }

  return <ExternalUsersContent idEnterprise={idEnterpriseQuery} />;
}

function ExternalUsersContent({ idEnterprise }: { idEnterprise: string }) {
  const { t } = useTranslation();
  const [showModal, setShowModal] = useState(false);
  const [showToken, setShowToken] = useState<string[]>([]);

  const { data: users, isLoading } = useExternalUsers(idEnterprise);
  const { updateStatus } = useExternalUsersApi();

  const toggleToken = (id: string) => {
    setShowToken((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  return (
    <Card>
      <CardHeader title={t('usernames.external')}>
        <Button onClick={() => setShowModal(true)}>
          <Plus className="mr-2 size-4" />
          {t('add')}
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <DefaultLoading />
        ) : !users || users.length === 0 ? (
          <EmptyData />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('user')}</TableHead>
                <TableHead>Token</TableHead>
                <TableHead className="w-[100px] text-center">{t('machine')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.username}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Input type={showToken.includes(user.id) ? 'text' : 'password'} value={user.token} readOnly className="max-w-[400px] bg-muted" />
                      <Button variant="ghost" size="icon" onClick={() => toggleToken(user.id)}>
                        {showToken.includes(user.id) ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <Switch checked={user.active} onCheckedChange={(checked) => updateStatus.mutate({ id: user.id, active: checked })} disabled={updateStatus.isPending} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>

      <ModalNewExternalUser idEnterprise={idEnterprise} open={showModal} onOpenChange={setShowModal} />
    </Card>
  );
}
