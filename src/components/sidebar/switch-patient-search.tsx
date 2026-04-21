import { useNavigate } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import Calender from '@/components/icons/Calender.Icon';
import Eye from '@/components/icons/Eye.Icon';
import Patients from '@/components/icons/Patients.Icon';
import Search from '@/components/icons/Search.Icon';
import { Button } from '@/components/ui/button';
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useSidebarToggle } from '@/hooks/use-sidebar-toggle';
import { t } from '@/lib/helpers/translate.helper';
import { usePatientsQuery } from '@/query/patients';

const COMMAND_KEYBOARD_SHORTCUT = 'k';

export function PatientSearchSwitcher() {
  const { setMenuOpen } = useSidebarToggle();
  const [open, setOpen] = useState(false);
  const { data: patients } = usePatientsQuery();
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === COMMAND_KEYBOARD_SHORTCUT && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setOpen((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    setMenuOpen(isOpen);
  };

  const handlePatientSelect = (patientId: string) => {
    navigate({ to: '/patient/details', search: { id: patientId } });
    setOpen(false);
  };

  const handleScheduleClick = (e: React.MouseEvent, patientId: string) => {
    e.stopPropagation();
    navigate({ to: '/schedule/details', search: { id: patientId } });
    setOpen(false);
  };

  const handlePatientClick = (e: React.MouseEvent, patientId: string) => {
    e.stopPropagation();
    navigate({ to: '/patient/details', search: { id: patientId } });
    setOpen(false);
  };

  return (
    <>
      <Button type="button" size="icon" variant="secondary" onClick={() => setOpen(true)} aria-label={t('search.patients')}>
        <Search className="size-4 text-foreground" />
        <span className="sr-only">{t('search.patients')}</span>
      </Button>

      <CommandDialog open={open} onOpenChange={handleOpenChange} title={t('search.patients')} description={t('search.patients.description')}>
        <CommandInput placeholder={t('search.patient.placeholder')} className="h-12" />
        <ScrollArea className="max-h-[400px]">
          <CommandList>
            <CommandEmpty>{t('not.found')}</CommandEmpty>
            <CommandGroup heading={t('patients')}>
              {patients?.map((patient) => (
                <CommandItem
                  key={patient._id}
                  value={`${patient._id} ${patient.name}`}
                  onSelect={() => handlePatientSelect(patient._id)}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <Patients className="size-4" />
                    {patient.name}
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="size-7"
                      aria-label={`${t('schedule.view')} ${patient.name}`}
                      onClick={(e) => handleScheduleClick(e, patient._id)}
                    >
                      <Calender className="size-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="size-7"
                      aria-label={`${t('patient.view')} ${patient.name}`}
                      onClick={(e) => handlePatientClick(e, patient._id)}
                    >
                      <Eye className="size-4" />
                    </Button>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </ScrollArea>
      </CommandDialog>
    </>
  );
}
