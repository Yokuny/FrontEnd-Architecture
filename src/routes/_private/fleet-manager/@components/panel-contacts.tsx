import { Phone, Ship, User } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import DefaultEmptyData from '@/components/default-empty-data';
import DefaultLoading from '@/components/default-loading';
import { ItemContent, ItemGroup, ItemTitle } from '@/components/ui/item';
import { useMachineContacts } from '../@hooks/use-fleet-api';
import { useFleetManagerStore } from '../@hooks/use-fleet-manager-store';
import { DetailGridItem } from './helpers/detail-items';

export function FleetContactsPanel() {
  const { t } = useTranslation();
  const { selectedMachineId } = useFleetManagerStore();
  const { data, isLoading } = useMachineContacts(selectedMachineId);

  if (isLoading) {
    return (
      <ItemGroup className="p-4">
        <DefaultLoading />
      </ItemGroup>
    );
  }

  if (!data || (!data.contacts?.length && !data.dataSheet?.managementName)) {
    return (
      <ItemGroup className="p-4 flex-1">
        <div className="flex-1 flex flex-col items-center justify-center min-h-96">
          <DefaultEmptyData />
        </div>
      </ItemGroup>
    );
  }

  const gridItems = [
    { id: 'vessel', label: t('vessel'), icon: Ship, value: `${data.name} ${data.code ? `/ ${data.code}` : ''}` },
    { id: 'management', label: t('management.person'), icon: User, value: data.dataSheet?.managementName || '-' },
  ];

  return (
    <ItemGroup className="p-4 space-y-4">
      {/* Identification Grid */}
      <ItemContent className="grid grid-cols-2 gap-y-4 gap-x-2 p-2 bg-accent/50 rounded-md border-accent border">
        {gridItems.map((item) => (
          <DetailGridItem key={item.id} label={item.label} icon={item.icon} value={item.value} />
        ))}
      </ItemContent>

      {/* Contacts List */}
      <ItemContent className="space-y-4">
        <div className="flex items-center gap-2 border-b pb-2">
          <Phone className="size-4 text-primary" />
          <ItemTitle className="text-[10px] text-muted-foreground uppercase font-bold tracking-tight">{t('contacts')}</ItemTitle>
        </div>

        <div className="space-y-2">
          {!data.contacts || data.contacts.length === 0 ? (
            <div className="text-xs text-muted-foreground italic p-4 text-center">{t('no.contacts')}</div>
          ) : (
            data.contacts.map((contact: any, i: number) => (
              <div
                key={`${contact.id}-${i}`}
                className="flex items-center justify-between p-3 rounded-lg bg-accent/30 border border-primary/5 group hover:bg-accent/50 transition-colors"
              >
                <div className="flex flex-col">
                  <span className="text-xs font-bold">{contact.name}</span>
                  <span className="text-[10px] text-muted-foreground tabular-nums font-medium">{contact.phone || '-'}</span>
                </div>
                {contact.phone && (
                  <a
                    href={`https://wa.me/${contact.phone.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-full hover:bg-primary/20 text-primary transition-colors"
                    title="WhatsApp"
                  >
                    <Phone className="size-4" />
                  </a>
                )}
              </div>
            ))
          )}
        </div>
      </ItemContent>
    </ItemGroup>
  );
}
