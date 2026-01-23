import { Edit2, GripVertical, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useFormOptions } from '../@hooks/use-form-options';

interface FormFieldItemViewProps {
  field: any;
  onEdit: () => void;
  onRemove: () => void;
  dragHandleProps?: any;
}

export function FormFieldItemView({ field, onEdit, onRemove, dragHandleProps }: FormFieldItemViewProps) {
  const { t } = useTranslation();
  const { datatypeOptions } = useFormOptions();

  const typeOption = datatypeOptions.find((opt) => opt.value === (field.datatype || field.type));

  return (
    <div className="group mb-3 flex items-center gap-4 rounded-lg border bg-card p-4 transition-colors hover:bg-accent/50">
      <div {...dragHandleProps} className="cursor-grab p-1 text-muted-foreground hover:text-foreground active:cursor-grabbing">
        <GripVertical className="size-5" />
      </div>

      <div className="min-w-0 flex-1">
        <div className="mb-1 flex items-center gap-2">
          <Badge
            variant="outline"
            style={{
              borderColor: typeOption?.color,
              color: typeOption?.color,
              backgroundColor: `${typeOption?.color}10`,
            }}
          >
            {typeOption?.label || field.type || field.datatype}
          </Badge>
          {field.isRequired && (
            <Badge variant="destructive" className="h-5 bg-destructive/10 px-1 font-bold text-[10px] text-destructive uppercase">
              {t('required')}
            </Badge>
          )}
        </div>
        <p className="truncate font-medium">{field.description || field.name || t('no.description')}</p>
        <p className="font-mono text-muted-foreground text-xs">ID: {field.name}</p>
      </div>

      <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
        <Button variant="ghost" size="icon" onClick={onEdit}>
          <Edit2 className="size-4" />
        </Button>
        <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10 hover:text-destructive" onClick={onRemove}>
          <Trash2 className="size-4" />
        </Button>
      </div>
    </div>
  );
}
