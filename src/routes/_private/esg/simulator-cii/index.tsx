import { createFileRoute } from '@tanstack/react-router';
import { Droplet, Navigation, Route as RouteIcon, Scale } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import DefaultFormLayout, { type FormSection } from '@/components/default-form-layout';
import { VesselCIIReferenceSelect } from '@/components/selects';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Field, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { calculateRating, getRatingColor, getReferenceAC } from '../indicators-eeoi-cii/@consts/cii.utils';

export const Route = createFileRoute('/_private/esg/simulator-cii/')({
  component: SimulatorCIIPage,
});

const yearsFactor = [
  { year: 2024, factor: 7 },
  { year: 2025, factor: 9 },
  { year: 2026, factor: 11 },
  { year: 2027, factor: 13 },
];

function SimulatorCIIPage() {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    typeVessel: '' as string,
    deadWeight: 0,
    grossTonage: 0,
    consumptionIFO: 0,
    consumptionMDO: 0,
    distance: 0,
  });

  const handleChange = (name: string, value: any) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const results = useMemo(() => {
    const { typeVessel, deadWeight, grossTonage, consumptionIFO, consumptionMDO, distance } = formData;
    const ref = getReferenceAC(typeVessel, deadWeight, grossTonage);
    if (!ref || !ref.capacity || distance === 0 || deadWeight === 0) return null;

    const ciiRef = ref.a * ref.capacity ** (ref.c * -1);
    const emissionsCo2 = consumptionIFO * 3.1166 + consumptionMDO * 2.68;
    const ciiAttained = (emissionsCo2 / (deadWeight * distance)) * 10 ** 6;

    return { ciiRef, ciiAttained, dd: ref.dd };
  }, [formData]);

  const formSections: FormSection[] = [
    {
      title: t('vessel.characteristics'),
      fields: [
        <div key="vessel-main" className="grid grid-cols-1 gap-6">
          <VesselCIIReferenceSelect mode="single" value={formData.typeVessel} onChange={(v) => handleChange('typeVessel', v)} />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Field className="gap-2">
              <FieldLabel className="flex items-center gap-2">
                <Scale className="size-4" />
                {t('deadweight')}
              </FieldLabel>
              <Input
                type="number"
                placeholder="0.00"
                value={formData.deadWeight || ''}
                onChange={(e) => handleChange('deadWeight', Number(e.target.value))}
                className="bg-background"
              />
            </Field>

            <Field className="gap-2">
              <FieldLabel className="flex items-center gap-2">
                <Scale className="size-4" />
                {t('gross.tonage')}
              </FieldLabel>
              <Input
                type="number"
                placeholder="0.00"
                value={formData.grossTonage || ''}
                onChange={(e) => handleChange('grossTonage', Number(e.target.value))}
                className="bg-background"
              />
            </Field>
          </div>
        </div>,
      ],
    },
    {
      title: t('performance'),
      fields: [
        <div key="performance-data" className="grid grid-cols-1 gap-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Field className="gap-2">
              <FieldLabel className="flex items-center gap-2">
                <Droplet className="size-4" />
                {t('consume')} Ton (IFO)
              </FieldLabel>
              <Input
                type="number"
                step="0.001"
                placeholder="0.000"
                value={formData.consumptionIFO || ''}
                onChange={(e) => handleChange('consumptionIFO', Number(e.target.value))}
                className="bg-background"
              />
            </Field>

            <Field className="gap-2">
              <FieldLabel className="flex items-center gap-2 text-muted-foreground">
                <Droplet className="size-4" />
                {t('consume')} Ton (MDO)
              </FieldLabel>
              <Input
                type="number"
                step="0.001"
                placeholder="0.000"
                value={formData.consumptionMDO || ''}
                onChange={(e) => handleChange('consumptionMDO', Number(e.target.value))}
                className="bg-background"
              />
            </Field>
          </div>

          <Field className="gap-2">
            <FieldLabel className="flex items-center gap-2">
              <RouteIcon className="size-4" />
              {t('distance')} (nm)
            </FieldLabel>
            <Input
              type="number"
              step="0.001"
              placeholder="0.000"
              value={formData.distance || ''}
              onChange={(e) => handleChange('distance', Number(e.target.value))}
              className="bg-background"
            />
          </Field>
        </div>,
      ],
    },
  ];

  return (
    <Card>
      <CardHeader title={t('simulator.cii')} />
      <CardContent className="p-0 flex flex-col">
        <DefaultFormLayout sections={formSections} />

        {/* Results Section */}
        <div className="flex flex-col gap-6 px-6 md:px-10 pb-10">
          <div className="flex items-center gap-2 border-b pb-2">
            <Navigation className="size-5 text-primary" />
            <h3 className="font-bold text-lg">{t('results')}</h3>
          </div>

          {!results ? (
            <div className="flex flex-col items-center justify-center min-h-[300px] text-muted-foreground space-y-4 rounded-xl border border-dashed bg-secondary/5">
              <Navigation className="size-12 opacity-20" />
              <p className="italic">{t('enter.data.to.see.results')}</p>
            </div>
          ) : (
            <div className="space-y-8 animate-in fade-in duration-500">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-6 rounded-xl border bg-card shadow-sm flex flex-col items-center justify-center text-center">
                  <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest mb-1">CII Reference</p>
                  <p className="text-3xl font-mono font-bold text-primary">
                    {new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 4, maximumFractionDigits: 4 }).format(results.ciiRef)}
                  </p>
                </div>
                <div className="p-6 rounded-xl border bg-card shadow-sm flex flex-col items-center justify-center text-center">
                  <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest mb-1">CII Attained</p>
                  <p className="text-3xl font-mono font-bold text-primary">
                    {new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 4, maximumFractionDigits: 4 }).format(results.ciiAttained)}
                  </p>
                </div>
              </div>

              <div className="rounded-xl border shadow-sm overflow-hidden">
                <Table>
                  <TableHeader className="bg-secondary/30">
                    <TableRow>
                      {yearsFactor.map((yf) => (
                        <TableHead key={yf.year} className="text-center font-bold">
                          {yf.year}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow className="hover:bg-transparent">
                      {yearsFactor.map((yf) => {
                        const ciiReq = results.ciiRef * ((100 - yf.factor) / 100);
                        const rating = calculateRating(results.ciiAttained, results.ciiRef, `${yf.year}-01-01`, results.dd);

                        return (
                          <TableCell key={yf.year} className="text-center py-10">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <div className="cursor-help flex flex-col items-center gap-3">
                                    <Badge className={cn('text-xl px-8 py-2 font-bold shadow-md', getRatingColor(rating))}>{rating}</Badge>
                                    <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">RED. {yf.factor}%</p>
                                  </div>
                                </TooltipTrigger>
                                <TooltipContent className="p-4 space-y-2">
                                  <p className="text-xs font-bold border-b pb-2 mb-2">
                                    {yf.year} Analysis ({yf.factor}% Reduction)
                                  </p>
                                  <div className="grid grid-cols-2 gap-x-6 gap-y-2">
                                    <span className="text-[10px] text-muted-foreground uppercase font-bold">CII Required:</span>
                                    <span className="text-[10px] font-mono font-bold text-primary">{ciiReq.toFixed(4)}</span>
                                    <span className="text-[10px] text-muted-foreground uppercase font-bold">CII Attained:</span>
                                    <span className="text-[10px] font-mono font-bold text-primary">{results.ciiAttained.toFixed(4)}</span>
                                  </div>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <div className="w-full flex justify-between items-center text-[10px] text-muted-foreground uppercase font-bold tracking-widest">
          <span>Carbon Intensity Indicator Simulator</span>
          <span>IMO MARPOL Annex VI</span>
        </div>
      </CardFooter>
    </Card>
  );
}
