export const stringToBoolean = (value: string): boolean => value === 'true';
export const booleanToString = (value?: boolean | string): 'true' | 'false' => {
  if (typeof value === 'string') return value === 'true' ? 'true' : 'false';
  return value ? 'true' : 'false';
};
