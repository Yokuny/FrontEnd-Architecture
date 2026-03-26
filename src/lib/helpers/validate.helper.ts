import { ObjectIdRegex } from './regex.helper';

export const validObjectID = (value: string): boolean => ObjectIdRegex.test(value);

export const stringToBoolean = (value: string): boolean => value === 'true';

export const addKey = (obj: any, name: string, value: any) => {
  if (value && value.trim() !== '') obj[name] = value;
};
