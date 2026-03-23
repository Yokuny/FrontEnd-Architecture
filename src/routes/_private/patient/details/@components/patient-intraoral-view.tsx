import { useNavigate } from '@tanstack/react-router';
import Edit from '@/components/icons/Edit.Icon';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DataTable, type DataTableColumn } from '@/components/ui/data-table';
import { capitalizeString } from '@/lib/helpers/formatter.helper';
import type { Intraoral } from '@/lib/interfaces';

export const PatientIntraoralView = ({ intraoral, patientId }: { intraoral?: Intraoral; patientId: string }) => {
  const navigate = useNavigate();

  if (!intraoral || intraoral.updatedAt === intraoral.createdAt) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center p-12 text-center">
          <CardTitle className="mb-4 text-xl">Registro Intraoral</CardTitle>
          <p className="mb-4 text-muted-foreground">Nenhum exame intraoral cadastrado para este paciente.</p>
          <Button onClick={() => navigate({ to: '/patient/details/intraoral', search: { id: patientId } })} variant="outline">
            Cadastrar Exame Intraoral
          </Button>
        </CardContent>
      </Card>
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
    <Card className="flex flex-col gap-6">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl">Registro Intraoral</CardTitle>
        <Button variant="outline" onClick={() => navigate({ to: '/patient/details/intraoral', search: { id: patientId } })}>
          <Edit className="mr-2 size-4" /> Editar
        </Button>
      </CardHeader>

      <CardContent className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="space-y-4 rounded-md border p-6">
          <h3 className="font-semibold text-lg tracking-tight">Avaliação da Saúde Bucal</h3>
          <DataTable data={healthData} columns={healthColumns} searchable={false} showPagination={false} compact bordered={false} />
        </div>

        <div className="space-y-4 rounded-md border p-6">
          <h3 className="font-semibold text-lg tracking-tight">Regiões Específicas</h3>
          <DataTable data={regionData} columns={regionColumns} searchable={false} showPagination={false} compact bordered={false} />
        </div>
      </CardContent>
    </Card>
  );
};
