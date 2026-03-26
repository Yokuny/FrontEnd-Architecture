export type PartialUser = {
  name: string;
  email: string;
  Clinic: string;
  role: Array<'admin' | 'professional' | 'assistant'>;
  rooms: Array<{ _id: string }>;
  image: string;
  google: boolean;
};

export type UserRolesAndRooms = {
  _id?: string;
  name: string;
  image: string;
  role: Array<'admin' | 'professional' | 'assistant'>;
  rooms: Array<{ _id: string }>;
};
