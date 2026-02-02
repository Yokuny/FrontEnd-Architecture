import { Users } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { ItemDescription, ItemMedia, ItemTitle } from '@/components/ui/item';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatDate } from '@/lib/formatDate';
import type { Collaborator } from '../@interface/os.schema';

export function OsCollaborators({ collaborators }: OsCollaboratorsTableProps) {
  const { t } = useTranslation();

  if (!collaborators || collaborators.length === 0) return null;

  return (
    <div className="overflow-hidden rounded-lg border bg-card">
      <Table>
        <TableHeader className="bg-muted/50">
          <TableRow>
            <TableHead className="w-60">
              <div className="flex items-center gap-1">
                <ItemMedia variant="icon">
                  <Users className="size-4" />
                </ItemMedia>
                <ItemTitle>{t('collaborator.info')}</ItemTitle>
              </div>
            </TableHead>
            <TableHead>
              <ItemDescription className="font-medium uppercase">{t('suricata.collaborator.code')}</ItemDescription>
            </TableHead>
            <TableHead>
              <ItemDescription className="font-medium uppercase">{t('name')}</ItemDescription>
            </TableHead>
            <TableHead>
              <ItemDescription className="font-medium uppercase">{t('role')}</ItemDescription>
            </TableHead>
            <TableHead>
              <ItemDescription className="font-medium uppercase">{t('fas.aso.expiration')}</ItemDescription>
            </TableHead>
            <TableHead>
              <ItemDescription className="font-medium uppercase">{t('fas.valid')}</ItemDescription>
            </TableHead>
            <TableHead>
              <ItemDescription className="font-medium uppercase">{t('new')}</ItemDescription>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {collaborators.map((collaborator, i) => (
            <TableRow key={collaborator._id || i}>
              {i === 0 && <TableCell className="bg-muted/50" rowSpan={collaborators.length} />}
              <TableCell>
                <ItemTitle>{collaborator.code || '-'}</ItemTitle>
              </TableCell>
              <TableCell>
                <ItemTitle>{collaborator.name || '-'}</ItemTitle>
              </TableCell>
              <TableCell>
                <ItemTitle> {collaborator.role || '-'} </ItemTitle>
              </TableCell>
              <TableCell>
                <ItemTitle>{collaborator.AsoExpirationDate ? formatDate(collaborator.AsoExpirationDate, 'dd MMM yyyy') : '-'}</ItemTitle>
              </TableCell>
              <TableCell>
                <ItemTitle className={collaborator.valid ? 'text-green-700' : 'text-red-700'}>{t(collaborator.valid ? 'yes' : 'not')}</ItemTitle>
              </TableCell>
              <TableCell>
                <ItemTitle>{t(collaborator.isNew ? 'yes' : 'not')}</ItemTitle>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

interface OsCollaboratorsTableProps {
  collaborators?: Collaborator[];
}
