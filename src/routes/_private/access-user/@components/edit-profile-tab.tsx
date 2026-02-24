import { Loader2, Upload, X } from 'lucide-react';

import DefaultLoading from '@/components/default-loading';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { ItemActions, ItemContent, ItemDescription, ItemGroup, ItemHeader, ItemTitle } from '@/components/ui/item';
import { useAppAuth } from '@/hooks/use-app-auth';
import { applyDateMask, applyPhoneMask } from '@/lib/masks';
import { useGetAppUser, useGetUserSyncStatus } from '../@hooks/use-access-user-api';
import { useEditProfileForm } from '../@hooks/use-edit-profile-form';

export function EditProfileTab() {
  const { userId } = useAppAuth();
  const { data: user, isLoading, isError } = useGetAppUser();
  const { data: syncStatus } = useGetUserSyncStatus(userId);
  const { form, onSubmit, isPending } = useEditProfileForm(user);

  const urlImages = form.watch('url_image');

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    if (urlImages.length >= 5) return;
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64 = e.target?.result as string;
        form.setValue('url_image', [...urlImages, base64], { shouldValidate: true });
      };
      reader.readAsDataURL(file);
    }
    event.target.value = '';
  }

  function handleRemoveImage(index: number) {
    form.setValue(
      'url_image',
      urlImages.filter((_, i) => i !== index),
      { shouldValidate: true },
    );
  }

  if (isLoading) return <DefaultLoading />;

  return (
    <ItemGroup className="gap-6">
      <ItemHeader>
        <ItemTitle className="text-lg">Editar Perfil</ItemTitle>
      </ItemHeader>

      {syncStatus?.sync_status && (
        <div className="rounded-md border bg-muted/50 p-3 text-sm">{syncStatus.synchronized ? 'Cadastro sincronizado com sucesso.' : 'Cadastro pendente de sincronização.'}</div>
      )}

      {isError && <div className="rounded-md border border-destructive/50 bg-destructive/10 p-3 text-destructive text-sm">Erro ao carregar seus dados.</div>}

      <Form {...form}>
        <form onSubmit={onSubmit} className="flex flex-col gap-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome Completo *</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="cpf"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CPF *</FormLabel>
                  <FormControl>
                    <Input {...field} disabled />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="birthDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data de Nascimento</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="DD/MM/AAAA" onChange={(e) => form.setValue('birthDate', applyDateMask(e.target.value))} maxLength={10} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nova Senha</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="********" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>E-mail</FormLabel>
                  <FormControl>
                    <Input type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="primaryPhone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Telefone Primário</FormLabel>
                  <FormControl>
                    <Input {...field} onChange={(e) => form.setValue('primaryPhone', applyPhoneMask(e.target.value))} maxLength={15} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="secondaryPhone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Telefone Secundário</FormLabel>
                  <FormControl>
                    <Input {...field} onChange={(e) => form.setValue('secondaryPhone', applyPhoneMask(e.target.value))} maxLength={15} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <ItemContent className="gap-3">
            <FormLabel>Fotos</FormLabel>
            <div className="flex flex-wrap gap-2">
              {urlImages.map((url, index) => (
                <div key={`${index}-img`} className="relative">
                  <img src={url} alt={`foto-${index}`} className="h-24 w-24 rounded-md object-cover" />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-white"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
              {urlImages.length === 0 && (
                <div className="flex h-24 w-24 items-center justify-center rounded-md border-2 border-muted-foreground/30 border-dashed">
                  <ItemDescription className="text-xs">Sem foto</ItemDescription>
                </div>
              )}
            </div>
            <ItemActions>
              <Button asChild type="button" variant="outline" size="sm">
                <label className="cursor-pointer">
                  <Upload className="mr-2 h-4 w-4" />
                  Carregar Arquivo
                  <input type="file" accept="image/*" hidden onChange={handleFileChange} />
                </label>
              </Button>
            </ItemActions>
          </ItemContent>

          <ItemActions className="justify-end">
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Salvar
            </Button>
          </ItemActions>
        </form>
      </Form>
    </ItemGroup>
  );
}
