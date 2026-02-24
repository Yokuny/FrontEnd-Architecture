import { Copy } from 'lucide-react';
import { useState } from 'react';

import { toast } from 'sonner';
import DefaultLoading from '@/components/default-loading';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useAppAuth } from '@/hooks/use-app-auth';
import { useAccessUserApi, useGetAllSyncStatuses, useGetGuestsByParent } from '../@hooks/use-access-user-api';
import type { CreateGuestProps } from '../@interface/access-user.interface';
import { GuestForm } from './guest-form';
import { GuestList } from './guest-list';

export function VisitorsTab() {
  const { userId } = useAppAuth();
  const { data: visitors, isLoading } = useGetGuestsByParent('visitante');
  const { data: syncStatuses } = useGetAllSyncStatuses();
  const { createGuest, updateGuest, deleteGuest } = useAccessUserApi();

  const [isFormVisible, setIsFormVisible] = useState(false);
  const [selectedGuestId, setSelectedGuestId] = useState<string | null>(null);
  const [guestToDelete, setGuestToDelete] = useState<{ id: string; name: string } | null>(null);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [invitationLink, setInvitationLink] = useState('');

  function handleSubmit(data: CreateGuestProps & { id?: string }) {
    const payload = { ...data, user_type: 'visitante' as const };
    const hasPhoto = payload.url_image && payload.url_image.length > 0 && !!payload.url_image[0];

    if (data.id) {
      const { id, parentId, user_type, ...guestData } = payload;
      updateGuest.mutate(
        { id: data.id, guestData },
        {
          onSuccess: () => {
            toast.success('accessUser.guest.updateSuccess');
            setIsFormVisible(false);
            setSelectedGuestId(null);
          },
          onError: (err: any) => {
            toast.error(err?.response?.data?.message || 'accessUser.guest.updateError');
          },
        },
      );
    } else {
      createGuest.mutate(payload, {
        onSuccess: (responseData) => {
          if (hasPhoto) {
            toast.success('accessUser.guest.saveSuccess');
            setIsFormVisible(false);
          } else if (responseData.token) {
            const url = `${window.location.origin}/new-user/${responseData.token}`;
            setInvitationLink(url);
            setShowInviteModal(true);
            setIsFormVisible(false);
          }
          setSelectedGuestId(null);
        },
        onError: (err: any) => {
          toast.error(err?.response?.data?.message || 'accessUser.guest.createError');
        },
      });
    }
  }

  function handleConfirmDelete() {
    if (!guestToDelete) return;
    deleteGuest.mutate(guestToDelete.id, {
      onSuccess: () => setGuestToDelete(null),
      onError: (err: any) => {
        toast.error(err?.response?.data?.message || 'accessUser.guest.deleteError');
        setGuestToDelete(null);
      },
    });
  }

  async function handleCopyUrl() {
    await navigator.clipboard.writeText(invitationLink);
    toast.success('accessUser.invite.copied');
  }

  function handleShareWhatsApp() {
    const message = encodeURIComponent(`${'accessUser.invite.whatsappMessage'} ${invitationLink}`);
    window.open(`https://wa.me/?text=${message}`, '_blank');
  }

  if (isLoading) return <DefaultLoading />;

  return (
    <>
      {!isFormVisible ? (
        <GuestList
          guests={visitors || []}
          syncStatuses={syncStatuses}
          onAdd={() => setIsFormVisible(true)}
          onEdit={(id) => {
            setSelectedGuestId(id);
            setIsFormVisible(true);
          }}
          onDelete={(id, name) => setGuestToDelete({ id, name })}
          title={'accessUser.visitors.title'}
        />
      ) : (
        <GuestForm
          parentId={userId || ''}
          guestId={selectedGuestId}
          userType="visitante"
          onCancel={() => {
            setIsFormVisible(false);
            setSelectedGuestId(null);
          }}
          onSubmit={handleSubmit}
          isLoading={createGuest.isPending || updateGuest.isPending}
        />
      )}

      <AlertDialog open={!!guestToDelete} onOpenChange={() => setGuestToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{'accessUser.guest.deleteTitle'}</AlertDialogTitle>
            <AlertDialogDescription>{'accessUser.guest.deleteConfirm'}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{'cancel'}</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete}>{'confirm'}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={showInviteModal} onOpenChange={setShowInviteModal}>
        <DialogContent className="text-center">
          <DialogHeader>
            <DialogTitle>{'accessUser.invite.success'}</DialogTitle>
          </DialogHeader>
          <p className="text-muted-foreground text-sm">{'accessUser.invite.share'}</p>
          <Input value={invitationLink} readOnly />
          <div className="flex justify-center gap-2">
            <Button onClick={handleCopyUrl} size="sm">
              <Copy className="mr-2 h-4 w-4" />
              {'accessUser.invite.copy'}
            </Button>
            <Button onClick={handleShareWhatsApp} size="sm" variant="outline" className="bg-[#25D366] text-white hover:bg-[#25D366]/90">
              WhatsApp
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
