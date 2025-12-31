import { ImagePlus } from 'lucide-react';
import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function UploadImage({ value, onAddFile, maxSize, className, height }: UploadImageProps) {
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (maxSize && file.size > maxSize) {
        // toast.error(t('file.more.size', { 0: file.name, 1: maxSize }));
        return;
      }
      onAddFile(file);
    }
  };

  return (
    <div
      className={cn(
        'relative flex items-center justify-center border-2 border-dashed rounded-lg hover:bg-secondary transition-colors cursor-pointer overflow-hidden group',
        className,
      )}
      style={{ height: height || 192 }}
      onClick={() => fileInputRef.current?.click()}
    >
      <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />

      {value ? (
        <>
          <img src={value} alt="Preview" className="w-full h-full object-contain" />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
              <ImagePlus className="size-6" />
            </Button>
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center gap-2 p-4 text-muted-foreground">
          <ImagePlus className="size-8" />
          <span className="text-xs text-center">{t('drag.image', 'Arraste uma imagem aqui ou clique para selecionar')}</span>
        </div>
      )}
    </div>
  );
}

interface UploadImageProps {
  value?: string;
  onAddFile: (file: File) => void;
  maxSize?: number;
  className?: string;
  height?: number | string;
}
