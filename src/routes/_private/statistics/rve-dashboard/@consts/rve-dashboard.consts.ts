/**
 * Mapping RVE categories to Universal Hue Spectrum
 * OM: Operação Mecânica -> Emerald
 * NV: Navegação -> Blue
 * PM: Parada Manutenção -> Red
 * AM: Aguardando Manutenção -> Amber
 * IN: Indisponibilidade -> Rose
 */
export const RVE_COLOR_MAPPING: Record<string, { border: string; badge: string }> = {
  OM: { border: 'border-l-emerald-400', badge: 'bg-emerald-400 text-white' },
  NV: { border: 'border-l-blue-400', badge: 'bg-blue-400 text-white' },
  PM: { border: 'border-l-red-400', badge: 'bg-red-400 text-white' },
  AM: { border: 'border-l-amber-400', badge: 'bg-amber-400 text-black' },
  IN: { border: 'border-l-rose-400', badge: 'bg-rose-400 text-white' },
};
