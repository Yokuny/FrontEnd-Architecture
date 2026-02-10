# Internacionalizacao (i18n) e Formatacao de Datas

## i18n - Regras

**CRITICO**: Toda string de UI DEVE usar `t('chave')`:

```tsx
import { useTranslation } from 'react-i18next';

function MyComponent() {
  const { t } = useTranslation();

  return (
    <>
      <h1>{t('page.title')}</h1>
      <p>{t('message', { name: 'User' })}</p>
      <Input placeholder={t('search.placeholder')} />
    </>
  );
}
```

Toda chave DEVE existir nos **3 arquivos**:
- `src/config/translations/pt.json`
- `src/config/translations/en.json`
- `src/config/translations/es.json`

Use **grep** para verificar se a chave ja existe antes de criar.

## Formatacao de Datas

**OBRIGATORIO**: Use `@/lib/formatDate` para toda formatacao:

```tsx
import { formatDate } from '@/lib/formatDate';

// CORRETO
formatDate(date, 'dd/MM/yyyy');
formatDate(date, "yyyy-MM-dd'T'HH:mm:ss'Z'");

// ERRADO - perde i18n
import { format } from 'date-fns';
format(date, 'dd/MM/yyyy');
```
