export type PartialClinic = {
  _id: string;
  name: string;
  email: string;
  code: string;
  cnpj?: string;
  rooms: Array<{
    _id: string;
    name: string;
  }>;
};
