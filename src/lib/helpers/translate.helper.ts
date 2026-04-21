import translations from '../config/translations.json';

/**
 * Função para traduzir chaves em português
 * Se a chave não existir, retorna a própria chave como fallback
 *
 * @example
 * t('pending') // → "Pendente"
 * // chave inexistente devolve o próprio identificador
 */
export const t = (key: string): string => {
  return (translations as Record<string, string>)[key] ?? key;
};
