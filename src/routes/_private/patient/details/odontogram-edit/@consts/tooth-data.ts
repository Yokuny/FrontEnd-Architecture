export const toothStatusOptions = [
  { value: 'normal', label: 'Normal' },
  { value: 'restored', label: 'Restaurado' },
  { value: 'caries', label: 'Cárie' },
  { value: 'missing', label: 'Ausente' },
  { value: 'implant', label: 'Implante' },
  { value: 'periodontitis', label: 'Periodontite' },
  { value: 'prosthesis', label: 'Prótese' },
  { value: 'extracted', label: 'Extraído' },
  { value: 'other', label: 'Outro' },
] as const;

export type ToothStatusType = (typeof toothStatusOptions)[number]['value'];

export const permanentTeethNumbers = {
  top: [18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28],
  bottom: [48, 47, 46, 45, 44, 43, 42, 41, 31, 32, 33, 34, 35, 36, 37, 38],
};

export const deciduousTeethNumbers = {
  top: [55, 54, 53, 52, 51, 61, 62, 63, 64, 65],
  bottom: [85, 84, 83, 82, 81, 71, 72, 73, 74, 75],
};
