import { Edit } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '@/components/ui/table';
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

export const PatientAnamnesisView = ({ anamnesis }: { anamnesis?: Anamnesis }) => {
  if (!anamnesis || anamnesis.updatedAt === anamnesis.createdAt) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center p-12 text-center">
          <CardTitle className="mb-4 text-xl">Registro de Anamnese</CardTitle>
          <p className="mb-4 text-muted-foreground">Nenhuma anamnese cadastrada para este paciente.</p>
          <Button onClick={() => alert('Em breve: Formulário de Anamnese')} variant="outline">
            Cadastrar Anamnese
          </Button>
        </CardContent>
      </Card>
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

  return (
    <Card className="flex flex-col gap-6">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl">Registro de Anamnese</CardTitle>
        <Button variant="outline" onClick={() => alert('Em breve: Formulário de Anamnese')}>
          <Edit className="mr-2 size-4" /> Editar
        </Button>
      </CardHeader>

      <CardContent className="flex flex-col gap-6">
        {attentionCount > 0 && (
          <div className="flex items-center gap-2 rounded-md bg-destructive/10 px-4 py-3 text-destructive">
            <Badge variant="error">{attentionCount}</Badge>
            <span className="font-semibold">Pontos de atenção encontrados nesta ficha médica.</span>
          </div>
        )}

        <div className="space-y-4 rounded-md border p-6">
          <h3 className="font-semibold text-lg tracking-tight">Evolução e Queixa Principal</h3>
          <Table>
            <TableBody>
              {anamnesis.mainComplaint && (
                <TableRow>
                  <TableCell className="w-1/3 font-medium">Queixa Principal</TableCell>
                  <TableCell>{capitalizeString(anamnesis.mainComplaint)}</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="space-y-4 rounded-md border p-6">
          <h3 className="font-semibold text-lg tracking-tight">Condições Médicas e Doenças</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableCell className="font-semibold">Condição</TableCell>
                <TableCell className="font-semibold">Status</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {String(anamnesis.illnesses?.diabetes) === 'true' && (
                <TableRow>
                  <TableCell className="flex items-center">Diabetes {getSeverityDot(true, 'high')}</TableCell>
                  <TableCell>
                    <Badge variant="error">Sim</Badge>
                  </TableCell>
                </TableRow>
              )}
              {String(anamnesis.illnesses?.heartProblems) === 'true' && (
                <TableRow>
                  <TableCell className="flex items-center">Problemas Cardíacos {getSeverityDot(true, 'high')}</TableCell>
                  <TableCell>
                    <Badge variant="error">Sim</Badge>
                  </TableCell>
                </TableRow>
              )}
              {String(anamnesis.illnesses?.highBloodPressure) === 'true' && (
                <TableRow>
                  <TableCell className="flex items-center">Hipertensão {getSeverityDot(true, 'high')}</TableCell>
                  <TableCell>
                    <Badge variant="error">Sim</Badge>
                  </TableCell>
                </TableRow>
              )}
              {String(anamnesis.illnesses?.asthma) === 'true' && (
                <TableRow>
                  <TableCell className="flex items-center">Asma {getSeverityDot(true, 'medium')}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">Sim</Badge>
                  </TableCell>
                </TableRow>
              )}
              {anamnesis.illnesses?.otherIllnesses && (
                <TableRow>
                  <TableCell className="flex items-center">Outras Doenças {getSeverityDot(true, 'medium')}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">Sim</Badge>
                    <span className="ml-2 text-muted-foreground text-sm">{anamnesis.illnesses.otherIllnesses}</span>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="space-y-4 rounded-md border p-6">
          <h3 className="font-semibold text-lg tracking-tight">Medicação e Alergias</h3>
          <Table>
            <TableBody>
              {anamnesis.allergicToMedication && (
                <TableRow>
                  <TableCell className="flex w-1/3 items-center">Alergia a Medicamentos {getSeverityDot(true, 'high')}</TableCell>
                  <TableCell>{capitalizeString(anamnesis.medicationAllergy || 'Sim')}</TableCell>
                </TableRow>
              )}
              {anamnesis.takingMedication && (
                <TableRow>
                  <TableCell className="flex w-1/3 items-center">Uso Contínuo {getSeverityDot(true, 'medium')}</TableCell>
                  <TableCell>{capitalizeString(anamnesis.medicationDetails || 'Sim')}</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
