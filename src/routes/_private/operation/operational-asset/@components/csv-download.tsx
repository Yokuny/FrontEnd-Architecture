import { format } from 'date-fns';
import { Download } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { DATE_FORMATS, FILENAME_PREFIX } from '../@consts/operational-asset.constants';
import type { RawChartData } from '../@services/operational-asset.service';

interface DownloadOperationalAssetCSVProps {
  data: RawChartData[];
  hasPermissionViewFinancial: boolean;
}

export function DownloadOperationalAssetCSV({ data, hasPermissionViewFinancial }: DownloadOperationalAssetCSVProps) {
  const { t } = useTranslation();

  const handleDownload = () => {
    if (!data || data.length === 0) return;

    const headers = [
      t('status'),
      t('date.start'),
      t('hour.start'),
      t('date.end'),
      t('hour.end'),
      t('duration.in.days'),
      ...(hasPermissionViewFinancial ? [t('profit'), t('loss'), 'PTAX'] : []),
    ];

    const rows = data.map((x) => {
      const startedAt = x.startedAt;
      const endedAt = x.endedAt || new Date();

      return [
        x.status,
        startedAt ? format(startedAt, DATE_FORMATS.ISO) : '',
        startedAt ? format(startedAt, DATE_FORMATS.TIME) : '',
        endedAt ? format(endedAt, DATE_FORMATS.ISO) : '',
        endedAt ? format(endedAt, DATE_FORMATS.TIME) : '',
        ((endedAt.getTime() - (startedAt?.getTime() || 0)) / (1000 * 60 * 60 * 24)).toFixed(2),
        ...(hasPermissionViewFinancial ? [(x.revenueValueBRL || 0).toFixed(2), (x.lossValueBRL || 0).toFixed(2), (x.ptax || 0).toString()] : []),
      ];
    });

    const csvContent = [headers, ...rows].map((e) => e.join(';')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${FILENAME_PREFIX}${format(new Date(), DATE_FORMATS.FILENAME)}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Button variant="outline" onClick={handleDownload} className="gap-2">
      <Download className="size-4" />
    </Button>
  );
}
