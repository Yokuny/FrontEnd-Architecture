import { useNavigate } from '@tanstack/react-router';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import DefaultEmptyData from '@/components/default-empty-data';
import Add from '@/components/icons/Add.Icon';
import Dental from '@/components/icons/Dental.Icon';
import Edit from '@/components/icons/Edit.Icon';
import ToothNumber from '@/components/odontogram/tooth-number';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { BadgeIndicator } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Item, ItemActions, ItemContent, ItemGroup, ItemHeader, ItemTitle } from '@/components/ui/item';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PATCH, request } from '@/lib/api/client.api';
import { capitalizeString, formatDate } from '@/lib/helpers/formatter.helper';
import type { FullPatient, Tooth } from '@/lib/interfaces';
import type { DbOdontogram, ToothFace } from '@/lib/interfaces/odontogram.interface';
import { usePatientQuery } from '@/query/patient';

const permanentTeethNumbers = {
  top: [18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28],
  bottom: [48, 47, 46, 45, 44, 43, 42, 41, 31, 32, 33, 34, 35, 36, 37, 38],
};

const deciduousTeethNumbers = {
  top: [55, 54, 53, 52, 51, 61, 62, 63, 64, 65],
  bottom: [85, 84, 83, 82, 81, 71, 72, 73, 74, 75],
};

const getToothStatus = (odontogram: Tooth[] | null, toothNumber: number) => {
  if (!odontogram) return 'normal' as const;
  const tooth = odontogram.find((t) => t.number === toothNumber);
  const status = tooth?.status || 'normal';
  // ToothNumber component only supports a subset of statuses
  if (status === 'other' || status === 'restored') return 'normal' as const;
  return status;
};

const getFacesWithProcedures = (faces: ToothFace) => {
  const result: { face: string; procedure: string }[] = [];
  for (const [face, value] of Object.entries(faces)) {
    if (value) {
      result.push({ face: capitalizeString(face), procedure: value });
    }
  }
  return result;
};

