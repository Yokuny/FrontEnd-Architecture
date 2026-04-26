import { useMemo, useState } from 'react';
import DefaultEmptyData from '@/components/default-empty-data';
import Chat from '@/components/icons/Chat.Icon';
import Cross from '@/components/icons/Cross.Icon';
import { Button } from '@/components/ui/button';
import { Item, ItemContent, ItemDescription, ItemGroup, ItemHeader, ItemTitle } from '@/components/ui/item';
import { Textarea } from '@/components/ui/textarea';
import { formatDate } from '@/lib/helpers/formatDate.helper';
import { currencyFormat, statusDictionary } from '@/lib/helpers/formatter.helper';
import { t } from '@/lib/helpers/translate.helper';
import { removeRecordImage, updateRecordImage } from '@/lib/helpers/upload.helper';
import type { FullPatient } from '@/lib/interfaces';
import { MedicalRecordImageUpload } from './medicalrecord-image-upload';

export const PatientMedicalRecordView = ({ patient }: { patient: FullPatient }) => {
  const [openDescriptions, setOpenDescriptions] = useState<Record<string, boolean>>({});
  const [descriptions, setDescriptions] = useState<Record<string, string>>({});

  const timelineEvents = useMemo(() => {
    const events: TimelineEvent[] = [];

    if (patient.anamnesis && patient.anamnesis.createdAt !== patient.anamnesis.updatedAt) {
      events.push({
        id: 'anamnesis',
        title: t('anamnesis.recorded.title'),
        description: t('anamnesis.recorded.description'),
        date: patient.anamnesis.createdAt,
        type: 'anamnesis',
      });
    }

    if (patient.intraoral && patient.intraoral.createdAt !== patient.intraoral.updatedAt) {
      events.push({
        id: 'intraoral',
        title: t('intraoral.exam.title'),
        description: t('intraoral.exam.description'),
        date: patient.intraoral.createdAt,
        type: 'intraoral',
      });
    }

    patient.odontograms?.forEach((odontogram, index) => {
      events.push({
        id: odontogram._id,
        title: `${t('odontogram')} ${index + 1}`,
        description: t('odontogram.created.description'),
        date: odontogram.createdAt,
        type: 'odontogram',
        image: odontogram.image,
      });
    });

    patient.schedules?.forEach((schedule) => {
      events.push({
        id: schedule._id,
        title: t('appointment.scheduled.title'),
        description: `${statusDictionary(schedule.status)}`,
        date: schedule.start,
        type: 'schedule',
      });
    });

    patient.financials?.forEach((financial, index) => {
      events.push({
        id: financial._id,
        title: `${t('financial.record')} ${index + 1}`,
        description: `${financial.procedures.length} ${t('procedures.count.label')} - ${currencyFormat(financial.procedures.reduce((acc, p) => acc + p.price, 0))}`,
        date: financial.createdAt,
        type: 'financial',
        image: financial.image,
      });
    });

    const sorted = events.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    if (sorted.length > 0) {
      sorted.push({
        id: 'patient-creation',
        title: t('patient.registration.title'),
        description: `${patient.name} ${t('patient.registered.suffix')}`,
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

  const toggleDescription = (id: string) => setOpenDescriptions((prev) => ({ ...prev, [id]: !prev[id] }));

  return (
    <ItemGroup>
      <Item>
        <ItemHeader>
          <ItemTitle className="text-xl">{t('records.history')}</ItemTitle>
        </ItemHeader>

        <ItemContent>
          <ul className="w-full">
            {timelineEvents.map((event, index) => (
              <li key={event.id} className="relative flex flex-col gap-4 border-t py-6 md:flex-row md:gap-10 md:py-8">
                <div className="flex size-10 shrink-0 items-center justify-center bg-muted text-sm tracking-tighter">{String(index + 1).padStart(2, '0')}</div>

                <div className="flex flex-1 flex-col gap-2">
                  <ItemTitle>{event.title}</ItemTitle>
                  <ItemDescription>{formatDate(event.date)}</ItemDescription>
                  <ItemDescription>{event.description}</ItemDescription>

                  {(event.type === 'odontogram' || event.type === 'financial') && (
                    <MedicalRecordImageUpload
                      recordID={event.id}
                      imgURL={event.image || ''}
                      onUploadComplete={handleUploadComplete(event.id, event.type)}
                      onImageRemove={handleImageRemove(event.id, event.type)}
                    />
                  )}

                  <div className="mt-1 flex flex-col gap-2">
                    <Button variant="primary" size="sm" className="w-fit gap-2" onClick={() => toggleDescription(event.id)}>
                      {openDescriptions[event.id] ? <Cross className="size-4" /> : <Chat className="size-4" />}
                      {openDescriptions[event.id] ? t('close.description') : t('add.description')}
                    </Button>

                    {openDescriptions[event.id] && (
                      <Textarea
                        placeholder={t('placeholder.add.description')}
                        value={descriptions[event.id] ?? ''}
                        onChange={(e) => setDescriptions((prev) => ({ ...prev, [event.id]: e.target.value }))}
                      />
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </ItemContent>
      </Item>
    </ItemGroup>
  );
};

type TimelineEvent = {
  id: string;
  title: string;
  description: string;
  date: Date | string;
  type: string;
  image?: string;
};
