import { useTranslation } from 'react-i18next';
import { MachineSelect } from '@/components/selects/machine-select';
import { UserSelect } from '@/components/selects/user-select';
import { Checkbox } from '@/components/ui/checkbox';
import { DataSelect } from '@/components/ui/data-select';
import { Field, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

interface FormFieldPreviewProps {
  field: any;
  value: any;
  onChange: (value: any) => void;
  idEnterprise?: string;
}

export function FormFieldPreview({ field, value, onChange, idEnterprise }: FormFieldPreviewProps) {
  const { t } = useTranslation();
  const { datatype, description, name, isRequired, options, properties, size = '12' } = field;

  const colSpan =
    {
      '12': 'col-span-12',
      '6': 'col-span-12 md:col-span-6',
      '4': 'col-span-12 md:col-span-4',
      '3': 'col-span-12 md:col-span-3',
      '8': 'col-span-12 md:col-span-8',
    }[size as string] || 'col-span-12';

  const label = `${description || name}${isRequired ? ' *' : ''}`;

  const renderField = () => {
    switch (datatype) {
      case 'number':
        return (
          <div className="relative">
            <Input type="number" value={value || ''} onChange={(e) => onChange(e.target.value)} placeholder={description} />
            {properties?.unit && <span className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground text-sm">{properties.unit}</span>}
          </div>
        );

      case 'date':
        return <Input type="date" value={value || ''} onChange={(e) => onChange(e.target.value)} />;

      case 'time':
        return <Input type="time" value={value || ''} onChange={(e) => onChange(e.target.value)} />;

      case 'textarea':
        return <Textarea value={value || ''} onChange={(e) => onChange(e.target.value)} placeholder={description} rows={3} />;

      case 'boolean':
      case 'checkbox':
        return (
          <div className="flex items-center space-x-2 pt-2">
            <Checkbox id={name} checked={!!value} onCheckedChange={(checked) => onChange(!!checked)} />
            <Label htmlFor={name} className="cursor-pointer font-normal">
              {description}
            </Label>
          </div>
        );

      case 'select': {
        const selectOptions =
          options?.map((opt: string) => ({
            value: opt,
            label: opt,
          })) || [];
        const query = { data: selectOptions, isLoading: false, isError: false, status: 'success' as const };

        return <DataSelect value={value} onChange={onChange} query={query as any} placeholder={t('select')} />;
      }

      case 'radio': {
        return (
          <RadioGroup value={value} onValueChange={onChange} className="flex flex-col space-y-1 pt-1">
            {options?.map((opt: string) => (
              <div key={opt} className="flex items-center space-x-2">
                <RadioGroupItem value={opt} id={`${name}-${opt}`} />
                <Label htmlFor={`${name}-${opt}`} className="cursor-pointer font-normal">
                  {opt}
                </Label>
              </div>
            ))}
          </RadioGroup>
        );
      }

      case 'selectUsers':
        return <UserSelect multi={false} idEnterprise={idEnterprise || ''} value={value} onChange={(val: string | number | undefined) => onChange(val)} />;

      case 'selectMachine':
        return <MachineSelect mode="single" idEnterprise={idEnterprise || ''} value={value} onChange={(val: string | undefined) => onChange(val)} />;

      case 'group':
        return (
          <div className="space-y-3 rounded-lg border bg-accent/5 p-4">
            <div className="grid grid-cols-12 gap-x-4 gap-y-2">
              {(field.fields || []).map((subField: any, i: number) => (
                <FormFieldPreview
                  key={`${i}-${subField.name}`}
                  field={subField}
                  value={value?.[subField.name]}
                  onChange={(val) => {
                    const newValue = { ...value, [subField.name]: val };
                    onChange(newValue);
                  }}
                  idEnterprise={idEnterprise}
                />
              ))}
            </div>
          </div>
        );

      case 'table':
        return (
          <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed bg-accent/20 p-8 text-muted-foreground">
            <p className="font-medium text-sm">{t('table.form', 'Tabela de Formulário')}</p>
            <p className="text-xs">{t('table.preview.desc', 'Campos dinâmicos em formato de tabela')}</p>
          </div>
        );

      case 'image':
      case 'signature':
        return (
          <div className="flex flex-col items-center justify-center whitespace-nowrap rounded-lg border-2 border-dashed bg-accent/20 p-8 text-muted-foreground">
            <p className="text-sm">{t('field.preview.placeholder', { type: t(datatype) })}</p>
          </div>
        );

      case 'author':
        return <Input disabled value={t('current.user', 'Usuário Logado')} />;

      default:
        return <Input type="text" value={value || ''} onChange={(e) => onChange(e.target.value)} placeholder={description} />;
    }
  };

  return (
    <div className={cn('p-1', colSpan)}>
      {datatype !== 'boolean' && datatype !== 'checkbox' && (
        <Field className="gap-1.5">
          <FieldLabel className="font-semibold text-sm">{label}</FieldLabel>
          {renderField()}
        </Field>
      )}
      {(datatype === 'boolean' || datatype === 'checkbox') && renderField()}
    </div>
  );
}
