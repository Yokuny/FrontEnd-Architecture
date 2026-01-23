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
      <ItemGroup className="flex-1 p-4">
        <div className="flex min-h-96 flex-1 flex-col items-center justify-center">
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
    <ItemGroup className="space-y-4 p-4">
      {/* Identification Grid */}
      <ItemContent className="grid grid-cols-2 gap-x-2 gap-y-4 rounded-md border border-accent bg-accent/50 p-2">
        {gridItems.map((item) => (
          <DetailGridItem key={item.id} label={item.label} icon={item.icon} value={item.value} />
        ))}
      </ItemContent>

      {/* Contacts List */}
      <ItemContent className="space-y-4">
        <div className="flex items-center gap-2 border-b pb-2">
          <Phone className="size-4 text-primary" />
          <ItemTitle className="font-bold text-[10px] text-muted-foreground uppercase tracking-tight">{t('contacts')}</ItemTitle>
        </div>

        <div className="space-y-2">
          {!data.contacts || data.contacts.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground text-xs italic">{t('no.contacts')}</div>
          ) : (
            data.contacts.map((contact: any, i: number) => (
              <div
                key={`${contact.id}-${i}`}
                className="group flex items-center justify-between rounded-lg border border-primary/5 bg-accent/30 p-3 transition-colors hover:bg-accent/50"
              >
                <div className="flex flex-col">
                  <span className="font-bold text-xs">{contact.name}</span>
                  <span className="font-medium text-[10px] text-muted-foreground tabular-nums">{contact.phone || '-'}</span>
                </div>
                {contact.phone && (
                  <a
                    href={`https://wa.me/${contact.phone.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full p-2 text-primary transition-colors hover:bg-primary/20"
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
