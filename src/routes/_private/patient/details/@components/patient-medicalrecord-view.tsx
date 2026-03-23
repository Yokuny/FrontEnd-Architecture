import { useMemo } from 'react';

import DefaultEmptyData from '@/components/default-empty-data';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { Timeline, TimelineContent, TimelineDate, TimelineHeader, TimelineIndicator, TimelineItem, TimelineSeparator } from '@/components/ui/timeline';
import { currencyFormat, formatDate, statusDictionary } from '@/lib/helpers/formatter.helper';
import type { FullPatient } from '@/lib/interfaces';

type TimelineEvent = {
  id: string;
  title: string;
  description: string;
  date: Date | string;
  type: string;
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

  if (timelineEvents.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <DefaultEmptyData />
        </CardContent>
      </Card>
    );
  }

  const getIndicatorColor = (type: string) => {
    switch (type) {
      case 'anamnesis':
      case 'intraoral':
        return 'bg-blue-500';
      case 'odontogram':
        return 'bg-violet-500';
      case 'schedule':
        return 'bg-amber-500';
      case 'financial':
        return 'bg-green-500';
      case 'patient':
        return 'bg-primary';
      default:
        return 'bg-muted-foreground';
    }
  };

  return (
    <Card>
      <CardContent className="flex flex-col gap-6 p-6">
        <CardTitle className="text-xl">Histórico de Registros</CardTitle>

        <Timeline defaultValue={timelineEvents.length}>
          {timelineEvents.map((event, index) => (
            <TimelineItem key={event.id} step={index + 1}>
              <TimelineSeparator className="bg-border" />
              <TimelineIndicator className={getIndicatorColor(event.type)} />
              <TimelineHeader>
                <TimelineDate>{formatDate(String(event.date))}</TimelineDate>
                <span className="font-semibold text-sm">{event.title}</span>
              </TimelineHeader>
              <TimelineContent>{event.description}</TimelineContent>
            </TimelineItem>
          ))}
        </Timeline>
      </CardContent>
    </Card>
  );
};
