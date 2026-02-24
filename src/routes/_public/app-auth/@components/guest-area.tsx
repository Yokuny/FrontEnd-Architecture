import { Loader2, Upload, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useGuestByCpf, useUpdateGuestImage } from '../@hooks/use-app-login';

interface GuestAreaProps {
  onClose: () => void;
}

function applyCpfMask(value: string) {
  return value
    .replace(/\D+/g, '')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1-$2');
}

export function GuestArea({ onClose }: GuestAreaProps) {
  const [guestData, setGuestData] = useState<any>(null);
  const [guestImages, setGuestImages] = useState<string[]>([]);
  const [blockedUntil, setBlockedUntil] = useState<Date | null>(null);
  const [countdown, setCountdown] = useState(0);

  const findGuest = useGuestByCpf();
  const updateImage = useUpdateGuestImage();

  const form = useForm<{ cpf: string }>({
    defaultValues: { cpf: '' },
  });

  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (blockedUntil) {
      const updateCountdown = () => {
        const diff = Math.max(0, Math.ceil((blockedUntil.getTime() - Date.now()) / 1000));
        setCountdown(diff);
        if (diff <= 0) setBlockedUntil(null);
      };
      updateCountdown();
      timer = setInterval(updateCountdown, 1000);
    }
    return () => clearInterval(timer);
  }, [blockedUntil]);

  function handleCpfChange(value: string) {
    form.setValue('cpf', applyCpfMask(value), { shouldValidate: true });
  }

  function onSearchSubmit(data: { cpf: string }) {
    if (blockedUntil) return;
    findGuest.mutate(data.cpf, {
      onSuccess: (result) => {
        setGuestData(result);
        setGuestImages(result.url_image || []);
      },
      onError: (err: any) => {
        if (err?.response?.status === 429) {
          setBlockedUntil(new Date(Date.now() + 10000));
          toast.error('Muitas tentativas. Aguarde...');
          return;
        }
        const msg = err?.response?.data?.originalError?.message || err?.response?.data?.message || 'Erro ao buscar cadastro.';
        toast.error(msg);
      },
    });
  }

  function handleImageUpdate() {
    if (blockedUntil || !guestData) return;
    const id = guestData.id || guestData._id;
    updateImage.mutate(
      { id, url_image: guestImages },
      {
        onSuccess: () => {
          toast.success('Imagem atualizada com sucesso!');
          setTimeout(onClose, 2000);
        },
        onError: (err: any) => {
          const msg = err?.response?.data?.originalError?.message || err?.response?.data?.message || 'Erro ao atualizar imagem.';
          toast.error(msg);
        },
      },
    );
  }

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    if (guestImages.length >= 5) return;
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64 = e.target?.result as string;
        setGuestImages((prev) => [...prev, base64]);
      };
      reader.readAsDataURL(file);
    }
    event.target.value = '';
  }

  if (!guestData) {
    return (
      <div className="flex w-full flex-col gap-4">
        <h3 className="text-center font-semibold text-lg text-primary">Área do Visitante</h3>
        <p className="text-center text-muted-foreground text-sm">Digite seu CPF para buscar seu cadastro</p>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSearchSubmit)} className="flex flex-col gap-3">
            <FormField
              control={form.control}
              name="cpf"
              rules={{ required: 'CPF é obrigatório', minLength: { value: 14, message: 'CPF inválido' } }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CPF *</FormLabel>
                  <FormControl>
                    <Input {...field} onChange={(e) => handleCpfChange(e.target.value)} maxLength={14} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={findGuest.isPending || !!blockedUntil} className="w-full">
              {findGuest.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {blockedUntil ? `Aguarde ${countdown}s` : 'Buscar'}
            </Button>
            <Button type="button" variant="outline" onClick={onClose} className="w-full">
              Voltar
            </Button>
          </form>
        </Form>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col items-center gap-4">
      <h3 className="text-center font-semibold text-lg text-primary">Atualizar Foto</h3>

      <div className="flex w-full flex-col gap-2">
        <Input value={guestData.name || ''} disabled />
        <Input value={applyCpfMask(guestData.cpf || '')} disabled />
      </div>

      <div className="flex flex-wrap justify-center gap-2">
        {guestImages.map((url, index) => (
          <div key={`${index}-img`} className="relative">
            <img src={url} alt={`foto-${index}`} className="h-20 w-20 rounded-md object-cover" />
            <button
              type="button"
              onClick={() => setGuestImages((prev) => prev.filter((_, i) => i !== index))}
              className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-white"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}
      </div>

      <div className="flex w-full flex-col gap-2">
        <Button asChild variant="outline" className="w-full">
          <label className="cursor-pointer">
            <Upload className="mr-2 h-4 w-4" />
            Carregar Arquivo
            <input type="file" accept="image/*" hidden onChange={handleFileChange} />
          </label>
        </Button>

        <Button onClick={handleImageUpdate} disabled={updateImage.isPending || !!blockedUntil} className="w-full">
          {updateImage.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {blockedUntil ? `Aguarde ${countdown}s` : 'Salvar'}
        </Button>

        <Button variant="ghost" onClick={onClose} className="w-full">
          Voltar
        </Button>
      </div>
    </div>
  );
}
