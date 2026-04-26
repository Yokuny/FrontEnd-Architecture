import { useState } from 'react';
import Down from '@/components/icons/Down.Icon';
import Pulse from '@/components/icons/Pulse.Icon';
import ToothNumber from '@/components/odontogram/tooth-number';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { BadgeIndicator } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Item, ItemContent, ItemDescription, ItemGroup, ItemMedia, ItemSeparator, ItemTitle } from '@/components/ui/item';
import { formatDate } from '@/lib/helpers/formatDate.helper';
import { capitalizeString } from '@/lib/helpers/formatter.helper';
import type { DbOdontogram } from '@/lib/interfaces/odontogram.interface';
import type { PartialPatient } from '@/lib/interfaces/patient.interface';
import type { ProfessionalList } from '@/lib/interfaces/professional.interface';
import { cn } from '@/lib/utils/cn.util';
import { getPatientImage, getPatientName } from '@/query/patients';
import { getProfessionalImage, getProfessionalName } from '@/query/professionals';

interface OdontogramDetailContentProps {
  odontogram: DbOdontogram;
  patients: PartialPatient[] | undefined;
  professionals: ProfessionalList[] | undefined;
}

function getFacesWithProcedures(faces: any) {
  const result: { face: string; procedure: string }[] = [];
  if (!faces) return result;
  for (const [face, value] of Object.entries(faces)) {
    if (value) result.push({ face: capitalizeString(face), procedure: value as string });
  }
  return result;
}

export function OdontogramDetailContent({ odontogram, patients, professionals }: OdontogramDetailContentProps) {
  const patientName = getPatientName(patients, odontogram.Patient);
  const patientImage = getPatientImage(patients, odontogram.Patient);
  const professionalName = getProfessionalName(professionals, odontogram.Professional);
  const professionalImage = getProfessionalImage(professionals, odontogram.Professional);

  const [openTeeth, setOpenTeeth] = useState(true);

  const teethWithProcedures = odontogram.teeth?.filter((tooth) => getFacesWithProcedures(tooth.faces).length > 0) ?? [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <Item className="justify-between">
        <div className="flex flex-col gap-4 md:flex-row md:gap-8">
          <div className="flex items-center gap-3">
            <Avatar className="size-10">
              <AvatarImage src={patientImage} />
              <AvatarFallback>{patientName.slice(0, 2)}</AvatarFallback>
            </Avatar>
            <ItemContent className="gap-1">
              <ItemDescription className="font-medium text-xs uppercase tracking-widest">Paciente</ItemDescription>
              <ItemTitle className="font-semibold text-2xl tracking-tighter">{patientName}</ItemTitle>
            </ItemContent>
          </div>
          <div className="flex items-center gap-3">
            <Avatar className="size-10">
              <AvatarImage src={professionalImage} />
              <AvatarFallback>{professionalName.slice(0, 2)}</AvatarFallback>
            </Avatar>
            <ItemContent className="gap-1">
              <ItemDescription className="font-medium text-xs uppercase tracking-widest">Profissional</ItemDescription>
              <ItemTitle className="font-semibold text-2xl tracking-tighter">{professionalName}</ItemTitle>
            </ItemContent>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <BadgeIndicator variant={odontogram.finished ? 'completed' : 'in_progress'} pulse />
          <ItemTitle className="text-2xl">{odontogram.finished ? 'Finalizado' : 'Em andamento'}</ItemTitle>
        </div>
      </Item>

      {/* Grid strip */}
      <Item className="grid grid-cols-1 rounded-none border-y border-y-border py-6 md:grid-cols-4">
        <ItemContent className="md:border-r">
          <ItemDescription className="font-medium text-xs uppercase tracking-widest">Paciente</ItemDescription>
          <ItemTitle className="text-2xl leading-none tracking-tighter">{patientName}</ItemTitle>
        </ItemContent>
        <ItemContent className="md:border-r md:px-8">
          <ItemDescription className="font-medium text-xs uppercase tracking-widest">Profissional</ItemDescription>
          <ItemTitle className="text-2xl leading-none tracking-tighter">{professionalName}</ItemTitle>
        </ItemContent>
        <ItemContent className="md:border-r md:px-8">
          <ItemDescription className="font-medium text-xs uppercase tracking-widest">Procedimentos</ItemDescription>
          <ItemTitle className="text-2xl tabular-nums leading-none">{teethWithProcedures.length}</ItemTitle>
        </ItemContent>
        <ItemContent className="md:px-8">
          <ItemDescription className="font-medium text-xs uppercase tracking-widest">Data</ItemDescription>
          <ItemTitle className="text-2xl tabular-nums leading-none">{formatDate(odontogram.createdAt)}</ItemTitle>
        </ItemContent>
      </Item>

      {/* Dentes collapsible */}
      <div className="overflow-hidden rounded-lg border bg-card">
        <Collapsible open={openTeeth} onOpenChange={setOpenTeeth}>
          <CollapsibleTrigger asChild>
            <Button
              variant="secondary"
              className="w-full items-center justify-between rounded-none border-none bg-secondary outline-none hover:bg-secondary/80 focus-visible:ring-2"
            >
              <div className="flex items-center gap-3">
                <ItemMedia variant="icon" className="text-foreground">
                  <Pulse className="size-4" />
                </ItemMedia>
                <ItemTitle className="text-base">Dentes</ItemTitle>
              </div>
              <Down className={cn('size-5 stroke-2 text-muted-foreground transition-transform duration-200', openTeeth && 'rotate-180')} />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent>
            {teethWithProcedures.length === 0 ? (
              <Item className="px-4 py-6">
                <ItemDescription>Nenhum procedimento registrado.</ItemDescription>
              </Item>
            ) : (
              <ItemGroup className="gap-0">
                {teethWithProcedures.map((tooth, index) => {
                  const faces = getFacesWithProcedures(tooth.faces);
                  return (
                    <div key={tooth.number}>
                      <Item variant="default" size="sm" className="items-start gap-6 px-4 py-3 hover:bg-secondary">
                        <div className="w-10 shrink-0">
                          <ToothNumber toothNumber={tooth.number} />
                        </div>
                        <ItemContent className="gap-1">
                          <ItemTitle>Dente {tooth.number}</ItemTitle>
                          {faces.map((f) => (
                            <ItemDescription key={f.face}>
                              <span className="font-medium">{f.face}:</span> {f.procedure}
                            </ItemDescription>
                          ))}
                        </ItemContent>
                      </Item>
                      {index < teethWithProcedures.length - 1 && <ItemSeparator />}
                    </div>
                  );
                })}
              </ItemGroup>
            )}
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  );
}
