import { createFileRoute } from '@tanstack/react-router';
import { Save, WifiOff } from 'lucide-react';
import { useEffect, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { toast } from 'sonner';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { INTEGRATION_OPTIONS, TYPES_WITH_IMO, TYPES_WITH_MMSI, UPDATE_INTERVAL_OPTIONS } from './@consts/integration-options';
import { useMachineIntegrations, useMachineIntegrationsApi } from './@hooks/use-machine-integrations-api';
import type { MachineIntegration } from './@interface/machine-integration';

export const Route = createFileRoute('/_private/set-up-company/integration-list/')({
  component: IntegrationListPage,
});

function IntegrationListPage() {
  const intl = useIntl();

  // Pegar idEnterprise do localStorage (mesmo padrão do legado com Redux)
  const idEnterprise = localStorage.getItem('id_enterprise_filter') || '';

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
      toast.success(intl.formatMessage({ id: 'success.save' }));
    } catch (_error) {
      toast.error(intl.formatMessage({ id: 'error.save' }));
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <FormattedMessage id="integration" defaultMessage="Integração" /> AIS
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={`skeleton-${i}`} className="h-16 bg-muted animate-pulse rounded-lg" />
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[70px]">
                    <FormattedMessage id="image" defaultMessage="Imagem" />
                  </TableHead>
                  <TableHead className="w-[250px]">
                    <FormattedMessage id="name" defaultMessage="Nome" />
                  </TableHead>
                  <TableHead className="w-[160px] text-center">
                    <FormattedMessage id="type" defaultMessage="Tipo" />
                  </TableHead>
                  <TableHead className="w-[120px] text-center">
                    <FormattedMessage id="interval" defaultMessage="Intervalo" />
                  </TableHead>
                  <TableHead className="text-center">
                    <FormattedMessage id="options" defaultMessage="Opções" />
                  </TableHead>
                  <TableHead className="w-[80px] text-center">
                    <FormattedMessage id="active" defaultMessage="Ativo" />
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {localData.map((item, index) => (
                  <TableRow key={item.id} className={item.disabled ? 'opacity-50' : ''}>
                    <TableCell>
                      <Avatar>
                        <AvatarImage src={item.image?.url} alt={item.name} />
                        <AvatarFallback>{item.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className={item.disabled ? 'text-muted-foreground' : ''}>{item.name}</span>
                        {item.disabled && (
                          <Badge variant="secondary" className="text-xs">
                            <WifiOff className="h-3 w-3 mr-1" />
                            <FormattedMessage id="deactivate" defaultMessage="Desativado" />
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Select value={item.type || ''} onValueChange={(value) => handleChange(index, 'type', value)} disabled={item.disabled}>
                        <SelectTrigger>
                          <SelectValue placeholder={intl.formatMessage({ id: 'type' })} />
                        </SelectTrigger>
                        <SelectContent>
                          {INTEGRATION_OPTIONS.filter((opt) => !opt.disabled).map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>
                              {opt.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Select value={item.updateTime?.toString() || ''} onValueChange={(value) => handleChange(index, 'updateTime', parseInt(value, 10))} disabled={item.disabled}>
                        <SelectTrigger>
                          <SelectValue placeholder={intl.formatMessage({ id: 'interval' })} />
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
                          <div className="space-y-1">
                            <Label className="text-xs">ID Moon</Label>
                            <Input
                              type="text"
                              placeholder="ID"
                              value={item.idMoon || ''}
                              onChange={(e) => handleChange(index, 'idMoon', e.target.value)}
                              disabled={item.disabled}
                              className="w-24"
                            />
                          </div>
                        )}
                        {TYPES_WITH_IMO.some((t) => t === item.type) && (
                          <div className="space-y-1">
                            <Label className="text-xs">IMO</Label>
                            <Input
                              type="number"
                              placeholder="IMO"
                              value={item.imo || ''}
                              onChange={(e) => handleChange(index, 'imo', e.target.value)}
                              disabled={item.disabled}
                              className="w-24"
                            />
                          </div>
                        )}
                        {TYPES_WITH_MMSI.some((t) => t === item.type) && (
                          <div className="space-y-1">
                            <Label className="text-xs">MMSI</Label>
                            <Input
                              type="number"
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
      <CardFooter>
        <Button onClick={handleSave} disabled={isLoading || saveMachineIntegrations.isPending}>
          <Save className="mr-2 h-4 w-4" />
          <FormattedMessage id="save" defaultMessage="Salvar" />
        </Button>
      </CardFooter>
    </Card>
  );
}
