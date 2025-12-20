export const USER_PERMISSIONS = {
  ADD_USER: '/add-user',
  EDIT_USER: '/edit-user',
  DELETE_USER: '/delete-user',
  DISABLE_USER: '/disable-user',
  PERMISSION_USER: '/permission-user',
} as const;

export const CREDENTIAL_TYPES = [
  { value: 'password', labelKey: 'login.password' },
  { value: 'sso', labelKey: 'sso' },
] as const;
