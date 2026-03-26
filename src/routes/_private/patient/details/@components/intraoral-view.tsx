import { useNavigate } from '@tanstack/react-router';
import DefaultFormLayout, { type FormSection } from '@/components/default-form-layout';
import Edit from '@/components/icons/Edit.Icon';
import { Button } from '@/components/ui/button';
import { Item, ItemActions, ItemContent, ItemDescription, ItemFooter, ItemHeader, ItemTitle } from '@/components/ui/item';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatDate } from '@/lib/helpers/formatDate.utils';
import { capitalizeString } from '@/lib/helpers/formatter.helper';
import type { Intraoral } from '@/lib/interfaces';

export const PatientIntraoralView = ({ intraoral, patientId }: { intraoral?: Intraoral; patientId: string }) => {
  const navigate = useNavigate();

  if (!intraoral || intraoral.updatedAt === intraoral.createdAt) {
    return (
      <Item variant="outline" className="flex flex-col items-center justify-center p-12 text-center">
        <ItemTitle className="mb-4 text-xl">Registro Intraoral</ItemTitle>
        <ItemDescription className="mb-4">Nenhum exame intraoral cadastrado para este paciente.</ItemDescription>
        <Button onClick={() => navigate({ to: '/patient/details/intraoral', search: { id: patientId } })}>Cadastrar Exame Intraoral</Button>
      </Item>
    );
  }

  const healthData = [
    ...(intraoral.hygiene ? [{ aspect: 'Higiene', condition: intraoral.hygiene }] : []),
    ...(intraoral.halitosis ? [{ aspect: 'Mau hálito', condition: intraoral.halitosis }] : []),
    ...(intraoral.tartar ? [{ aspect: 'Tártaro', condition: intraoral.tartar }] : []),
    ...(intraoral.gums ? [{ aspect: 'Gengivas', condition: intraoral.gums }] : []),
    ...(intraoral.mucosa ? [{ aspect: 'Mucosa', condition: intraoral.mucosa }] : []),
  ];

  const regionData = [
    ...(intraoral.tongue ? [{ region: 'Língua', description: intraoral.tongue }] : []),
    ...(intraoral.palate ? [{ region: 'Palato (Céu da boca)', description: intraoral.palate }] : []),
    ...(intraoral.oralFloor ? [{ region: 'Assoalho bucal', description: intraoral.oralFloor }] : []),
    ...(intraoral.lips ? [{ region: 'Lábios', description: intraoral.lips }] : []),
    ...(intraoral.otherObservations ? [{ region: 'Outras Observações', description: intraoral.otherObservations }] : []),
  ];

  const sections: FormSection[] = [];

  if (healthData.length > 0) {
    sections.push({
      title: 'Avaliação da Saúde Bucal',
      fields: [
        <Table key="health-table" className="border">
          <TableHeader>
            <TableRow>
              <TableHead className="w-1/2 font-semibold text-xs">Aspecto</TableHead>
              <TableHead className="w-1/2 font-semibold text-xs">Condição</TableHead>
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
      title: 'Regiões Específicas',
      fields: [
        <Table key="region-table" className="border">
          <TableHeader>
            <TableRow>
              <TableHead className="w-1/2 font-semibold text-xs">Região</TableHead>
              <TableHead className="w-1/2 font-semibold text-xs">Descrição/Achados</TableHead>
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

  return (
    <Item>
      <ItemHeader>
        <ItemTitle className="text-xl">Registro Intraoral</ItemTitle>
        <ItemActions>
          <Button onClick={() => navigate({ to: '/patient/details/intraoral', search: { id: patientId } })}>
            <Edit className="mr-2 size-4" /> Editar
          </Button>
        </ItemActions>
      </ItemHeader>

      <ItemContent>
        <DefaultFormLayout sections={sections} />
      </ItemContent>

      <ItemFooter>
        <div className="flex w-full items-center justify-end gap-2">
          <ItemDescription>Última atualização:</ItemDescription>
          <ItemTitle>{formatDate(intraoral.updatedAt)}</ItemTitle>
        </div>
      </ItemFooter>
    </Item>
  );
};
