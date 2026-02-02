import { FileUp, X } from 'lucide-react';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { SupplierSelect } from '@/components/selects/supplier-select';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { ItemTitle } from '@/components/ui/item';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { useFasOsExistsValidation } from '@/hooks/use-fas-api';
import { FAS_PARTIAL_EXECUTION_KEYS, FAS_RATING_QUESTIONS_COUNT, FAS_RATINGS_ALT_KEYS, FAS_RATINGS_KEYS, ORDER_DESCRIPTION_TEMPLATE } from '../@consts/fas.consts';
import type { FasOrderFormValues } from '../@interface/fas-form.schema';
import { isDockingRegularizationHeader, isRegularizationHeader, maskJobName, maskOsName } from '../@utils/fas.utils';

interface ModalAddFasServiceProps {
  show: boolean;
  onClose: () => void;
  onAdd: (order: FasOrderFormValues) => void;
  headerType?: string;
  idEnterprise?: string;
}

const INITIAL_ORDER_STATE: FasOrderFormValues = {
  name: '',
  job: '',
  jobRequired: true,
  description: ORDER_DESCRIPTION_TEMPLATE,
  materialFas: 'Não',
  materialFasCode: '',
  onboardMaterial: 'Não',
  rmrb: 'Não',
  rmrbCode: '',
  files: [],
  supplierCanView: true,
  partial: 'complete.execution',
  rating: '',
  ratingDescription: '',
  questions: {},
};

