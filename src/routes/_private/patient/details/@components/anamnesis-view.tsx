import { useNavigate } from '@tanstack/react-router';
import DefaultFormLayout, { type FormSection } from '@/components/default-form-layout';
import Edit from '@/components/icons/Edit.Icon';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Item, ItemActions, ItemContent, ItemDescription, ItemFooter, ItemHeader, ItemTitle } from '@/components/ui/item';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatDate } from '@/lib/helpers/formatDate.helper';
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
        <Button onClick={() => navigate({ to: '/patient/details/anamnesis', search: { id: patientId } })}>Cadastrar Anamnese</Button>
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

  const hasIllnesses =
    anamnesis.illnesses?.diabetes ||
    anamnesis.illnesses?.tuberculosis ||
    anamnesis.illnesses?.heartProblems ||
    anamnesis.illnesses?.highBloodPressure ||
    anamnesis.illnesses?.arthritis ||
    anamnesis.illnesses?.asthma ||
    anamnesis.illnesses?.kidneyProblems ||
    anamnesis.illnesses?.liverProblems ||
    anamnesis.illnesses?.otherIllnesses;

  const hasMedication = anamnesis.allergicToMedication || anamnesis.takingMedication || anamnesis.underMedicalTreatment;

  const hasSpecialConditions = anamnesis.pregnant || anamnesis.breastfeeding || anamnesis.gumsBleedEasily || anamnesis.sensitiveTeeth;

  const hasHabits = anamnesis.smoker || anamnesis.alcoholConsumer || anamnesis.bitesPenOrPencil || anamnesis.nailsBiting || anamnesis.otherHarmfulHabits;

  const hasCriticalInfo = anamnesis.importantHealthInformation || anamnesis.infectiousDisease;

  const sections: FormSection[] = [];

  if (anamnesis.mainComplaint) {
    sections.push({
      title: 'Queixa Principal',
      fields: [<span key="main-complaint">{capitalizeString(anamnesis.mainComplaint)}</span>],
    });
  }

  if (hasIllnesses) {
    sections.push({
      title: 'Condições Médicas',
      fields: [
        <Table key="illnesses-table" className="border">
          <TableHeader>
            <TableRow>
              <TableHead className="w-5/12 font-semibold text-xs">Condição</TableHead>
              <TableHead className="w-1/12 font-semibold text-xs">Status</TableHead>
              <TableHead className="w-5/12 font-semibold text-xs">Detalhes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {anamnesis.illnesses?.diabetes && (
              <TableRow>
                <TableCell className="text-sm">
                  <span className="flex items-center gap-1">Diabetes{getSeverityDot(true, 'high')}</span>
                </TableCell>
                <TableCell>
                  <Badge variant="red">Sim</Badge>
                </TableCell>
                <TableCell className="text-sm">-</TableCell>
              </TableRow>
            )}
            {anamnesis.illnesses?.tuberculosis && (
              <TableRow>
                <TableCell className="text-sm">
                  <span className="flex items-center gap-1">Tuberculose{getSeverityDot(true, 'high')}</span>
                </TableCell>
                <TableCell>
                  <Badge variant="red">Sim</Badge>
                </TableCell>
                <TableCell className="text-sm">-</TableCell>
              </TableRow>
            )}
            {anamnesis.illnesses?.heartProblems && (
              <TableRow>
                <TableCell className="text-sm">
                  <span className="flex items-center gap-1">Problemas cardíacos{getSeverityDot(true, 'high')}</span>
                </TableCell>
                <TableCell>
                  <Badge variant="red">Sim</Badge>
                </TableCell>
                <TableCell className="text-sm">-</TableCell>
              </TableRow>
            )}
            {anamnesis.illnesses?.highBloodPressure && (
              <TableRow>
                <TableCell className="text-sm">
                  <span className="flex items-center gap-1">Pressão alta{getSeverityDot(true, 'high')}</span>
                </TableCell>
                <TableCell>
                  <Badge variant="red">Sim</Badge>
                </TableCell>
                <TableCell className="text-sm">-</TableCell>
              </TableRow>
            )}
            {anamnesis.illnesses?.arthritis && (
              <TableRow>
                <TableCell className="text-sm">
                  <span className="flex items-center gap-1">Artrite{getSeverityDot(true, 'medium')}</span>
                </TableCell>
                <TableCell>
                  <Badge variant="amber">Sim</Badge>
                </TableCell>
                <TableCell className="text-sm">-</TableCell>
              </TableRow>
            )}
            {anamnesis.illnesses?.asthma && (
              <TableRow>
                <TableCell className="text-sm">
                  <span className="flex items-center gap-1">Asma{getSeverityDot(true, 'medium')}</span>
                </TableCell>
                <TableCell>
                  <Badge variant="amber">Sim</Badge>
                </TableCell>
                <TableCell className="text-sm">-</TableCell>
              </TableRow>
            )}
            {anamnesis.illnesses?.kidneyProblems && (
              <TableRow>
                <TableCell className="text-sm">
                  <span className="flex items-center gap-1">Problemas renais{getSeverityDot(true, 'medium')}</span>
                </TableCell>
                <TableCell>
                  <Badge variant="amber">Sim</Badge>
                </TableCell>
                <TableCell className="text-sm">-</TableCell>
              </TableRow>
            )}
            {anamnesis.illnesses?.liverProblems && (
              <TableRow>
                <TableCell className="text-sm">
                  <span className="flex items-center gap-1">Problemas hepáticos{getSeverityDot(true, 'medium')}</span>
                </TableCell>
                <TableCell>
                  <Badge variant="amber">Sim</Badge>
                </TableCell>
                <TableCell className="text-sm">-</TableCell>
              </TableRow>
            )}
            {anamnesis.illnesses?.otherIllnesses && (
              <TableRow>
                <TableCell className="text-sm">
                  <span className="flex items-center gap-1">Outras doenças{getSeverityDot(true, 'medium')}</span>
                </TableCell>
                <TableCell>
                  <Badge variant="amber">Sim</Badge>
                </TableCell>
                <TableCell className="text-sm">{capitalizeString(anamnesis.illnesses.otherIllnesses)}</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>,
      ],
    });
  }

  if (hasMedication) {
    sections.push({
      title: 'Medicamentos e Alergias',
      fields: [
        <Table key="medication-table" className="border">
          <TableHeader>
            <TableRow>
              <TableHead className="w-5/12 font-semibold text-xs">Aspecto</TableHead>
              <TableHead className="w-1/12 font-semibold text-xs">Status</TableHead>
              <TableHead className="w-5/12 font-semibold text-xs">Detalhes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {anamnesis.allergicToMedication && (
              <TableRow>
                <TableCell className="text-sm">
                  <span className="flex items-center gap-1">Alérgico a medicamentos{getSeverityDot(true, 'high')}</span>
                </TableCell>
                <TableCell>
                  <Badge variant="red">Sim</Badge>
                </TableCell>
                <TableCell className="text-sm">{anamnesis.medicationAllergy ? capitalizeString(anamnesis.medicationAllergy) : '-'}</TableCell>
              </TableRow>
            )}
            {anamnesis.takingMedication && (
              <TableRow>
                <TableCell className="text-sm">
                  <span className="flex items-center gap-1">Tomando medicamentos{getSeverityDot(true, 'medium')}</span>
                </TableCell>
                <TableCell>
                  <Badge variant="amber">Sim</Badge>
                </TableCell>
                <TableCell className="text-sm">{anamnesis.medicationDetails ? capitalizeString(anamnesis.medicationDetails) : '-'}</TableCell>
              </TableRow>
            )}
            {anamnesis.underMedicalTreatment && (
              <TableRow>
                <TableCell className="text-sm">
                  <span className="flex items-center gap-1">Em tratamento médico{getSeverityDot(true, 'medium')}</span>
                </TableCell>
                <TableCell>
                  <Badge variant="amber">Sim</Badge>
                </TableCell>
                <TableCell className="text-sm">{anamnesis.medicalTreatmentDetails ? capitalizeString(anamnesis.medicalTreatmentDetails) : '-'}</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>,
      ],
    });
  }

  if (hasSpecialConditions) {
    sections.push({
      title: 'Condições Especiais',
      fields: [
        <Table key="special-conditions-table" className="border">
          <TableHeader>
            <TableRow>
              <TableHead className="w-5/12 font-semibold text-xs">Condição</TableHead>
              <TableHead className="w-1/12 font-semibold text-xs">Status</TableHead>
              <TableHead className="w-5/12 font-semibold text-xs">Detalhes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {anamnesis.pregnant && (
              <TableRow>
                <TableCell className="text-sm">
                  <span className="flex items-center gap-1">Grávida{getSeverityDot(true, 'medium')}</span>
                </TableCell>
                <TableCell>
                  <Badge variant="amber">Sim</Badge>
                </TableCell>
                <TableCell className="text-sm">{anamnesis.pregnancyMonth ? `${anamnesis.pregnancyMonth}º mês` : '-'}</TableCell>
              </TableRow>
            )}
            {anamnesis.breastfeeding && (
              <TableRow>
                <TableCell className="text-sm">
                  <span className="flex items-center gap-1">Amamentando{getSeverityDot(true, 'medium')}</span>
                </TableCell>
                <TableCell>
                  <Badge variant="amber">Sim</Badge>
                </TableCell>
                <TableCell className="text-sm">-</TableCell>
              </TableRow>
            )}
            {anamnesis.gumsBleedEasily && (
              <TableRow>
                <TableCell className="text-sm">Gengiva sangra facilmente</TableCell>
                <TableCell>
                  <Badge variant="muted">Sim</Badge>
                </TableCell>
                <TableCell className="text-sm">-</TableCell>
              </TableRow>
            )}
            {anamnesis.sensitiveTeeth && (
              <TableRow>
                <TableCell className="text-sm">Dentes sensíveis</TableCell>
                <TableCell>
                  <Badge variant="muted">Sim</Badge>
                </TableCell>
                <TableCell className="text-sm">-</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>,
      ],
    });
  }

  if (hasHabits) {
    sections.push({
      title: 'Hábitos',
      fields: [
        <Table key="habits-table" className="border">
          <TableHeader>
            <TableRow>
              <TableHead className="w-5/12 font-semibold text-xs">Hábito</TableHead>
              <TableHead className="w-1/12 font-semibold text-xs">Status</TableHead>
              <TableHead className="w-5/12 font-semibold text-xs">Detalhes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {anamnesis.smoker && (
              <TableRow>
                <TableCell className="text-sm">Fumante</TableCell>
                <TableCell>
                  <Badge variant="red">Sim</Badge>
                </TableCell>
                <TableCell className="text-sm">-</TableCell>
              </TableRow>
            )}
            {anamnesis.alcoholConsumer && (
              <TableRow>
                <TableCell className="text-sm">Consome álcool</TableCell>
                <TableCell>
                  <Badge variant="amber">Sim</Badge>
                </TableCell>
                <TableCell className="text-sm">-</TableCell>
              </TableRow>
            )}
            {anamnesis.bitesPenOrPencil && (
              <TableRow>
                <TableCell className="text-sm">Morde caneta/lápis</TableCell>
                <TableCell>
                  <Badge variant="muted">Sim</Badge>
                </TableCell>
                <TableCell className="text-sm">-</TableCell>
              </TableRow>
            )}
            {anamnesis.nailsBiting && (
              <TableRow>
                <TableCell className="text-sm">Rói unhas</TableCell>
                <TableCell>
                  <Badge variant="muted">Sim</Badge>
                </TableCell>
                <TableCell className="text-sm">-</TableCell>
              </TableRow>
            )}
            {anamnesis.otherHarmfulHabits && (
              <TableRow>
                <TableCell className="text-sm">Outros hábitos prejudiciais</TableCell>
                <TableCell>
                  <Badge variant="amber">Sim</Badge>
                </TableCell>
                <TableCell className="text-sm">{capitalizeString(anamnesis.otherHarmfulHabits)}</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>,
      ],
    });
  }

  if (hasCriticalInfo) {
    sections.push({
      title: 'Informações Críticas',
      fields: [
        <div key="critical-info" className="space-y-2">
          {anamnesis.importantHealthInformation && (
            <div className="flex items-center justify-between gap-3 rounded-md bg-destructive/5 p-3 px-6">
              <div>
                <div className="flex items-center gap-1">
                  {getSeverityDot(true, 'high')}
                  <span className="text-muted-foreground text-sm">Informações importantes de saúde:</span>
                </div>
                <span className="font-semibold">{capitalizeString(anamnesis.importantHealthInformation)}</span>
              </div>
              <Badge variant="red">Atenção</Badge>
            </div>
          )}
          {anamnesis.infectiousDisease && (
            <div className="flex items-center justify-between gap-3 rounded-md bg-destructive/5 p-3 px-6">
              <div>
                <div className="flex items-center gap-1">
                  {getSeverityDot(true, 'high')}
                  <span className="text-muted-foreground text-sm">Doença infecciosa:</span>
                </div>
                <span className="font-semibold">{capitalizeString(anamnesis.infectiousDisease)}</span>
              </div>
              <Badge variant="red">Atenção</Badge>
            </div>
          )}
        </div>,
      ],
    });
  }

  return (
    <Item>
      <ItemHeader>
        <ItemTitle className="text-xl">Registro de Anamnese</ItemTitle>
        <ItemActions>
          <Button onClick={() => navigate({ to: '/patient/details/anamnesis', search: { id: patientId } })}>
            <Edit className="mr-2 size-4" /> Editar
          </Button>
        </ItemActions>
      </ItemHeader>

      <ItemContent>
        {attentionCount > 0 && (
          <div className="flex items-center gap-2 rounded-md bg-destructive/5 px-4 py-3 text-destructive">
            <Badge variant="red">{attentionCount}</Badge>
            <span className="font-semibold">Pontos de atenção encontrados nesta ficha médica.</span>
          </div>
        )}

        <DefaultFormLayout sections={sections} />
      </ItemContent>

      <ItemFooter>
        <div className="flex w-full items-center justify-end gap-2">
          <ItemDescription>Última atualização:</ItemDescription>
          <ItemTitle>{formatDate(anamnesis.updatedAt)}</ItemTitle>
        </div>
      </ItemFooter>
    </Item>
  );
};
