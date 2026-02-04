# Padrão Select

## Criação

```tsx
export function EntitySelect(props: EntitySelectProps) {
  const { t } = useTranslation();
  const { mode, disabled = false, className, label, placeholder } = props;
  const id = useId();
  const query = useEntitySelect();

  const displayLabel = label || t('entity.label');

  const sharedProps = {
    id,
    placeholder: placeholder || t('entity.placeholder'),
    query,
    mapToOptions: mapEntityToOptions,
    disabled,
    searchPlaceholder: t('search.placeholder'),
    noOptionsMessage: t('nooptions.message'),
    noResultsMessage: t('not.found'),
    className,
  };

  return (
    <div className="space-y-2">
      {displayLabel && (
        <Label htmlFor={id} className="flex items-center gap-2">
          <Icon className="size-4" />
          {displayLabel}
        </Label>
      )}
      {mode === 'multi' ? (
        <DataMultiSelect<Entity>
          {...sharedProps}
          value={props.value}
          onChange={(vals) => props.onChange(vals as string[])}
        />
      ) : (
        <DataSelect<Entity>
          {...sharedProps}
          value={props.value}
          onChange={(val) => props.onChange(val as string)}
          clearable={false}
        />
      )}
    </div>
  );
}

// Tipos
interface EntitySelectBaseProps {
  disabled?: boolean;
  className?: string;
  label?: string;
  placeholder?: string;
}

interface EntitySelectSingleProps extends EntitySelectBaseProps {
  mode: 'single';
  value?: string;
  onChange: (value: string | undefined) => void;
}

interface EntitySelectMultiProps extends EntitySelectBaseProps {
  mode: 'multi';
  value?: string[];
  onChange: (value: string[]) => void;
}

export type EntitySelectProps = EntitySelectSingleProps | EntitySelectMultiProps;
```

## Uso

```tsx
// Single
<EnterpriseSelect mode="single" value={value} onChange={setValue} />

// Multi
<EnterpriseSelect mode="multi" value={values} onChange={setValues} />

// Com props
<EnterpriseSelect
  mode="single"
  value={value}
  onChange={setValue}
  label="Empresa"
  placeholder="Selecione..."
  disabled={isLoading}
/>

// React Hook Form
<Controller
  control={form.control}
  name="idEnterprise"
  render={({ field }) => (
    <EnterpriseSelect mode="single" value={field.value} onChange={field.onChange} />
  )}
/>
```

## Regras

1. `displayLabel` definido **uma única vez** (não dentro de if/else)
2. `sharedProps` com propriedades comuns entre single/multi
3. **Um único wrapper** `<div>` com renderização condicional via ternário
4. Props específicas de cada modo passadas diretamente no componente

## ❌ Errado

```tsx
// displayLabel duplicado
if (mode === 'multi') {
  const displayLabel = label || t('entity');
  return (<div>...</div>);
}
const displayLabel = label || t('entity');
return (<div>...</div>);
```

## ✅ Correto

```tsx
const displayLabel = label || t('entity');
const sharedProps = { ... };

return (
  <div>
    {displayLabel && <Label>...</Label>}
    {mode === 'multi' ? <DataMultiSelect {...sharedProps} /> : <DataSelect {...sharedProps} />}
  </div>
);
```
