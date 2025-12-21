import { z } from 'zod';

// Visibility options
export const visibilityEnum = z.enum(['public', 'private', 'limited']);
export type Visibility = z.infer<typeof visibilityEnum>;

// Edit permission options
export const editPermissionEnum = z.enum(['any', 'me', 'all', 'admin', 'owner']);
export type EditPermission = z.infer<typeof editPermissionEnum>;

// Role path/permission
export const rolePathSchema = z.object({
  path: z.string(),
});
export type RolePath = z.infer<typeof rolePathSchema>;

// Complete role schema
export const roleSchema = z.object({
  id: z.string().optional(),
  description: z.string().min(1, 'Description is required').max(150),
  idEnterprise: z.string().min(1, 'Enterprise is required'),
  visibility: visibilityEnum.default('public'),
  edit: editPermissionEnum.default('admin'),
  users: z.array(z.string()).default([]),
  roles: z.array(rolePathSchema).default([]),

  // Machine permissions
  allMachines: z.boolean().default(false),
  idMachines: z.array(z.string()).default([]),

  // Sensor permissions
  allSensors: z.boolean().default(false),
  idSensors: z.array(z.string()).default([]),

  // Chatbot permissions
  interactChatbot: z.boolean().default(false),
  purchaseChatbot: z.boolean().default(false),
  notifyTravelWhatsapp: z.boolean().default(false),
  notifyTravelEmail: z.boolean().default(false),

  // Fleet permissions
  isShowStatusFleet: z.boolean().default(false),
  isShowConsumption: z.boolean().default(false),
  isShowStatus: z.boolean().default(false),
  isChangeStatusFleet: z.boolean().default(false),
  isSendLinkLocation: z.boolean().default(false),
  isNotifyEventVoyage: z.boolean().default(false),
  isAllowReceivedChangeStatus: z.boolean().default(false),

  // Notification permissions
  isNotifyByChatbotAnomaly: z.boolean().default(false),
  isNotifyByMailAnomaly: z.boolean().default(false),
  isNotifyAlertOperational: z.boolean().default(false),
  isNotifyRVEDivergencies: z.boolean().default(false),
  isNotifyInsuranceDT: z.boolean().default(false),
});

export type Role = z.infer<typeof roleSchema>;

// Form data type (for react-hook-form)
export type RoleFormData = Omit<Role, 'id'>;

// Role list item (simplified for list view)
export interface RoleListItem {
  id: string;
  description: string;
  visibility: Visibility;
  enterprise?: {
    id: string;
    name: string;
  };
}

// Role user
export interface RoleUser {
  idUser: string;
  name: string;
  email: string;
  image?: {
    url: string;
  };
  isUserSystem?: boolean;
}

// Permission path structure
export interface PermissionPath {
  codeLanguage: string;
  items: PermissionPathItem[];
}

export interface PermissionPathItem {
  path: string;
  codeLanguage: string;
  isDeprecated?: boolean;
}

// Chatbot permission
export interface ChatbotPermission {
  value: string;
  code: string;
}

// Machine/Sensor option
export interface AssetOption {
  value: string;
  label: string;
}

// Filter data
export interface RoleFilterData {
  filteredRole: string[];
  filteredType: string[];
}

// User type for filter
export interface UserType {
  id: string;
  description: string;
}
