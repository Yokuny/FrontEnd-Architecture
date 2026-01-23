import { createFileRoute } from '@tanstack/react-router';
import { Save, WifiOff } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import DefaultLoading from '@/components/default-loading';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ItemTitle } from '@/components/ui/item';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useEnterpriseFilter } from '@/hooks/use-enterprise-filter';
import { INTEGRATION_OPTIONS, TYPES_WITH_IMO, TYPES_WITH_MMSI, UPDATE_INTERVAL_OPTIONS } from './@consts/integration-options';
import { useMachineIntegrations, useMachineIntegrationsApi } from './@hooks/use-machine-integrations-api';
import type { MachineIntegration } from './@interface/machine-integration';

export const Route = createFileRoute('/_private/set-up-company/integration-list/')({
  component: IntegrationListPage,
});

function IntegrationListPage() {
  const { t } = useTranslation();

  const { idEnterprise } = useEnterpriseFilter();

  const { data: machines, isLoading } = useMachineIntegrations(idEnterprise);
  const { saveMachineIntegrations } = useMachineIntegrationsApi();

  const [localData, setLocalData] = useState<MachineIntegration[]>([]);

  useEffect(() => {
    if (machines) {
      setLocalData(machines);
    }
  }, [machines]);

  const handleChange = (index: number, field: keyof MachineIntegration, value: string | number | boolean | null) => {
    setLocalData((prev) => {
      const newData = [...prev];
      newData[index] = { ...newData[index], [field]: value };
      return newData;
    });
  };

  const handleSave = async () => {
    const payload = localData.map((item) => ({
      id: item.id,
      idEnterprise,
      type: item.type,
      updateTime: item.updateTime,
      idMoon: item.idMoon ? parseInt(item.idMoon, 10) : null,
      imo: item.imo ? parseInt(item.imo, 10) : null,
      mmsi: item.mmsi ? parseInt(item.mmsi, 10) : null,
      disabled: item.disabled,
    }));

    try {
      await saveMachineIntegrations.mutateAsync(payload);
      toast.success(t('save.success'));
    } catch (_error) {
      toast.error(t('error.save'));
    }
  };

  return (
    <Card>
      <CardHeader title={`${t('integration')} AIS`}>
        <Button onClick={handleSave} disabled={isLoading || saveMachineIntegrations.isPending}>
          <Save className="mr-2 size-4" />
          {t('save')}
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <DefaultLoading />
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[70px]">{t('image')}</TableHead>
                  <TableHead className="w-[250px]">{t('name')}</TableHead>
                  <TableHead className="w-[160px] text-center">{t('type')}</TableHead>
                  <TableHead className="w-[120px] text-center">{t('interval')}</TableHead>
                  <TableHead className="text-center">{t('options')}</TableHead>
                  <TableHead className="w-[80px] text-center">{t('machine')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {localData.map((item, index) => (
                  <TableRow key={item.id} className={item.disabled ? 'opacity-50' : ''}>
                    <TableCell>
                      <Avatar className="size-10">
                        <AvatarImage src={item.image?.url} alt={item.name} />
                        <AvatarFallback>{item.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <ItemTitle className={item.disabled ? 'text-muted-foreground' : ''}>{item.name}</ItemTitle>
                        {item.disabled && (
                          <Badge variant="secondary" className="text-xs">
                            <WifiOff className="mr-1 size-3" />
                            {t('deactivate')}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Select value={item.type || ''} onValueChange={(value) => handleChange(index, 'type', value)} disabled={item.disabled}>
                        <SelectTrigger size="sm">
                          <SelectValue placeholder={t('type')} />
                        </SelectTrigger>
                        <SelectContent>
                          {(INTEGRATION_OPTIONS as readonly any[])
                            .filter((opt) => !opt.disabled)
                            .map((opt) => (
                              <SelectItem key={opt.value} value={opt.value}>
                                {opt.label}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Select value={item.updateTime?.toString() || ''} onValueChange={(value) => handleChange(index, 'updateTime', parseInt(value, 10))} disabled={item.disabled}>
                        <SelectTrigger size="sm">
                          <SelectValue placeholder={t('interval')} />
                        </SelectTrigger>
                        <SelectContent>
                          {UPDATE_INTERVAL_OPTIONS.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value.toString()}>
                              {opt.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        {item.type === 'MOON' && (
                          <div className="flex flex-row items-baseline gap-2 space-y-1">
                            <Label className="text-xs">ID Moon</Label>
                            <Input
                              type="text"
                              size="sm"
                              placeholder="ID"
                              value={item.idMoon || ''}
                              onChange={(e) => handleChange(index, 'idMoon', e.target.value)}
                              disabled={item.disabled}
                              className="w-24"
                            />
                          </div>
                        )}
                        {TYPES_WITH_IMO.some((t) => t === item.type) && (
                          <div className="flex flex-row items-baseline gap-2 space-y-1">
                            <Label className="text-xs">IMO</Label>
                            <Input
                              type="number"
                              size="sm"
                              placeholder="IMO"
                              value={item.imo || ''}
                              onChange={(e) => handleChange(index, 'imo', e.target.value)}
                              disabled={item.disabled}
                              className="w-24"
                            />
                          </div>
                        )}
                        {TYPES_WITH_MMSI.some((t) => t === item.type) && (
                          <div className="flex flex-row items-baseline gap-2 space-y-1">
                            <Label className="text-xs">MMSI</Label>
                            <Input
                              type="number"
                              size="sm"
                              placeholder="MMSI"
                              value={item.mmsi || ''}
                              onChange={(e) => handleChange(index, 'mmsi', e.target.value)}
                              disabled={item.disabled}
                              className="w-24"
                            />
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      {item.type && <Switch checked={!item.disabled} onCheckedChange={(checked) => handleChange(index, 'disabled', !checked)} />}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
