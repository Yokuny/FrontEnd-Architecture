import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import DefaultEmptyData from '@/components/default-empty-data';
import DefaultLoading from '@/components/default-loading';
import Cloud from '@/components/icons/Cloud.Icon';
import Download from '@/components/icons/Download.Icon';
import Save from '@/components/icons/Save.Icon';
import Upload from '@/components/icons/Upload.Icon';
import { Button } from '@/components/ui/button';
import { Card, CardAction, CardContent, CardHeader } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { t } from '@/lib/helpers/translate.helper';
import type { ProcedureData } from '@/lib/interfaces';
import { useProceduresQuery } from '@/query/procedures';
import { useSettingsMutations } from '../profile/@hooks/use-settings-api';
import { SettingsProceduresTable } from './@components/settings-procedures-table';

export const Route = createFileRoute('/_private/settings/procedures/')({
  component: SettingsProcedures,
  staticData: {
    title: t('services'),
    description: t('services.page.description'),
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
          toast.error(t('csv.empty'));
          return;
        }

        const [header, ...rows] = lines;
        if (!header || !header.includes('procedimento') || !header.includes('agrupador')) {
          toast.error(t('csv.invalid.format'));
          return;
        }

        try {
          const data: ProcedureData[] = rows.map((row) => {
            const [procedure, group, costPrice, suggestedPrice, savedPrice, periodicity] = row.split(',').map((val) => val.trim());
            if (!procedure || !group) throw new Error(t('procedure.group.required'));
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
          toast.success(t('csv.import.success'));
        } catch (e: any) {
          toast.error(`${t('csv.process.error')}: ${e.message}`);
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
      toast.success(t('csv.download.success'));
    } catch (e: any) {
      toast.error(`${t('csv.generate.error')}: ${e.message}`);
    }
  };

  const saveProcedure = async () => {
    try {
      const result = await updateProcedures.mutateAsync(procedures);
      setHasChanges(false);
      toast.success(result.message);
    } catch {
      // error handled globally via MutationCache.onError
    }
  };

  const fetchFromBackend = async () => {
    const { data } = await refetch();
    if (data) {
      setProcedures(data);
      setHasChanges(false);
    }
  };

  const handleProcedureUpdate = (updatedData: ProcedureData[]) => {
    setProcedures(updatedData);
    setHasChanges(true);
  };

  return (
    <Card asPage>
      <CardHeader>
        <CardAction>
          {hasChanges && (
            <Button onClick={saveProcedure} disabled={updateProcedures.isPending}>
              {updateProcedures.isPending ? <Spinner className="size-4" /> : <Save className="size-4" />}
              <span className="sr-only md:not-sr-only">{t('save')}</span>
            </Button>
          )}
          <Button onClick={uploadNewCSV}>
            <Upload className="size-4" />
            <span className="sr-only md:not-sr-only">{t('csv.upload')}</span>
          </Button>
          <Button onClick={downloadModelCSV} variant="info">
            <Download className="size-4" />
            <span className="sr-only md:not-sr-only">{t('csv.template')}</span>
          </Button>
          <Button onClick={fetchFromBackend} variant="info">
            <Cloud className="size-4" />
            <span className="sr-only md:not-sr-only">{t('fetch.data')}</span>
          </Button>
        </CardAction>
      </CardHeader>

      <CardContent>
        {isLoading ? <DefaultLoading /> : !procedures?.length ? <DefaultEmptyData /> : <SettingsProceduresTable data={procedures} onUpdate={handleProcedureUpdate} />}
      </CardContent>
    </Card>
  );
}
