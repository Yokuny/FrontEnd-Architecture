import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import DefaultEmptyData from '@/components/default-empty-data';
import DefaultLoading from '@/components/default-loading';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { AnomalyDetectorList } from './@components/anomaly-detector-list';
import { Benchmark } from './@components/benchmark';
import { InputFileCsv } from './@components/input-file-csv';
import { ModalAnomaly } from './@components/modal-anomaly';
import { useAnomalyDetector } from './@hooks/use-anomaly-detector';

const searchSchema = z.object({
  idEnterprise: z.string().optional(),
});

export const Route = createFileRoute('/_private/ia/anomaly-detector/')({
  component: AnomalyDetectorPage,
  validateSearch: (search) => searchSchema.parse(search),
});

function AnomalyDetectorPage() {
  const { t } = useTranslation();
  const [modalSensors, setModalSensors] = useState<Record<string, number> | null>(null);

  const { normalizedData, isLoading, isFabric, handleClassify } = useAnomalyDetector();

  return (
    <Card>
      <CardHeader title={t('menu.nexai.anomaly.detector')}>{!isFabric && <InputFileCsv onHandleData={handleClassify} />}</CardHeader>

      <CardContent>
        {isLoading ? (
          <DefaultLoading />
        ) : !normalizedData.length ? (
          <DefaultEmptyData />
        ) : (
          <>
            <Benchmark data={normalizedData} />
            <AnomalyDetectorList data={normalizedData} onShowDetails={setModalSensors} />
          </>
        )}
      </CardContent>

      <ModalAnomaly show={!!modalSensors} onClose={() => setModalSensors(null)} sensorsFeatures={modalSensors} />
    </Card>
  );
}