export function ModalAddFasService({ show, onClose, onAdd, headerType, idEnterprise }: ModalAddFasServiceProps) {
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [order, setOrder] = useState<FasOrderFormValues>(INITIAL_ORDER_STATE);
  const [activeTab, setActiveTab] = useState('service');
  const [isCheckingOs, setIsCheckingOs] = useState(false);

  const { refetch: checkOsExistence } = useFasOsExistsValidation({
    search: order.name,
    idEnterprise,
  });

  const onChange = (prop: keyof FasOrderFormValues, value: any) => {
    setOrder((prev) => {
      const next = { ...prev, [prop]: value };
      if (prop === 'materialFas' && (value === 'Não' || value === 'N/A')) {
        next.materialFasCode = '';
      }
      if (prop === 'rmrb' && (value === 'Não' || value === 'N/A')) {
        next.rmrbCode = '';
      }
      return next;
    });
  };

  const isFirstPartFull = () => {
    const hasBasicRequiredFields = order.name.length >= 8 && order.description.length > 0 && !!order.onboardMaterial && !!order.materialFas && !!order.rmrb;

    if (!hasBasicRequiredFields) return false;

    if (order.jobRequired && (!order.job || order.job.length < 4)) return false;

    if (order.materialFas === 'Sim' && !order.materialFasCode) return false;
    if (order.rmrb === 'Sim' && !order.rmrbCode) return false;

    // Regularization specific checks
    if (isRegularizationHeader(headerType)) {
      if (!order.supplierData) return false;
      if (!order.requestOrder) return false;
    }

    if (isDockingRegularizationHeader(headerType)) {
      if (!order.vor) return false;
    }

    return true;
  };

  const handleSave = async () => {
    if (!isFirstPartFull()) {
      toast.error(t('service.missing.fields'));
      return;
    }

    setIsCheckingOs(true);
    const { data } = await checkOsExistence();
    setIsCheckingOs(false);

    if (data?.osExists) {
      toast.error(t('order.with.same.name.exists'));
      return;
    }

    onAdd(order);
    handleClose();
  };

  const RATINGS = FAS_RATINGS_KEYS.map((key) => ({ value: key, label: t(key) }));
  const RATINGS_ALT = FAS_RATINGS_ALT_KEYS.map((key) => ({ value: key, label: t(key) }));
  const PARTIAL_EXECUTION_OPTIONS = FAS_PARTIAL_EXECUTION_KEYS.map((key) => ({ value: key, label: t(key) }));

  const handleQuestionChange = (questionId: string, value: string) => {
    setOrder((prev) => ({
      ...prev,
      questions: {
        ...(prev.questions || {}),
        [questionId]: { value },
      },
    }));
  };

  const handleClose = () => {
    setOrder(INITIAL_ORDER_STATE);
    setActiveTab('service');
    onClose();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setOrder((prev) => ({ ...prev, files: [...(prev.files || []), ...newFiles] }));
    }
  };

  const removeFile = (index: number) => {
    setOrder((prev) => ({
      ...prev,
      files: prev.files?.filter((_, i) => i !== index),
    }));
  };

  return (
    <Dialog open={show} onOpenChange={handleClose}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            <ItemTitle className="font-semibold text-xl">{t('add.service')}</ItemTitle>
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="service">1. {t('service')}</TabsTrigger>
            <TabsTrigger value="rating" disabled={!isFirstPartFull()}>
              2. {t('rating')}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="service" className="space-y-4 pt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="job">JOB {order.jobRequired && '*'}</Label>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="no-job"
                      checked={!order.jobRequired}
                      onCheckedChange={(checked) => setOrder((prev) => ({ ...prev, jobRequired: !checked, job: !checked ? '' : prev.job }))}
                    />
                    <Label htmlFor="no-job" className="font-normal text-xs">
                      {t('no.job')}
                    </Label>
                  </div>
                </div>
                {order.jobRequired && (
                  <Input id="job" value={order.job || ''} onChange={(e) => setOrder((prev) => ({ ...prev, job: maskJobName(e.target.value) }))} placeholder="JOB123456" />
                )}
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="name">{t('os')} (Ex: ABC9999-99/D)*</Label>
                <Input id="name" value={order.name} onChange={(e) => setOrder((prev) => ({ ...prev, name: maskOsName(e.target.value) }))} placeholder="ABC1234-56/D" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">{t('description')}*</Label>
              <Textarea id="description" rows={5} value={order.description} onChange={(e) => setOrder((prev) => ({ ...prev, description: e.target.value }))} />
            </div>
            <div className="flex gap-4">
              <div className="space-y-2">
                <Label>{t('onboardMaterialFas.label')}</Label>
                <Select value={order.onboardMaterial} onValueChange={(value) => onChange('onboardMaterial', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Sim">{t('yes')}</SelectItem>
                    <SelectItem value="Não">{t('not')}</SelectItem>
                    <SelectItem value="N/A">N/A</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>{t('materialFas.label')}</Label>
                <Select value={order.materialFas} onValueChange={(value) => onChange('materialFas', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Sim">{t('yes')}</SelectItem>
                    <SelectItem value="Não">{t('not')}</SelectItem>
                    <SelectItem value="N/A">N/A</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>{t('rmrbFas.label')}</Label>
                <Select value={order.rmrb} onValueChange={(value) => onChange('rmrb', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Sim">{t('yes')}</SelectItem>
                    <SelectItem value="Não">{t('not')}</SelectItem>
                    <SelectItem value="N/A">N/A</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex gap-4">
              {order.materialFas === 'Sim' && (
                <div className="flex-1 space-y-2">
                  <Label htmlFor="materialFasCode">{t('materialFas.code.label')}*</Label>
                  <Input id="materialFasCode" value={order.materialFasCode || ''} onChange={(e) => onChange('materialFasCode', e.target.value)} />
                </div>
              )}
              {order.rmrb === 'Sim' && (
                <div className="flex-1 space-y-2">
                  <Label htmlFor="rmrbCode">{t('rmrbFas.code.label')}*</Label>
                  <Input id="rmrbCode" value={order.rmrbCode || ''} onChange={(e) => onChange('rmrbCode', e.target.value)} />
                </div>
              )}
            </div>

            {isRegularizationHeader(headerType) && (
              <div className="space-y-4 rounded-md border bg-muted/10 p-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>{t('add.request')} *</Label>
                    <Input value={order.requestOrder || ''} onChange={(e) => onChange('requestOrder', e.target.value)} placeholder={t('add.request')} maxLength={150} />
                  </div>
                  {isDockingRegularizationHeader(headerType) && (
                    <div className="space-y-2">
                      <Label>VOR *</Label>
                      <Input value={order.vor || ''} onChange={(e) => onChange('vor', e.target.value)} placeholder="VOR" maxLength={150} />
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <SupplierSelect
                    mode="single"
                    value={order.supplierData?.razao}
                    onChange={(razao) => {
                      // We need to store the whole supplier object if possible, or at least its reason
                      // Following legacy: handleClick stores selection.value (the whole supplier object)
                      onChange('supplierData', razao ? { razao } : null);
                    }}
                    label={`${t('suppliers')} *`}
                  />
                </div>
              </div>
            )}

            <div className="space-y-3">
              <div className="flex flex-col gap-2">
                <Label>{t('attachments')}</Label>
                <input type="file" ref={fileInputRef} className="hidden" multiple onChange={handleFileChange} />
                <div className="flex items-center gap-4">
                  <Button type="button" variant="outline" className="gap-2" onClick={() => fileInputRef.current?.click()}>
                    <FileUp className="size-4" />
                    {t('add')}
                  </Button>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="supplier-view"
                      checked={order.supplierCanView === true}
                      onCheckedChange={(checked) => setOrder((prev) => ({ ...prev, supplierCanView: !!checked }))}
                    />
                    <Label htmlFor="supplier-view" className="font-normal text-xs">
                      {t('supplier.can.view')}
                    </Label>
                  </div>
                </div>
                <p className="text-[10px] text-muted-foreground">{t('attachments.allowed')}</p>
              </div>

              {order.files && order.files.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {order.files.map((file, index) => (
                    <div key={`${file.name}${index}`} className="flex items-center gap-2 rounded-md bg-muted px-2 py-1 text-xs">
                      <span className="max-w-40 truncate">{file.name}</span>
                      <button type="button" onClick={() => removeFile(index)} className="text-muted-foreground hover:text-destructive">
                        <X className="size-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="rating" className="h-[400px] overflow-y-auto pr-2">
            <div className="space-y-6 py-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label>{t('rating')} *</Label>
                  <Select value={order.rating || ''} onValueChange={(value) => setOrder((prev) => ({ ...prev, rating: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder={t('rating')} />
                    </SelectTrigger>
                    <SelectContent>
                      {RATINGS.map((rate) => (
                        <SelectItem key={rate.value} value={rate.value}>
                          {rate.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>{t('justification')} *</Label>
                  <Textarea
                    placeholder={t('support.rating.placeholder')}
                    value={order.ratingDescription || ''}
                    onChange={(e) => setOrder((prev) => ({ ...prev, ratingDescription: e.target.value }))}
                    rows={4}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <Label className="font-semibold text-base">{t('question.title')}</Label>
                <div className="space-y-4 rounded-md border bg-muted/20 p-4">
                  {Array.from({ length: FAS_RATING_QUESTIONS_COUNT }).map((_, index) => {
                    const questionId = `question${index + 1}`;
                    return (
                      <div key={questionId} className="flex flex-col gap-2 sm:flex-row sm:items-center md:justify-between">
                        <span className="text-sm">
                          {index + 1}. {t(`question.${index + 1}`)}
                        </span>
                        <Select value={order.questions?.[questionId]?.value || ''} onValueChange={(value) => handleQuestionChange(questionId, value)}>
                          <SelectTrigger>
                            <SelectValue placeholder={t('rating')} />
                          </SelectTrigger>
                          <SelectContent>
                            {RATINGS_ALT.map((rate) => (
                              <SelectItem key={rate.value} value={rate.value}>
                                {rate.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-2">
                <Label>{t('partial.execution.label')}</Label>
                <Select value={order.partial} onValueChange={(value) => setOrder((prev) => ({ ...prev, partial: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PARTIAL_EXECUTION_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            {t('cancel')}
          </Button>
          {activeTab === 'service' ? (
            <Button onClick={() => setActiveTab('rating')} disabled={!isFirstPartFull()}>
              {t('next')}
            </Button>
          ) : (
            <Button onClick={handleSave} disabled={!order.rating || !order.ratingDescription || isCheckingOs}>
              {t('save')}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