const OdontogramTeethGrid = ({ odontogram, type }: { odontogram: Tooth[] | null; type: 'permanentes' | 'deciduos' }) => {
  const teeth = type === 'permanentes' ? permanentTeethNumbers : deciduousTeethNumbers;

  return (
    <ScrollArea className="flex w-full flex-col px-2 py-4 pb-12">
      <div className="flex min-w-max justify-center md:gap-2">
        {teeth.top.map((toothNumber) => (
          <div key={toothNumber} className="flex flex-col items-center gap-2">
            <div className="text-muted-foreground text-xs">{toothNumber}</div>
            <ToothNumber toothNumber={toothNumber} status={getToothStatus(odontogram, toothNumber)} />
          </div>
        ))}
      </div>
      <div className="flex min-w-max justify-center md:gap-2">
        {teeth.bottom.map((toothNumber) => (
          <div key={toothNumber} className="flex flex-col-reverse items-center gap-2">
            <div className="text-muted-foreground text-xs">{toothNumber}</div>
            <ToothNumber toothNumber={toothNumber} status={getToothStatus(odontogram, toothNumber)} />
          </div>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
};

const OdontogramLegend = ({ odontogram }: { odontogram: Tooth[] | null }) => {
  const legendItems = [
    { label: 'Cáries e Periodontites', statuses: ['caries', 'periodontitis'], color: 'bg-amber-100' },
    { label: 'Próteses e Implantes', statuses: ['prosthesis', 'implant'], color: 'bg-stone-200' },
    { label: 'Extraídos ou Faltando', statuses: ['missing', 'extracted'], color: 'border bg-transparent' },
    { label: 'Restaurados, Normal e Outros', statuses: ['restored', 'normal', 'other'], color: 'bg-white' },
  ];

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Legenda</TableHead>
          <TableHead>Dentes</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {legendItems.map((item) => (
          <TableRow key={item.label}>
            <TableCell>
              <div className="flex items-center gap-2">
                <div className={`size-4 rounded-sm ${item.color}`} />
                <span>{item.label}</span>
              </div>
            </TableCell>
            <TableCell>
              {odontogram
                ?.filter((tooth) => item.statuses.includes(tooth.status))
                .map((tooth) => (
                  <span key={tooth.number} className="mr-2">
                    {tooth.number}
                  </span>
                ))}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

const OdontogramSummaryContent = ({ patient }: { patient: FullPatient }) => {
  return (
    <Tabs defaultValue="permanentes" className="flex w-full flex-col">
      {(['permanentes', 'deciduos'] as const).map((teeth) => (
        <TabsContent key={teeth} value={teeth} className="flex flex-col items-center gap-6 rounded-lg p-4 md:p-10">
          <OdontogramTeethGrid odontogram={patient.odontogram} type={teeth} />
          <OdontogramLegend odontogram={patient.odontogram} />
        </TabsContent>
      ))}
      <div className="flex w-full justify-center">
        <TabsList className="grid h-auto w-fit grid-cols-2">
          <TabsTrigger value="permanentes">Permanentes</TabsTrigger>
          <TabsTrigger value="deciduos">Decíduos</TabsTrigger>
        </TabsList>
      </div>
    </Tabs>
  );
};

const OdontogramHistorySection = ({ odontograms, patientId }: { odontograms: DbOdontogram[]; patientId: string }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<Record<string, boolean>>({});
  const navigate = useNavigate();
  const { refetch } = usePatientQuery(patientId);

  const sortedOdontograms = useMemo(() => [...odontograms].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()), [odontograms]);

  const handleStatusChange = async (id: string, finished: boolean) => {
    setIsLoading(true);
    try {
      const res = await request(`odontogram/${id}/status`, PATCH({ finished }));
      if (!res.success) throw new Error(res.message);
      toast.success(res.message);
      refetch();
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Erro ao atualizar status');
    } finally {
      setIsLoading(false);
      setIsEditing(null);
    }
  };

  return (
    <Item variant="outline">
      <ItemContent className="flex gap-0">
        <Accordion type="single" collapsible className="w-full">
          {sortedOdontograms.map((el) => (
            <AccordionItem key={el._id} value={el._id} className="w-full rounded-lg py-1">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex w-full items-center justify-between">
                  <BadgeIndicator variant={el.finished ? 'completed' : 'in_progress'}>{el.finished ? 'Finalizado' : 'Em andamento'}</BadgeIndicator>
                  <p className="text-muted-foreground text-sm tabular-nums">{formatDate(String(el.createdAt))}</p>
                </div>
              </AccordionTrigger>
              <AccordionContent className="my-6 space-y-6 px-2">
                <div className="flex items-end gap-2">
                  <div className="flex flex-col gap-2">
                    <span className="text-muted-foreground text-sm">Status do odontograma</span>
                    <Select
                      value={String(selectedStatus[el._id] ?? el.finished)}
                      onValueChange={(value: string) => {
                        setIsEditing(el._id);
                        setSelectedStatus((prev) => ({ ...prev, [el._id]: value === 'true' }));
                      }}
                      disabled={isLoading}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue>{(selectedStatus[el._id] ?? el.finished) ? 'Finalizado' : 'Em andamento'}</SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="true">Finalizado</SelectItem>
                        <SelectItem value="false">Em andamento</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {isEditing === el._id && (
                    <Button onClick={() => handleStatusChange(el._id, selectedStatus[el._id] ?? el.finished)} disabled={isLoading}>
                      Salvar
                    </Button>
                  )}
                  <Button onClick={() => navigate({ to: '/odontogram/details', search: { id: el._id } })}>
                    <Edit className="mr-2 size-4" />
                    Editar
                  </Button>
                </div>

                <div className="w-full">
                  <span className="mb-4 block font-medium text-sm">Procedimentos por Dente</span>
                  <div className="flex w-full max-w-md flex-col gap-4 overflow-y-auto">
                    {el.teeth.map((tooth) => {
                      const facesWithProcedures = getFacesWithProcedures(tooth.faces);
                      if (facesWithProcedures.length === 0) return null;

                      return (
                        <div key={tooth.number} className="flex gap-6 rounded-xl border p-6">
                          <ToothNumber toothNumber={tooth.number} />
                          <div className="flex flex-col gap-2">
                            <div className="flex items-baseline gap-2">
                              <span className="text-muted-foreground text-sm">Dente:</span>
                              <span className="font-medium">{tooth.number}</span>
                            </div>
                            <div className="space-y-1">
                              {facesWithProcedures.map((item) => (
                                <div key={item.face} className="flex items-baseline gap-2">
                                  <span className="font-medium">{item.face}</span>
                                  <span className="text-muted-foreground text-sm">{item.procedure}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </ItemContent>
    </Item>
  );
};

export const PatientOdontogramView = ({ patient }: { patient: FullPatient }) => {
  const navigate = useNavigate();
  const hasOdontograms = patient.odontograms && patient.odontograms.length > 0;

  return (
    <ItemGroup>
      <Item>
        <ItemHeader>
          <ItemTitle className="text-xl">Histórico de Odontogramas</ItemTitle>
          <ItemActions>
            <Button onClick={() => navigate({ to: '/patient/details/odontogram-add', search: { id: patient._id } })}>
              <Add className="size-4" />
              <span className="ml-2 hidden md:block">Adicionar</span>
            </Button>
            <Button onClick={() => navigate({ to: '/patient/details/odontogram-edit', search: { id: patient._id } })}>
              <Dental className="size-4" />
              <span className="ml-2 hidden md:block">Atualizar</span>
            </Button>
          </ItemActions>
        </ItemHeader>

        <ItemContent>
          <OdontogramSummaryContent patient={patient} />
        </ItemContent>
      </Item>

      {hasOdontograms ? (
        <OdontogramHistorySection odontograms={patient.odontograms} patientId={patient._id} />
      ) : (
        <Item>
          <ItemContent>
            <DefaultEmptyData />
          </ItemContent>
        </Item>
      )}
    </ItemGroup>
  );
};
