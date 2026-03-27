import { useMemo } from 'react';

import DefaultEmptyData from '@/components/default-empty-data';
import { Item, ItemContent, ItemDescription, ItemGroup, ItemHeader, ItemTitle } from '@/components/ui/item';
import { Timeline } from '@/components/ui/timeline';
import { formatDate } from '@/lib/helpers/formatDate.helper';
import { currencyFormat, statusDictionary } from '@/lib/helpers/formatter.helper';
import { removeRecordImage, updateRecordImage } from '@/lib/helpers/upload.helper';
import type { FullPatient } from '@/lib/interfaces';

import { MedicalRecordImageUpload } from './medicalrecord-image-upload';

type TimelineEvent = {
  id: string;
  title: string;
  description: string;
  date: Date | string;
  type: string;
  image?: string;
};

export const PatientMedicalRecordView = ({ patient }: { patient: FullPatient }) => {
  const timelineEvents = useMemo(() => {
    const events: TimelineEvent[] = [];

    if (patient.anamnesis && patient.anamnesis.createdAt !== patient.anamnesis.updatedAt) {
      events.push({
        id: 'anamnesis',
        title: 'Anamnese Registrada',
        description: 'Anamnese do paciente foi preenchida e registrada',
        date: patient.anamnesis.createdAt,
        type: 'anamnesis',
      });
    }

    if (patient.intraoral && patient.intraoral.createdAt !== patient.intraoral.updatedAt) {
      events.push({
        id: 'intraoral',
        title: 'Exame Intraoral',
        description: 'Exame intraoral foi realizado e documentado',
        date: patient.intraoral.createdAt,
        type: 'intraoral',
      });
    }

    patient.odontograms?.forEach((odontogram, index) => {
      events.push({
        id: odontogram._id,
        title: `Odontograma ${index + 1}`,
        description: 'Odontograma criado no sistema',
        date: odontogram.createdAt,
        type: 'odontogram',
        image: odontogram.image,
      });
    });

    patient.schedules?.forEach((schedule) => {
      events.push({
        id: schedule._id,
        title: 'Consulta Agendada',
        description: `${statusDictionary(schedule.status)}`,
        date: schedule.start,
        type: 'schedule',
      });
    });

    patient.financials?.forEach((financial, index) => {
      events.push({
        id: financial._id,
        title: `Registro Financeiro ${index + 1}`,
        description: `${financial.procedures.length} procedimento(s) - ${currencyFormat(financial.procedures.reduce((acc, p) => acc + p.price, 0))}`,
        date: financial.createdAt,
        type: 'financial',
        image: financial.image,
      });
    });

    const sorted = events.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    if (sorted.length > 0) {
      sorted.push({
        id: 'patient-creation',
        title: 'Cadastro do Paciente',
        description: `${patient.name} foi cadastrado no sistema`,
        date: patient.createdAt,
        type: 'patient',
      });
    }

    return sorted;
  }, [patient]);

  const handleUploadComplete = (recordID: string, recordType: string) => async (imageUrl: string) => {
    await updateRecordImage(recordID, recordType as 'odontogram' | 'financial', imageUrl);
  };

  const handleImageRemove = (recordID: string, recordType: string) => async () => {
    await removeRecordImage(recordID, recordType as 'odontogram' | 'financial');
  };

  if (timelineEvents.length === 0) {
    return (
      <ItemGroup>
        <Item>
          <ItemContent>
            <DefaultEmptyData />
          </ItemContent>
        </Item>
      </ItemGroup>
    );
  }

  const timelineData = timelineEvents.map((event) => ({
    title: event.title,
    content: (
      <div>
        <ItemTitle className="mb-2">{formatDate(event.date)}</ItemTitle>
        <ItemDescription>{event.description}</ItemDescription>

        {(event.type === 'odontogram' || event.type === 'financial') && event.id && (
          <MedicalRecordImageUpload
            recordID={event.id}
            imgURL={event.image || ''}
            onUploadComplete={handleUploadComplete(event.id, event.type)}
            onImageRemove={handleImageRemove(event.id, event.type)}
          />
        )}
      </div>
    ),
  }));

  return (
    <ItemGroup>
      <Item>
        <ItemHeader>
          <ItemTitle className="text-xl">Histórico de Registros</ItemTitle>
        </ItemHeader>

        <ItemContent>
          <div className="relative w-full overflow-clip">
            <Timeline data={timelineData} />
          </div>
        </ItemContent>
      </Item>
    </ItemGroup>
  );
};
