import { useNavigate } from '@tanstack/react-router';
import DefaultEmptyData from '@/components/default-empty-data';
import DefaultFormLayout, { type FormSection } from '@/components/default-form-layout';

import Edit from '@/components/icons/Edit.Icon';
import { Button } from '@/components/ui/button';
import { Item, ItemActions, ItemContent, ItemDescription, ItemFooter, ItemHeader, ItemTitle } from '@/components/ui/item';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatDate } from '@/lib/helpers/formatDate.helper';
import { capitalizeString } from '@/lib/helpers/formatter.helper';
import { t } from '@/lib/helpers/translate.helper';
import type { Intraoral } from '@/lib/interfaces';

const IntraoralContent = ({ intraoral }: { intraoral: Intraoral }) => {
  const healthData = [
    ...(intraoral.hygiene ? [{ aspect: t('hygiene'), condition: intraoral.hygiene }] : []),
    ...(intraoral.halitosis ? [{ aspect: t('bad.breath'), condition: intraoral.halitosis }] : []),
    ...(intraoral.tartar ? [{ aspect: t('tartar'), condition: intraoral.tartar }] : []),
    ...(intraoral.gums ? [{ aspect: t('gums'), condition: intraoral.gums }] : []),
    ...(intraoral.mucosa ? [{ aspect: t('mucosa'), condition: intraoral.mucosa }] : []),
  ];

  const regionData = [
    ...(intraoral.tongue ? [{ region: t('tongue'), description: intraoral.tongue }] : []),
    ...(intraoral.palate ? [{ region: t('palate.full'), description: intraoral.palate }] : []),
    ...(intraoral.oralFloor ? [{ region: t('oral.floor'), description: intraoral.oralFloor }] : []),
    ...(intraoral.lips ? [{ region: t('lips'), description: intraoral.lips }] : []),
    ...(intraoral.otherObservations ? [{ region: t('other.observations'), description: intraoral.otherObservations }] : []),
  ];

  const sections: FormSection[] = [];

  if (healthData.length > 0) {
    sections.push({
      title: t('oral.health.assessment'),
      fields: [
        <Table key="health-table" className="border">
          <TableHeader className="bg-secondary">
            <TableRow>
              <TableHead className="w-1/2 font-semibold text-xs">{t('aspect')}</TableHead>
              <TableHead className="w-1/2 font-semibold text-xs">{t('condition')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {healthData.map((item) => (
              <TableRow key={item.aspect}>
                <TableCell className="font-medium text-sm">{item.aspect}</TableCell>
                <TableCell className="text-sm">{capitalizeString(item.condition)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>,
      ],
    });
  }

  if (regionData.length > 0) {
    sections.push({
      title: t('specific.regions'),
      fields: [
        <Table key="region-table" className="border">
          <TableHeader className="bg-secondary">
            <TableRow>
              <TableHead className="w-1/2 font-semibold text-xs">{t('region')}</TableHead>
              <TableHead className="w-1/2 font-semibold text-xs">{t('description.findings')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {regionData.map((item) => (
              <TableRow key={item.region}>
                <TableCell className="font-medium text-sm">{item.region}</TableCell>
                <TableCell className="text-sm">{capitalizeString(item.description)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>,
      ],
    });
  }

  return <DefaultFormLayout sections={sections} />;
};

export const PatientIntraoralView = ({ intraoral, patientId }: { intraoral?: Intraoral; patientId: string }) => {
  const navigate = useNavigate();
  const hasData = !!intraoral && (intraoral.updatedAt !== intraoral.createdAt || !!intraoral.mucosa || !!intraoral.hygiene); // Added more checks to ensure data presence if timestamps match

  return (
    <Item>
      <ItemHeader>
        <ItemTitle className="text-xl">{t('intraoral.record')}</ItemTitle>
        <ItemActions>
          <Button onClick={() => navigate({ to: '/patient/details/intraoral', search: { id: patientId } })}>
            {hasData ? (
              <>
                <Edit className="size-4" /> {t('edit')}
              </>
            ) : (
              t('register')
            )}
          </Button>
        </ItemActions>
      </ItemHeader>

      <ItemContent>{hasData ? <IntraoralContent intraoral={intraoral} /> : <DefaultEmptyData />}</ItemContent>

      {hasData && (
        <ItemFooter>
          <div className="flex w-full items-center justify-end gap-2">
            <ItemDescription>{t('last.updated')}</ItemDescription>
            <ItemTitle>{formatDate(intraoral.updatedAt)}</ItemTitle>
          </div>
        </ItemFooter>
      )}
    </Item>
  );
};
