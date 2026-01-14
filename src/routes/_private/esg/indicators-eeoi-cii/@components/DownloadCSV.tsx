import { format } from 'date-fns';
import { Download } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import type { EEOICIIIndicator } from '@/hooks/use-esg-api';
import { calculateCiiReq, calculateRating } from '../@consts/cii.utils';
import { FUEL_TYPES_MAP } from '../@consts/fuel.consts';

interface DownloadCSVProps {
  data: EEOICIIIndicator[];
  isShowDetails: boolean;
}

export function DownloadCSV({ data, isShowDetails }: DownloadCSVProps) {
  const { t } = useTranslation();

  const handleDownload = () => {
    if (!data || data.length === 0) return;

    // Get all unique fuel types present in the data to create columns
    const fuelKeys = Array.from(new Set(data.flatMap((x) => Object.keys(x.consumption || {}))));
    const fuelHeaders = fuelKeys.map((k) => FUEL_TYPES_MAP[k] || k);

    const headers = [
      t('travel'),
      ...(isShowDetails ? ['Seq.', 'Oper.'] : []),
      `${t('load.weight')} (Ton)`,
      `${t('distance')} (nm)`,
      `${t('speed')} (kn)`,
      ...fuelHeaders.map((f) => `${f} (Ton)`),
      'CO2 (Ton)',
      'EEOI',
      'CII Reference',
      'CII Attained',
      'CII Required',
      'CII Rating',
    ];

    const rows = data.map((x) => {
      const ciiRequired = calculateCiiReq(x.ciiRef, x.dateTimeEnd);
      const rating = calculateRating(x.ciiAttained, x.ciiRef, x.dateTimeEnd, x.dd);

      const fuelValues = fuelKeys.map((k) => (x.consumption?.[k] || 0).toFixed(2));

      return [
        x.code,
        ...(isShowDetails ? [x.sequence, x.activities] : []),
        x.loadWeight?.toFixed(2) || '0.00',
        x.distance?.toFixed(2) || '0.00',
        (x.timeInVoyage > 0 ? x.distanceInVoyage / x.timeInVoyage : 0).toFixed(1),
        ...fuelValues,
        x.co2?.toFixed(2) || '0.00',
        x.eeoi?.toFixed(2) || '0.00',
        x.ciiRef?.toFixed(4) || '-',
        x.ciiAttained?.toFixed(4) || '-',
        ciiRequired?.toFixed(4) || '-',
        rating,
      ];
    });

    const csvContent = [headers, ...rows].map((e) => e.join(';')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `eeoi_cii_${format(new Date(), 'yyyy-MM-dd-HHmmss')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Button variant="outline" onClick={handleDownload} className="gap-2">
      <Download className="size-4" />
      Download CSV
    </Button>
  );
}
