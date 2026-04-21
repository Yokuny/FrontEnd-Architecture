import { useEffect, useMemo, useState } from 'react';
import Calender from '@/components/icons/Calender.Icon';
import Down from '@/components/icons/Down.Icon';
import { Button } from '@/components/ui/button';
import { CardContent, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ItemHeader, ItemTitle } from '@/components/ui/item';
import { Separator } from '@/components/ui/separator';
import { t } from '@/lib/helpers/translate.helper';
import type { DbSchedule } from '@/lib/interfaces/schedule.interface';
import { cn } from '@/lib/utils/cn.util';
import { ScheduleCard } from './schedule-card';

const SECTION_NEXT = 'next';
const SECTION_FUTURE = 'future';
const SECTION_PAST = 'past';

interface ScheduleListProps {
  nextEvent: DbSchedule | null;
  futureEvents: DbSchedule[];
  pastEvents: DbSchedule[];
  getRoomName: (roomId: string | undefined) => string | undefined;
  getProfessionalName: (profId: string | undefined) => string | undefined;
}

export function ScheduleList({ nextEvent, futureEvents, pastEvents, getRoomName, getProfessionalName }: ScheduleListProps) {
  const visibleSectionIds = useMemo(() => {
    const ids: string[] = [];
    if (nextEvent) ids.push(SECTION_NEXT);
    if (futureEvents.length > 0) ids.push(SECTION_FUTURE);
    if (pastEvents.length > 0) ids.push(SECTION_PAST);
    return ids;
  }, [nextEvent, futureEvents, pastEvents]);

  const [openSections, setOpenSections] = useState<string[]>(visibleSectionIds);

  useEffect(() => {
    setOpenSections(visibleSectionIds);
  }, [visibleSectionIds]);

  const toggleSection = (id: string) => {
    setOpenSections((prev) => (prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]));
  };

  const expandAll = () => setOpenSections(visibleSectionIds);
  const collapseAll = () => setOpenSections([]);

  const hasAnySchedules = nextEvent || futureEvents.length > 0 || pastEvents.length > 0;

  if (!hasAnySchedules) {
    return (
      <CardContent className="flex flex-col items-center justify-center">
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Calender className="mb-4 size-12 text-muted-foreground" />
          <ItemTitle className="mb-2 text-muted-foreground">{t('no.schedules.found')}</ItemTitle>
          <p className="text-muted-foreground text-sm">{t('no.schedules.description')}</p>
        </div>
      </CardContent>
    );
  }

  return (
    <div className="space-y-2 md:space-y-4">
      <ItemHeader className="mb-2 justify-end px-4 md:px-6">
        <div className="flex gap-1" aria-label={t('schedule.history')}>
          <Button variant="default" size="sm" onClick={expandAll} className="text-muted-foreground text-xs hover:text-foreground">
            {t('expand.all')}
          </Button>
          <Separator orientation="vertical" className="h-4 self-center" />
          <Button variant="default" size="sm" onClick={collapseAll} className="text-muted-foreground text-xs hover:text-foreground">
            {t('collapse.all')}
          </Button>
        </div>
      </ItemHeader>

      {nextEvent && (
        <Collapsible open={openSections.includes(SECTION_NEXT)} onOpenChange={() => toggleSection(SECTION_NEXT)}>
          <CollapsibleTrigger asChild>
            <Button
              variant="secondary"
              className="h-auto w-full items-center justify-between rounded-md border-none bg-transparent px-4 py-3 text-left shadow-none hover:bg-accent/50 md:px-6"
            >
              <CardTitle className="px-2 text-lg text-sky-blue tracking-tight md:text-xl dark:text-primary-blue">{t('next.appointment')}</CardTitle>
              <Down className={cn('size-5 shrink-0 stroke-2 text-muted-foreground transition-transform duration-200', openSections.includes(SECTION_NEXT) && 'rotate-180')} />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="flex flex-col gap-3 p-4 pt-0 md:p-6 md:pt-0">
              <ScheduleCard schedule={nextEvent} getRoomName={getRoomName} getProfessionalName={getProfessionalName} />
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      )}

      {futureEvents.length > 0 && (
        <Collapsible open={openSections.includes(SECTION_FUTURE)} onOpenChange={() => toggleSection(SECTION_FUTURE)}>
          <CollapsibleTrigger asChild>
            <Button
              variant="secondary"
              className="h-auto w-full items-center justify-between rounded-md border-none bg-transparent px-4 py-3 text-left shadow-none hover:bg-accent/50 md:px-6"
            >
              <CardTitle className="px-2 text-lg text-sky-blue tracking-tight md:text-xl dark:text-primary-blue">{t('future.appointments')}</CardTitle>
              <Down className={cn('size-5 shrink-0 stroke-2 text-muted-foreground transition-transform duration-200', openSections.includes(SECTION_FUTURE) && 'rotate-180')} />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="flex flex-col gap-3 p-4 pt-0 md:p-6 md:pt-0">
              <div className="space-y-3">
                {futureEvents.map((event) => (
                  <ScheduleCard key={event._id} schedule={event} getRoomName={getRoomName} getProfessionalName={getProfessionalName} />
                ))}
              </div>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      )}

      {pastEvents.length > 0 && (
        <Collapsible open={openSections.includes(SECTION_PAST)} onOpenChange={() => toggleSection(SECTION_PAST)}>
          <CollapsibleTrigger asChild>
            <Button
              variant="secondary"
              className="h-auto w-full items-center justify-between rounded-md border-none bg-transparent px-4 py-3 text-left shadow-none hover:bg-accent/50 md:px-6"
            >
              <CardTitle className="px-2 text-lg text-sky-blue tracking-tight md:text-xl dark:text-primary-blue">{t('past.appointments')}</CardTitle>
              <Down className={cn('size-5 shrink-0 stroke-2 text-muted-foreground transition-transform duration-200', openSections.includes(SECTION_PAST) && 'rotate-180')} />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="flex flex-col gap-3 p-4 pt-0 md:p-6 md:pt-0">
              <div className="space-y-3">
                {pastEvents.map((event) => (
                  <ScheduleCard key={event._id} schedule={event} getRoomName={getRoomName} getProfessionalName={getProfessionalName} />
                ))}
              </div>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      )}
    </div>
  );
}
