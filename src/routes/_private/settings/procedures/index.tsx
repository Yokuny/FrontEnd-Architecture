import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import DefaultEmptyData from '@/components/default-empty-data';
import DefaultLoading from '@/components/default-loading';
import Download from '@/components/icons/Download.Icon';
import Upload from '@/components/icons/Upload.Icon';
import UploadCloud from '@/components/icons/UploadCloud.Icon';
import { Button } from '@/components/ui/button';
import { Card, CardAction, CardContent, CardHeader } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import type { ProcedureData } from '@/lib/interfaces';
import { useProceduresQuery } from '@/query/procedures';
import { useSettingsMutations } from '../profile/@hooks/use-settings-api';
import { SettingsProceduresTable } from './@components/settings-procedures-table';

export const Route = createFileRoute('/_private/settings/procedures/')({
  component: SettingsProcedures,
  staticData: {
    title: 'Serviços',
    description: 'Configure os serviços prestados pela clínica.',
  },
});

export function SettingsProcedures() {
  const { data: initialProcedures, isLoading, refetch } = useProceduresQuery();
  const { updateProcedures } = useSettingsMutations();

  const [procedures, setProcedures] = useState<ProcedureData[]>([]);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (initialProcedures) {
      setProcedures(initialProcedures);
      setHasChanges(false);
    }
  }, [initialProcedures]);

  const uploadNewCSV = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.csv';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        const lines = content.split('\n').filter((line) => line.trim());
        if (lines.length === 0) {
          toast.error('Arquivo CSV vazio');
          return;
        }

        const [header, ...rows] = lines;
        if (!header || !header.includes('procedimento') || !header.includes('agrupador')) {
          toast.error('Formato de CSV inválido. Use o modelo inserido nas planilhas.');
          return;
        }

        try {
          const data: ProcedureData[] = rows.map((row) => {
            const [procedure, group, costPrice, suggestedPrice, savedPrice, periodicity] = row.split(',').map((val) => val.trim());
            if (!procedure || !group) throw new Error('Procedimento e agrupador são obrigatórios');
            return {
              procedure,
              group,
              costPrice: parseFloat(costPrice || '0') || 0,
              suggestedPrice: parseFloat(suggestedPrice || '0') || 0,
              savedPrice: parseFloat(savedPrice || '0') || 0,
              periodicity: periodicity ? parseInt(periodicity, 10) : undefined,
            };
          });

          setProcedures(data);
          setHasChanges(true);
          toast.success('CSV importado com sucesso!');
        } catch (e: any) {
          toast.error(`Erro ao processar CSV: ${e.message}`);
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  const downloadModelCSV = () => {
    try {
      const header = 'procedimento,agrupador,precoCusto,precoSugerido,precoSalvo,periodicity';
      const rows = procedures.map((p) => [p.procedure, p.group, p.costPrice, p.suggestedPrice, p.savedPrice, p.periodicity || ''].join(','));

      const csvContent = [header, ...rows].join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'procedimentos_modelo.csv';
      link.click();
      URL.revokeObjectURL(url);
      toast.success('CSV baixado com sucesso!');
    } catch (e: any) {
      toast.error(`Erro ao gerar CSV: ${e.message}`);
    }
  };

  const saveProcedure = async () => {
    try {
      await updateProcedures.mutateAsync(procedures);
      setHasChanges(false);
      toast.success('Procedimentos atualizados!');
    } catch (e: any) {
      toast.error(e.message || 'Erro ao salvar procedures');
    }
  };

  const handleProcedureUpdate = (updatedData: ProcedureData[]) => {
    setProcedures(updatedData);
    setHasChanges(true);
  };

  return (
    <Card asPage>
      <CardHeader className="sm:flex-row sm:items-center sm:justify-between">
        <CardAction className="sm:self-center">
          <Button onClick={saveProcedure} disabled={!hasChanges || updateProcedures.isPending} className="min-w-[120px]">
            {updateProcedures.isPending && <Spinner className="mr-2 size-4" />}
            Salvar
          </Button>
          <Button onClick={downloadModelCSV} variant="outline" className="flex items-center gap-2">
            <Download className="size-4" />
            <span className="hidden sm:inline">Modelo CSV</span>
          </Button>
          <Button onClick={() => refetch()} variant="outline" className="flex items-center gap-2">
            <UploadCloud className="size-4" />
            <span className="hidden sm:inline">Buscar dados</span>
          </Button>
          <Button onClick={uploadNewCSV} className="flex items-center gap-2">
            <Upload className="size-4" />
            <span className="hidden sm:inline">Upload CSV</span>
          </Button>
        </CardAction>
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <DefaultLoading />
        ) : !procedures?.length ? (
          <DefaultEmptyData />
        ) : (
          <SettingsProceduresTable
            data={procedures}
            hasChanges={hasChanges}
            saveProcedure={saveProcedure}
            onUpdate={handleProcedureUpdate}
            isPending={updateProcedures.isPending}
          />
        )}
      </CardContent>
    </Card>
  );
}
