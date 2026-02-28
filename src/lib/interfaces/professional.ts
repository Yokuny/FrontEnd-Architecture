import type { EventColor } from './schedule';

export type ProfessionalList = {
  _id: string;
  name: string;
  image?: string | null;
  color?: EventColor | null;
};
