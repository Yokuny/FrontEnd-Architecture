import { useNavigate } from '@tanstack/react-router';
import Edit from '@/components/icons/Edit.Icon';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DataTable, type DataTableColumn } from '@/components/ui/data-table';
import { Item, ItemActions, ItemDescription, ItemHeader, ItemTitle } from '@/components/ui/item';
import { capitalizeString } from '@/lib/helpers/formatter.helper';
import type { Anamnesis } from '@/lib/interfaces';
import { cn } from '@/lib/utils/cn.util';

export const ANAMNESIS_SEVERITY_MAP = {
  allergicToMedication: 'high',
  infectiousDisease: 'high',
  importantHealthInformation: 'high',
  diabetes: 'high',
  heartProblems: 'high',
  highBloodPressure: 'high',
  tuberculosis: 'high',
  arthritis: 'medium',
  asthma: 'medium',
  kidneyProblems: 'medium',
  liverProblems: 'medium',
  otherIllnesses: 'medium',
  pregnant: 'medium',
  breastfeeding: 'medium',
  underMedicalTreatment: 'medium',
  takingMedication: 'medium',
} as const;

export const PatientAnamnesisView = ({ anamnesis, patientId }: { anamnesis?: Anamnesis; patientId: string }) => {
  const navigate = useNavigate();

  if (!anamnesis || anamnesis.updatedAt === anamnesis.createdAt) {
    return (
      <Item variant="outline" className="flex flex-col items-center justify-center p-12 text-center">
        <ItemTitle className="mb-4 text-xl">Registro de Anamnese</ItemTitle>
        <ItemDescription className="mb-4">Nenhuma anamnese cadastrada para este paciente.</ItemDescription>
        <Button onClick={() => navigate({ to: '/patient/details/anamnesis', search: { id: patientId } })} variant="outline">
          Cadastrar Anamnese
        </Button>
      </Item>
    );
  }

  const getSeverityDot = (condition: boolean, severity: 'high' | 'medium' = 'medium') => {
    if (!condition) return null;
    return <div className={cn('ml-2 size-2 rounded-full', severity === 'high' ? 'bg-red-500' : 'bg-yellow-500')} />;
  };

  const attentionCount = Object.entries(ANAMNESIS_SEVERITY_MAP).filter(([key, severity]) => {
    if (severity !== 'high' && severity !== 'medium') return false;
    const value = (anamnesis as Record<string, unknown>)[key] || (anamnesis.illnesses as Record<string, unknown>)?.[key];
    if (key === 'otherIllnesses' || key === 'importantHealthInformation' || key === 'infectiousDisease') {
      return value && !['', 'nenhuma', 'não', 'não tem', 'não informado'].includes(String(value).toLowerCase());
    }
    return String(value) === 'true';
  }).length;

  const complaintData = anamnesis.mainComplaint ? [{ complaint: 'Queixa Principal', details: anamnesis.mainComplaint }] : [];
  const complaintColumns: DataTableColumn<{ complaint: string; details: string }>[] = [
    { key: 'complaint', header: '', render: (v) => <span className="w-1/3 font-medium">{v}</span> },
    { key: 'details', header: '', render: (v) => capitalizeString(v) },
  ];

  const illnessesData = [
    ...(String(anamnesis.illnesses?.diabetes) === 'true' ? [{ condition: 'Diabetes', state: 'Sim', severity: 'high' as const }] : []),
    ...(String(anamnesis.illnesses?.heartProblems) === 'true' ? [{ condition: 'Problemas Cardíacos', state: 'Sim', severity: 'high' as const }] : []),
    ...(String(anamnesis.illnesses?.highBloodPressure) === 'true' ? [{ condition: 'Hipertensão', state: 'Sim', severity: 'high' as const }] : []),
    ...(String(anamnesis.illnesses?.asthma) === 'true' ? [{ condition: 'Asma', state: 'Sim', severity: 'medium' as const }] : []),
    ...(anamnesis.illnesses?.otherIllnesses ? [{ condition: 'Outras Doenças', state: 'Sim', severity: 'medium' as const, extra: anamnesis.illnesses.otherIllnesses }] : []),
  ];
  const illnessesColumns: DataTableColumn<{ condition: string; state: string; severity: 'high' | 'medium'; extra?: string }>[] = [
    {
      key: 'condition',
      header: 'Condição',
      render: (v, row) => (
        <span className="flex items-center">
          {v} {getSeverityDot(true, row.severity)}
        </span>
      ),
    },
    {
      key: 'state',
      header: 'Status',
      render: (v, row) => (
        <span>
          <Badge variant={row.severity === 'high' ? 'red' : 'muted'}>{v}</Badge>
          {row.extra && <span className="ml-2 text-muted-foreground text-sm">{row.extra}</span>}
        </span>
      ),
    },
  ];

  const medicationData = [
    ...(anamnesis.allergicToMedication ? [{ type: 'Alergia a Medicamentos', severity: 'high' as const, details: anamnesis.medicationAllergy || 'Sim' }] : []),
    ...(anamnesis.takingMedication ? [{ type: 'Uso Contínuo', severity: 'medium' as const, details: anamnesis.medicationDetails || 'Sim' }] : []),
  ];
  const medicationColumns: DataTableColumn<{ type: string; severity: 'high' | 'medium'; details: string }>[] = [
    {
      key: 'type',
      header: '',
      render: (v, row) => (
        <span className="flex w-1/3 items-center">
          {v} {getSeverityDot(true, row.severity)}
        </span>
      ),
    },
    { key: 'details', header: '', render: (v) => capitalizeString(v) },
  ];

  return (
    <div className="flex flex-col gap-6">
      <ItemHeader className="flex flex-row items-center justify-between">
        <ItemTitle className="text-xl">Registro de Anamnese</ItemTitle>
        <ItemActions>
          <Button variant="outline" onClick={() => navigate({ to: '/patient/details/anamnesis', search: { id: patientId } })}>
            <Edit className="mr-2 size-4" /> Editar
          </Button>
        </ItemActions>
      </ItemHeader>

      <div className="flex flex-col gap-6">
        {attentionCount > 0 && (
          <div className="flex items-center gap-2 rounded-md bg-destructive/10 px-4 py-3 text-destructive">
            <Badge variant="red">{attentionCount}</Badge>
            <span className="font-semibold">Pontos de atenção encontrados nesta ficha médica.</span>
          </div>
        )}

        <Item variant="outline" className="flex-col items-start gap-4 p-6">
          <ItemTitle className="font-semibold text-lg tracking-tight">Evolução e Queixa Principal</ItemTitle>
          <DataTable data={complaintData} columns={complaintColumns} searchable={false} showPagination={false} compact bordered={false} />
        </Item>

        <Item variant="outline" className="flex-col items-start gap-4 p-6">
          <ItemTitle className="font-semibold text-lg tracking-tight">Condições Médicas e Doenças</ItemTitle>
          <DataTable data={illnessesData} columns={illnessesColumns} searchable={false} showPagination={false} compact bordered={false} />
        </Item>

        <Item variant="outline" className="flex-col items-start gap-4 p-6">
          <ItemTitle className="font-semibold text-lg tracking-tight">Medicação e Alergias</ItemTitle>
          <DataTable data={medicationData} columns={medicationColumns} searchable={false} showPagination={false} compact bordered={false} />
        </Item>
      </div>
    </div>
  );
};
