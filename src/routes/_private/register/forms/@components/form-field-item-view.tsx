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
    <div className="flex items-center gap-4 p-4 mb-3 border rounded-lg bg-card hover:bg-accent/50 transition-colors group">
      <div {...dragHandleProps} className="cursor-grab active:cursor-grabbing p-1 text-muted-foreground hover:text-foreground">
        <GripVertical className="size-5" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
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
            <Badge variant="destructive" className="h-5 px-1 bg-destructive/10 text-destructive border-destructive/20 text-[10px] uppercase font-bold">
              {t('required')}
            </Badge>
          )}
        </div>
        <p className="font-medium truncate">{field.description || field.name || t('no.description')}</p>
        <p className="text-xs text-muted-foreground font-mono">ID: {field.name}</p>
      </div>

      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button variant="ghost" size="icon" onClick={onEdit}>
          <Edit2 className="size-4" />
        </Button>
        <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive hover:bg-destructive/10" onClick={onRemove}>
          <Trash2 className="size-4" />
        </Button>
      </div>
    </div>
  );
}
