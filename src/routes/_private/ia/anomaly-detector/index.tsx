import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { z } from 'zod';
import DefaultEmptyData from '@/components/default-empty-data';
import DefaultLoading from '@/components/default-loading';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { AnomalyDetectorList } from './@components/anomaly-detector-list';
import { InputFileCsv } from './@components/input-file-csv';
import { KPI } from './@components/KPI';
import { ModalAnomaly } from './@components/modal-anomaly';
import { useAnomalyDetector } from './@hooks/use-anomaly-detector';

const searchSchema = z.object({
  idEnterprise: z.string().optional(),
});

export const Route = createFileRoute('/_private/ia/anomaly-detector/')({
  component: AnomalyDetectorPage,
  validateSearch: (search) => searchSchema.parse(search),
  staticData: {
    title: 'menu.nexai.anomaly.detector',
    description:
      'Detector de anomalias com inteligência artificial - sistema de machine learning para identificação automática de padrões anômalos em dados de sensores. Aceita upload de CSV ou processamento de dados de fábrica, apresentando KPIs e visualização de anomalias detectadas',
    tags: ['ai', 'ia', 'anomaly', 'anomalia', 'detection', 'detecção', 'machine-learning', 'ml', 'sensor', 'csv', 'upload', 'analytics', 'pattern', 'outlier', 'fabric', 'kpi'],
    examplePrompts: [
      'Detectar anomalias em dados de sensores',
      'Fazer upload de CSV para análise',
      'Ver detalhes de anomalia detectada',
      'Analisar padrões anormais',
      'Processar dados de sensores',
    ],
    searchParams: [{ name: 'idEnterprise', type: 'string', description: 'ID da empresa para análise de anomalias', example: 'uuid-789' }],
    relatedRoutes: [
      { path: '/_private/ia', relation: 'parent', description: 'Hub de IA' },
      { path: '/_private/cmms/sensor', relation: 'sibling', description: 'Gestão de sensores' },
    ],
    entities: ['Sensor', 'Anomaly', 'Enterprise', 'Machine', 'SensorData'],
    capabilities: [
      'Upload de arquivo CSV',
      'Processar dados de sensores',
      'Detectar anomalias com ML',
      'Visualizar KPIs de anomalias',
      'Listar anomalias detectadas',
      'Ver detalhes de anomalia',
      'Análise de padrões',
      'Classificação automática',
    ],
  },
});

function AnomalyDetectorPage() {
  const [modalSensors, setModalSensors] = useState<Record<string, number> | null>(null);

  const { normalizedData, isLoading, isFabric, handleClassify } = useAnomalyDetector();

  return (
    <Card>
      <CardHeader>{!isFabric && <InputFileCsv onHandleData={handleClassify} />}</CardHeader>

      <CardContent>
        {isLoading ? (
          <DefaultLoading />
        ) : !normalizedData.length ? (
          <DefaultEmptyData />
        ) : (
          <>
            <KPI data={normalizedData} />
            <AnomalyDetectorList data={normalizedData} onShowDetails={setModalSensors} />
          </>
        )}
      </CardContent>

      <ModalAnomaly show={!!modalSensors} onClose={() => setModalSensors(null)} sensorsFeatures={modalSensors} />
    </Card>
  );
}
