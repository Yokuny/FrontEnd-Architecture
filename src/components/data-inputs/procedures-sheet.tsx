import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from '@tanstack/react-router';
import { Check, Copy, Pencil, Plus, Settings, Square, SquareCheck } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const procedureSchema = z.object({
  procedure: z.string(),
  price: z.coerce.number().min(0).default(0),
  status: z.string().default('pending'),
});

type NewProcedure = {
  procedure: string;
  price: number;
  status: string;
  periodicity?: string;
};

type ProcedureData = {
  procedure: string;
  costPrice: number;
  suggestedPrice: number;
  savedPrice: number;
  periodicity?: string;
};

type ProcedureSheet = {
  groupName: string;
  procedures: ProcedureData[];
};

type ProceduresSheetProps = {
  handleProcedure: (procedure: NewProcedure) => void;
  disabled?: boolean;
  fetchProcedures?: () => Promise<ProcedureSheet[]>;
  stringPriceClean?: (value: any) => number;
  handleCopy?: (value: string) => Promise<void>;
};

const ProceduresSheet = ({ handleProcedure, disabled, fetchProcedures, stringPriceClean, handleCopy }: ProceduresSheetProps) => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [procedures, setProcedures] = useState([] as ProcedureSheet[]);
  const [procedure, setProcedure] = useState({} as ProcedureData);
  const [btnValue, setBtnValue] = useState({} as NewProcedure);
  const [copiedStates, setCopiedStates] = useState({
    costPrice: false,
    suggestedPrice: false,
    savedPrice: false,
  });

  const form = useForm<z.input<typeof procedureSchema>>({
    resolver: zodResolver(procedureSchema),
    defaultValues: {
      procedure: '',
      price: 0,
      status: 'pending',
    },
    mode: 'onChange',
  });

  const handlePriceClick = (price: number) => {
    form.setValue('price', Number(price));
  };

  const handleCopyWithFeedback = async (price: number, field: keyof typeof copiedStates) => {
    if (handleCopy) {
      await handleCopy(String(price));
    } else {
      await navigator.clipboard.writeText(String(price));
    }
    setCopiedStates((prev) => ({ ...prev, [field]: true }));
    setTimeout(() => {
      setCopiedStates((prev) => ({ ...prev, [field]: false }));
    }, 2000);
  };

  const onSubmit = async (values: z.input<typeof procedureSchema>) => {
    try {
      const cleanPrice = stringPriceClean ? stringPriceClean(values.price) : Number(values.price);
      const body = {
        procedure: procedure.procedure,
        price: values.price ? cleanPrice : 0,
        status: values.status || 'pending',
        periodicity: procedure.periodicity,
      };

      setBtnValue(body);
      handleProcedure(body);
      setOpen(false);
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  useEffect(() => {
    const loadProcedures = async () => {
      if (!fetchProcedures) return;
      setIsLoading(true);
      try {
        const data = await fetchProcedures();
        setProcedures(data);
      } catch (e: any) {
        toast.error(e.message);
      } finally {
        setIsLoading(false);
      }
    };
    loadProcedures();
  }, [fetchProcedures]);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant={btnValue?.procedure ? 'outline' : 'default'}
          size={'default'}
          className={'flex items-center justify-center gap-2 font-normal'}
          aria-expanded={open}
          role="combobox"
          disabled={disabled}
        >
          {btnValue?.procedure ? (
            <>
              <Pencil className="size-5 shrink-0" />
              <span>Editar</span>
            </>
          ) : (
            <>
              <Plus className="size-4 shrink-0 stroke-3" />
              <span>Selecione o procedimento</span>
            </>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col justify-between p-2">
        <div className="space-y-2">
          <SheetHeader>
            <SheetTitle className="text-center text-xl">Procedimentos</SheetTitle>
            <SheetDescription className="text-center">Selecione o procedimentos cadastrados para adicionar ao orçamento</SheetDescription>
          </SheetHeader>

          <Form {...(form as any)}>
            {procedure.costPrice && (
              <div className="space-y-2">
                <div className="space-y-2 rounded-md border pt-2 md:space-y-3 md:pt-4">
                  <div className="flex w-full flex-wrap items-center justify-center gap-3 md:gap-6">
                    <FormField
                      control={form.control as any}
                      name="price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs md:text-md">Preço</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              className="w-28 bg-background md:w-44"
                              placeholder={procedure.savedPrice ? String(procedure.savedPrice) : 'Digite aqui...'}
                              disabled={isLoading}
                              {...field}
                              value={field.value || 0}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control as any}
                      name="status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs md:text-md">Pagamento</FormLabel>
                          <FormControl>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <SelectTrigger className="bg-background">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="pending" disabled={isLoading}>
                                  Pendente
                                </SelectItem>
                                <SelectItem value="paid" disabled={isLoading}>
                                  Pago
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>

                  <Table>
                    <TableHeader>
                      <TableRow className="text-xs">
                        <TableHead className="p-1 text-center">Preço de custo</TableHead>
                        <TableHead className="p-1 text-center">Preço sugerido</TableHead>
                        <TableHead className="p-1 text-center">Preço salvo</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow className="text-xs">
                        <TableCell className="p-0 md:px-0">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="flex w-full gap-2 transition-transform active:scale-90"
                            onClick={(e) => {
                              e.stopPropagation();
                              handlePriceClick(procedure.costPrice);
                              handleCopyWithFeedback(procedure.costPrice, 'costPrice');
                            }}
                          >
                            <span>R$ {procedure.costPrice}</span>
                            <span className="relative">
                              {copiedStates.costPrice ? <Check className="fade-in size-4 animate-in duration-200" /> : <Copy className="fade-in size-4 animate-in duration-200" />}
                            </span>
                          </Button>
                        </TableCell>
                        <TableCell className="p-0 md:px-0">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="flex w-full gap-2 transition-transform active:scale-90"
                            onClick={(e) => {
                              e.stopPropagation();
                              handlePriceClick(procedure.suggestedPrice);
                              handleCopyWithFeedback(procedure.suggestedPrice, 'suggestedPrice');
                            }}
                          >
                            <span>R$ {procedure.suggestedPrice}</span>
                            <span className="relative">
                              {copiedStates.suggestedPrice ? (
                                <Check className="fade-in size-4 animate-in duration-200" />
                              ) : (
                                <Copy className="fade-in size-4 animate-in duration-200" />
                              )}
                            </span>
                          </Button>
                        </TableCell>
                        <TableCell className="p-0 md:px-0">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="flex w-full gap-2 transition-transform active:scale-90"
                            onClick={(e) => {
                              e.stopPropagation();
                              handlePriceClick(procedure.savedPrice);
                              handleCopyWithFeedback(procedure.savedPrice, 'savedPrice');
                            }}
                          >
                            <span>R$ {procedure.savedPrice}</span>
                            <span className="relative">
                              {copiedStates.savedPrice ? <Check className="fade-in size-4 animate-in duration-200" /> : <Copy className="fade-in size-4 animate-in duration-200" />}
                            </span>
                          </Button>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
                <Button variant="default" className="w-full" onClick={form.handleSubmit(onSubmit)} disabled={isLoading}>
                  Adicionar
                </Button>
              </div>
            )}
          </Form>

          <Accordion type="single" collapsible className="rounded-md border p-2 px-4">
            {procedures.map((group) => (
              <AccordionItem key={group.groupName} value={group.groupName}>
                <AccordionTrigger>{group.groupName.toUpperCase()}</AccordionTrigger>
                <AccordionContent className="space-y-1">
                  {group.procedures.map((proc: ProcedureData) => (
                    <div key={proc.procedure} className="flex w-full cursor-pointer items-center justify-between p-1 px-4" onClick={() => setProcedure(proc)}>
                      <span>{proc.procedure}</span>
                      {proc.procedure === procedure.procedure ? <SquareCheck className={'size-5'} /> : <Square className={'size-5'} />}
                    </div>
                  ))}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        <SheetFooter>
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                setOpen(false);
              }}
            >
              Fechar
            </Button>
            {/* TODO: AINDA FALTA MIGRAR ESSA PAGINA */}
            <Link to="/">
              <Button variant="outline">
                <Settings className="size-5" />
              </Button>
            </Link>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default ProceduresSheet;
