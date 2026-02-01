import { useTranslation } from 'react-i18next';
import { ItemDescription, ItemTitle } from '@/components/ui/item';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatDate } from '@/lib/formatDate';
import type { Collaborator } from '../@interface/os.schema';

interface OsCollaboratorsTableProps {
  collaborators?: Collaborator[];
}

export function OsCollaboratorsTable({ collaborators }: OsCollaboratorsTableProps) {
  const { t } = useTranslation();

  if (!collaborators || collaborators.length === 0) return null;

  return (
    <div className="space-y-2">
      <ItemDescription className="font-semibold">{t('collaborator.info')}</ItemDescription>
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-center">{t('suricata.collaborator.code')}</TableHead>
              <TableHead className="text-center">{t('name')}</TableHead>
              <TableHead className="text-center">{t('role')}</TableHead>
              <TableHead className="text-center">{t('fas.aso.expiration')}</TableHead>
              <TableHead className="text-center">{t('fas.valid')}</TableHead>
              <TableHead className="text-center">{t('new')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {collaborators.map((collaborator, i) => (
              <TableRow key={collaborator._id || i}>
                <TableCell className="text-center">{collaborator.code || '-'}</TableCell>
                <TableCell className="text-center">{collaborator.name || '-'}</TableCell>
                <TableCell className="text-center">{collaborator.role || '-'}</TableCell>
                <TableCell className="text-center">{collaborator.AsoExpirationDate ? formatDate(collaborator.AsoExpirationDate, 'dd/MM/yyyy') : '-'}</TableCell>
                <TableCell className="text-center">
                  <ItemTitle className={collaborator.valid ? 'text-green-600' : 'text-red-600'}>{t(collaborator.valid ? 'yes' : 'not')}</ItemTitle>
                </TableCell>
                <TableCell className="text-center">{t(collaborator.isNew ? 'yes' : 'not')}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
