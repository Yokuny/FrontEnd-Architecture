import { Activity, Calendar, ClipboardList, Pencil, Plus, Trash2 } from 'lucide-react';
import React from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import DefaultFormLayout, { type FormSection } from '@/components/default-form-layout';
import { EnterpriseSelect } from '@/components/selects/enterprise-select';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { ContractEventFormData, ContractFormData, GroupConsumptionFormData, OperationFormData } from '../@interface/contract';

export function ContractForm() {
  const { t } = useTranslation();
  const { control, watch } = useFormContext<ContractFormData>();
  const competence = watch('competence');

  const sections: FormSection[] = [
    {
      title: t('identification'),
      description: t('view.contract.general.description', 'Basic contract information.'),
      layout: 'horizontal',
      fields: [
        <FormField
          key="idEnterprise"
          control={control}
          name="idEnterprise"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <EnterpriseSelect mode="single" value={field.value} onChange={field.onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />,
        <FormField
          key="description"
          control={control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('description.placeholder')} *</FormLabel>
              <FormControl>
                <Input placeholder={t('description.placeholder')} {...field} maxLength={150} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />,
        <FormField
          key="customer"
          control={control}
          name="customer"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('customer')} *</FormLabel>
              <FormControl>
                <Input placeholder={t('customer')} {...field} maxLength={200} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />,
        <div key="competence-group" className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={control}
            name="competence"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('competence.type')} *</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={t('competence.type')} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="dayInMonth">{t('day.cut')}</SelectItem>
                    <SelectItem value="eof">{t('end.month')}</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          {competence === 'dayInMonth' && (
            <FormField
              control={control}
              name="day"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('day')} *</FormLabel>
                  <Select onValueChange={(v) => field.onChange(Number(v))} value={field.value?.toString()}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t('day')} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Array.from({ length: 28 }, (_, i) => (
                        <SelectItem key={i + 1} value={(i + 1).toString()}>
                          {i + 1}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>,
      ],
    },
    {
      title: t('details'),
      description: t('view.contract.details.description', 'Consumption groups, operations and extra events.'),
      layout: 'vertical',
      fields: [
        <Tabs key="contract-tabs" defaultValue="consumption" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="consumption">
              <ClipboardList className="mr-2 size-4" />
              {t('group.consumption')}
            </TabsTrigger>
            <TabsTrigger value="operations">
              <Activity className="mr-2 size-4" />
              {t('operations')}
            </TabsTrigger>
            <TabsTrigger value="events">
              <Calendar className="mr-2 size-4" />
              {t('events')}
            </TabsTrigger>
          </TabsList>
          <TabsContent value="consumption" className="mt-4">
            <GroupConsumptionTab />
          </TabsContent>
          <TabsContent value="operations" className="mt-4">
            <OperationsTab />
          </TabsContent>
          <TabsContent value="events" className="mt-4">
            <EventsTab />
          </TabsContent>
        </Tabs>,
      ],
    },
  ];

  return <DefaultFormLayout sections={sections} />;
}

function GroupConsumptionTab() {
  const { t } = useTranslation();
  const { control } = useFormContext<ContractFormData>();
  const { fields, append, remove, update } = useFieldArray({
    control,
    name: 'groupConsumption',
  });

  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editingIndex, setEditingIndex] = React.useState<number | null>(null);
  const [tempData, setTempData] = React.useState<GroupConsumptionFormData>({ code: '', description: '', consumption: 0 });

  const handleOpenAdd = () => {
    setEditingIndex(null);
    setTempData({ code: '', description: '', consumption: 0 });
    setDialogOpen(true);
  };

  const handleOpenEdit = (index: number) => {
    setEditingIndex(index);
    setTempData(fields[index]);
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (editingIndex !== null) {
      update(editingIndex, tempData);
    } else {
      append(tempData);
    }
    setDialogOpen(false);
  };

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">{t('code')}</TableHead>
              <TableHead>{t('description')}</TableHead>
              <TableHead className="text-right">{t('consumption')} (m³)</TableHead>
              <TableHead className="w-[100px] text-center">{t('actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {fields.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                  {t('noresults.message')}
                </TableCell>
              </TableRow>
            ) : (
              fields.map((field, index) => (
                <TableRow key={field.id}>
                  <TableCell className="font-medium">{field.code}</TableCell>
                  <TableCell>{field.description}</TableCell>
                  <TableCell className="text-right">{field.consumption.toLocaleString()}</TableCell>
                  <TableCell className="text-center">
                    <div className="flex justify-center gap-2">
                      <Button type="button" variant="ghost" size="icon" onClick={() => handleOpenEdit(index)}>
                        <Pencil className="size-4" />
                      </Button>
                      <Button type="button" variant="ghost" size="icon" className="text-destructive" onClick={() => remove(index)}>
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex justify-center">
        <Button type="button" variant="outline" size="sm" onClick={handleOpenAdd}>
          <Plus className="mr-2 size-4" />
          {t('add')}
        </Button>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingIndex !== null ? t('edit') : t('add')}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <FormLabel>{t('code')}</FormLabel>
              <Input value={tempData.code} onChange={(e) => setTempData({ ...tempData, code: e.target.value })} />
            </div>
            <div className="grid gap-2">
              <FormLabel>{t('description')}</FormLabel>
              <Input value={tempData.description} onChange={(e) => setTempData({ ...tempData, description: e.target.value })} />
            </div>
            <div className="grid gap-2">
              <FormLabel>{t('consumption')} (m³)</FormLabel>
              <Input type="number" value={tempData.consumption} onChange={(e) => setTempData({ ...tempData, consumption: Number(e.target.value) })} />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleSave}>{t('save')}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function OperationsTab() {
  const { t } = useTranslation();
  const { control, watch } = useFormContext<ContractFormData>();
  const { fields, append, remove, update } = useFieldArray({
    control,
    name: 'operations',
  });

  const groupConsumptions = watch('groupConsumption') || [];

  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editingIndex, setEditingIndex] = React.useState<number | null>(null);
  const [tempData, setTempData] = React.useState<OperationFormData>({ idOperation: '', name: '', description: '', idGroupConsumption: '' });

  const handleOpenAdd = () => {
    setEditingIndex(null);
    setTempData({ idOperation: '', name: '', description: '', idGroupConsumption: '' });
    setDialogOpen(true);
  };

  const handleOpenEdit = (index: number) => {
    setEditingIndex(index);
    setTempData(fields[index]);
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (editingIndex !== null) {
      update(editingIndex, tempData);
    } else {
      append(tempData);
    }
    setDialogOpen(false);
  };

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">{t('code')}</TableHead>
              <TableHead>{t('name')}</TableHead>
              <TableHead>{t('description')}</TableHead>
              <TableHead className="text-center">{t('group.consumption')}</TableHead>
              <TableHead className="w-[100px] text-center">{t('actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {fields.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                  {t('noresults.message')}
                </TableCell>
              </TableRow>
            ) : (
              fields.map((field, index) => (
                <TableRow key={field.id}>
                  <TableCell className="font-medium">{field.idOperation}</TableCell>
                  <TableCell>{field.name}</TableCell>
                  <TableCell>{field.description}</TableCell>
                  <TableCell className="text-center">{field.idGroupConsumption}</TableCell>
                  <TableCell className="text-center">
                    <div className="flex justify-center gap-2">
                      <Button type="button" variant="ghost" size="icon" onClick={() => handleOpenEdit(index)}>
                        <Pencil className="size-4" />
                      </Button>
                      <Button type="button" variant="ghost" size="icon" className="text-destructive" onClick={() => remove(index)}>
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex justify-center">
        <Button type="button" variant="outline" size="sm" onClick={handleOpenAdd}>
          <Plus className="mr-2 size-4" />
          {t('add')}
        </Button>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingIndex !== null ? t('edit') : t('add')}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <FormLabel>{t('code')}</FormLabel>
              <Input value={tempData.idOperation} onChange={(e) => setTempData({ ...tempData, idOperation: e.target.value })} />
            </div>
            <div className="grid gap-2">
              <FormLabel>{t('name')}</FormLabel>
              <Input value={tempData.name} onChange={(e) => setTempData({ ...tempData, name: e.target.value })} />
            </div>
            <div className="grid gap-2">
              <FormLabel>{t('description')}</FormLabel>
              <Input value={tempData.description} onChange={(e) => setTempData({ ...tempData, description: e.target.value })} />
            </div>
            <div className="grid gap-2">
              <FormLabel>{t('group.consumption')}</FormLabel>
              <Select onValueChange={(v) => setTempData({ ...tempData, idGroupConsumption: v })} value={tempData.idGroupConsumption}>
                <SelectTrigger>
                  <SelectValue placeholder={t('group.consumption')} />
                </SelectTrigger>
                <SelectContent>
                  {groupConsumptions.map((gc) => (
                    <SelectItem key={gc.code} value={gc.code}>
                      {gc.code} - {gc.description}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleSave}>{t('save')}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function EventsTab() {
  const { t } = useTranslation();
  const { control } = useFormContext<ContractFormData>();
  const { fields, append, remove, update } = useFieldArray({
    control,
    name: 'events',
  });

  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editingIndex, setEditingIndex] = React.useState<number | null>(null);
  const [tempData, setTempData] = React.useState<ContractEventFormData>({ description: '', factor: 0 });

  const handleOpenAdd = () => {
    setEditingIndex(null);
    setTempData({ description: '', factor: 0 });
    setDialogOpen(true);
  };

  const handleOpenEdit = (index: number) => {
    setEditingIndex(index);
    setTempData(fields[index]);
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (editingIndex !== null) {
      update(editingIndex, tempData);
    } else {
      append(tempData);
    }
    setDialogOpen(false);
  };

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('description')}</TableHead>
              <TableHead className="text-right">{t('fine.factor')} (%)</TableHead>
              <TableHead className="w-[100px] text-center">{t('actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {fields.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="h-24 text-center text-muted-foreground">
                  {t('noresults.message')}
                </TableCell>
              </TableRow>
            ) : (
              fields.map((field, index) => (
                <TableRow key={field.id}>
                  <TableCell className="font-medium">{field.description}</TableCell>
                  <TableCell className="text-right">{field.factor}%</TableCell>
                  <TableCell className="text-center">
                    <div className="flex justify-center gap-2">
                      <Button type="button" variant="ghost" size="icon" onClick={() => handleOpenEdit(index)}>
                        <Pencil className="size-4" />
                      </Button>
                      <Button type="button" variant="ghost" size="icon" className="text-destructive" onClick={() => remove(index)}>
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex justify-center">
        <Button type="button" variant="outline" size="sm" onClick={handleOpenAdd}>
          <Plus className="mr-2 size-4" />
          {t('add')}
        </Button>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingIndex !== null ? t('edit') : t('add')}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <FormLabel>{t('description')}</FormLabel>
              <Input value={tempData.description} onChange={(e) => setTempData({ ...tempData, description: e.target.value })} />
            </div>
            <div className="grid gap-2">
              <FormLabel>{t('fine.factor')} (%)</FormLabel>
              <Input type="number" value={tempData.factor} onChange={(e) => setTempData({ ...tempData, factor: Number(e.target.value) })} />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleSave}>{t('save')}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
