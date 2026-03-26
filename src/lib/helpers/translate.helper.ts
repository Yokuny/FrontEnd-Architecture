import translations from '../config/translations.json';

/**
 * Função para traduzir chaves em português
 * Se a chave não existir, retorna a própria chave como fallback
 *
 * @example
 * t('pending') // → "Pendente"
 * t('unknown') // → "unknown"
 */
export const t = (key: string): string => {
  return (translations as Record<string, string>)[key] ?? key;
};
