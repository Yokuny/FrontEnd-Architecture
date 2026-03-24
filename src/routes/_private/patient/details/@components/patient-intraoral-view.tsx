import { useNavigate } from '@tanstack/react-router';
import Edit from '@/components/icons/Edit.Icon';
import { Button } from '@/components/ui/button';
import { DataTable, type DataTableColumn } from '@/components/ui/data-table';
import { Item, ItemActions, ItemHeader, ItemTitle, ItemDescription } from '@/components/ui/item';
import { capitalizeString } from '@/lib/helpers/formatter.helper';
import type { Intraoral } from '@/lib/interfaces';

export const PatientIntraoralView = ({ intraoral, patientId }: { intraoral?: Intraoral; patientId: string }) => {
  const navigate = useNavigate();

  if (!intraoral || intraoral.updatedAt === intraoral.createdAt) {
    return (
      <Item variant="outline" className="flex flex-col items-center justify-center p-12 text-center">
        <ItemTitle className="mb-4 text-xl">Registro Intraoral</ItemTitle>
        <ItemDescription className="mb-4">Nenhum exame intraoral cadastrado para este paciente.</ItemDescription>
        <Button onClick={() => navigate({ to: '/patient/details/intraoral', search: { id: patientId } })} variant="outline">
          Cadastrar Exame Intraoral
        </Button>
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

  const healthColumns: DataTableColumn<{ aspect: string; condition: string }>[] = [
    { key: 'aspect', header: 'Aspecto', render: (v) => <span className="font-medium">{v}</span> },
    { key: 'condition', header: 'Condição', render: (v) => capitalizeString(v) },
  ];

  const regionColumns: DataTableColumn<{ region: string; description: string }>[] = [
    { key: 'region', header: 'Região', render: (v) => <span className="font-medium">{v}</span> },
    { key: 'description', header: 'Descrição/Achados', render: (v) => capitalizeString(v) },
  ];

  return (
    <div className="flex flex-col gap-6">
      <ItemHeader className="flex flex-row items-center justify-between">
        <ItemTitle className="text-xl">Registro Intraoral</ItemTitle>
        <ItemActions>
          <Button variant="outline" onClick={() => navigate({ to: '/patient/details/intraoral', search: { id: patientId } })}>
            <Edit className="mr-2 size-4" /> Editar
          </Button>
        </ItemActions>
      </ItemHeader>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Item variant="outline" className="flex-col items-start gap-4 p-6">
          <ItemTitle className="font-semibold text-lg tracking-tight">Avaliação da Saúde Bucal</ItemTitle>
          <DataTable data={healthData} columns={healthColumns} searchable={false} showPagination={false} compact bordered={false} />
        </Item>

        <Item variant="outline" className="flex-col items-start gap-4 p-6">
          <ItemTitle className="font-semibold text-lg tracking-tight">Regiões Específicas</ItemTitle>
          <DataTable data={regionData} columns={regionColumns} searchable={false} showPagination={false} compact bordered={false} />
        </Item>
      </div>
    </div>
  );
};
