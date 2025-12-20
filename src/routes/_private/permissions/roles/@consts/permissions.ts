// Permission constants and helpers

export const PERMISSION_PATHS = {
  ADD_ROLE: '/add-role',
  LIST_ROLE_USERS: '/list-role-users',
} as const;

export const VISIBILITY_OPTIONS = [
  { value: 'public', labelKey: 'visibility.public' },
  { value: 'private', labelKey: 'visibility.private' },
  { value: 'limited', labelKey: 'visibility.limited' },
] as const;

export const EDIT_PERMISSION_OPTIONS = [
  { value: 'all', labelKey: 'edit.permission.all' },
  { value: 'admin', labelKey: 'edit.permission.admin' },
  { value: 'owner', labelKey: 'edit.permission.owner' },
] as const;

export const ROLE_TABS = {
  PAGES: 'pages',
  MACHINES: 'machines',
  CHATBOT: 'chatbot',
  PERMISSIONS: 'permissions',
} as const;
