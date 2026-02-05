import { Edit2, Eye, Plus, Save, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FenceSelect } from '@/components/selects/fence-select';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Item, ItemContent, ItemDescription, ItemGroup, ItemHeader, ItemTitle } from '@/components/ui/item';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { formatDate } from '@/lib/formatDate';
import { DATES_VOYAGE } from '../@consts';

export function DialogItinerary({ index, data, onChangeData, onDelete, disabled, idEnterprise, idsFences }: ItineraryDialogProps) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<any>(data);

  useEffect(() => {
    setFormData(data);
  }, [data]);

  const handleSave = () => {
    onChangeData(formData);
    setIsOpen(false);
  };

  const updateField = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  const addLoad = () => {
    const loads = [...(formData.load || [])];
    loads.push({ description: '', amount: '', unit: '' });
    updateField('load', loads);
  };

  const removeLoad = (index: number) => {
    const loads = [...(formData.load || [])];
    loads.splice(index, 1);
    updateField('load', loads);
  };

  const updateLoad = (index: number, field: string, value: any) => {
    const loads = [...(formData.load || [])];
    loads[index] = { ...loads[index], [field]: value };
    updateField('load', loads);
  };

  const addObservation = () => {
    const observations = [...(formData.listObservations || [])];
    observations.push({ observation: '', value: '', showBot: false });
    updateField('listObservations', observations);
  };

  const removeObservation = (index: number) => {
    const observations = [...(formData.listObservations || [])];
    observations.splice(index, 1);
    updateField('listObservations', observations);
  };

  const updateObservation = (index: number, field: string, value: any) => {
    const observations = [...(formData.listObservations || [])];
    observations[index] = { ...observations[index], [field]: value };
    updateField('listObservations', observations);
  };

  return (
    <Item>
      <ItemHeader>
        <ItemTitle>
          {index === 0 ? t('source') : t('destiny.port')} #{index}
        </ItemTitle>
        <div className="flex gap-2">
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon" disabled={disabled}>
                <Edit2 className="size-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] max-w-6xl overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {index === 0 ? t('source') : t('destiny.port')} #{index}
                </DialogTitle>
              </DialogHeader>

              <Tabs defaultValue="location" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="location">{t('location')}</TabsTrigger>
                  <TabsTrigger value="load">{t('load')}</TabsTrigger>
                  <TabsTrigger value="observation">{t('observation')}</TabsTrigger>
                </TabsList>

                <TabsContent value="location" className="space-y-6 py-4">
                  <FenceSelect
                    mode="single"
                    idEnterprise={idEnterprise}
                    value={formData.idFence}
                    notId={idsFences}
                    typeFence="port"
                    onChange={(val) => updateField('idFence', val)}
                    label={t(index === 0 ? 'source' : 'destiny.port')}
                    placeholder={t(index === 0 ? 'source' : 'destiny.port')}
                    disabled={disabled}
                  />

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {DATES_VOYAGE.map((dateKey) => (
                      <Item variant="outline" key={dateKey} className="flex-row items-center">
                        <div>
                          <Label className="font-semibold">{t(dateKey.toUpperCase())}</Label>
                          <ItemContent className="flex-row gap-2">
                            <div>
                              <Label className="text-muted-foreground text-xs">{t('date')}</Label>
                              <Input type="date" value={formData[`${dateKey}Date`] || ''} onChange={(e) => updateField(`${dateKey}Date`, e.target.value)} />
                            </div>
                            <div>
                              <Label className="text-muted-foreground text-xs">{t('time')}</Label>
                              <Input type="time" value={formData[`${dateKey}Time`] || ''} onChange={(e) => updateField(`${dateKey}Time`, e.target.value)} />
                            </div>
                          </ItemContent>
                        </div>
                        <ItemContent>
                          <Label className="flex items-center gap-1">
                            <Eye className="size-3" />
                            {t('show')}
                          </Label>
                          <ItemContent className="flex-row">
                            <Checkbox checked={!!formData[`showBot${dateKey}`]} onCheckedChange={(checked) => updateField(`showBot${dateKey}`, !!checked)} disabled={disabled} />
                            <ItemDescription className="font-medium text-xs">BOT</ItemDescription>
                          </ItemContent>
                        </ItemContent>
                      </Item>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="load" className="space-y-4 py-4">
                  <ItemGroup>
                    {(formData.load || []).map((item: any, idx: number) => (
                      <Item variant="outline" key={`${idx}${item?.id}`}>
                        <div className="flex w-1/4 flex-col gap-1">
                          <Label>{t('description')}</Label>
                          <Input value={item.description || ''} onChange={(e) => updateLoad(idx, 'description', e.target.value)} placeholder={t('description')} />
                        </div>
                        <div className="flex w-1/4 flex-col gap-1">
                          <Label>{t('quantity')}</Label>
                          <Input type="number" value={item.amount || ''} onChange={(e) => updateLoad(idx, 'amount', e.target.value)} placeholder={t('quantity')} />
                        </div>
                        <div className="flex w-1/4 flex-col gap-1">
                          <Label>{t('unit')}</Label>
                          <Input value={item.unit || ''} onChange={(e) => updateLoad(idx, 'unit', e.target.value)} placeholder={t('unit')} />
                        </div>
                        <div className="ml-auto">
                          <Button size="icon" className="text-destructive" onClick={() => removeLoad(idx)}>
                            <Trash2 className="size-4" />
                          </Button>
                        </div>
                      </Item>
                    ))}
                    <div className="flex justify-center">
                      <Button variant="outline" onClick={addLoad}>
                        <Plus className="mr-2 size-4" />
                        {t('add.load')}
                      </Button>
                    </div>
                  </ItemGroup>
                </TabsContent>

                <TabsContent value="observation" className="space-y-4 py-4">
                  <ItemGroup>
                    {(formData.listObservations || []).map((item: any, idx: number) => (
                      <Item variant="outline" key={`${idx}${item?.id}`}>
                        <div className="flex w-1/2 flex-col gap-1">
                          <Label>{t('observation')}</Label>
                          <Textarea
                            value={item.observation || ''}
                            onChange={(e) => updateObservation(idx, 'observation', e.target.value)}
                            placeholder={t('observation')}
                            className="min-h-[100px]"
                          />
                        </div>
                        <div className="flex max-w-40 flex-col gap-2">
                          <div className="flex flex-col gap-1">
                            <Label>{t('value')}</Label>
                            <Input type="number" value={item.value || ''} onChange={(e) => updateObservation(idx, 'value', e.target.value)} placeholder={t('value')} />
                          </div>
                          <div className="flex items-center gap-2">
                            <Checkbox id={`showBot-${idx}`} checked={!!item.showBot} onCheckedChange={(checked) => updateObservation(idx, 'showBot', !!checked)} />
                            <Label htmlFor={`showBot-${idx}`} className="flex items-center gap-1">
                              <Eye className="size-4" />
                              BOT
                            </Label>
                          </div>
                        </div>
                        <div className="ml-auto">
                          <Button size="icon" className="text-destructive" onClick={() => removeObservation(idx)}>
                            <Trash2 className="size-4" />
                          </Button>
                        </div>
                      </Item>
                    ))}
                    <div className="flex justify-center">
                      <Button variant="outline" onClick={addObservation}>
                        <Plus className="mr-2 size-4" />
                        {t('add')} {t('observation')}
                      </Button>
                    </div>
                  </ItemGroup>
                </TabsContent>
              </Tabs>

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsOpen(false)}>
                  {t('cancel')}
                </Button>
                <Button onClick={handleSave}>
                  <Save className="mr-2 size-4" />
                  {t('save')}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Button variant="ghost" size="icon" className="text-destructive" onClick={onDelete} disabled={disabled}>
            <Trash2 className="size-4" />
          </Button>
        </div>
      </ItemHeader>
      <ItemContent>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="col-span-1 md:col-span-2 lg:col-span-4">
            <ItemTitle>{t('local')}</ItemTitle>
            <ItemDescription>{data.where || '-'}</ItemDescription>
          </div>
          {DATES_VOYAGE.map((dateKey) => (
            <div key={dateKey}>
              <ItemTitle>{t(dateKey.toUpperCase())}</ItemTitle>
              <ItemDescription>
                {data[`${dateKey}Date`] ? formatDate(data[`${dateKey}Date`], 'dd MM yyyy') : '-'} {data[`${dateKey}Time`] || ''}
              </ItemDescription>
            </div>
          ))}
        </div>
      </ItemContent>
    </Item>
  );
}

interface ItineraryDialogProps {
  index: number;
  data: any;
  onChangeData: (data: any) => void;
  onDelete: () => void;
  disabled?: boolean;
  idEnterprise?: string;
  idsFences?: string[];
}
