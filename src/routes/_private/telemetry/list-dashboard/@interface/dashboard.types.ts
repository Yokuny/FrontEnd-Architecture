export interface Dashboard {
  id: string;
  name: string;
  description?: string;
  idEnterprise: string;
  enterprise?: {
    id: string;
    name: string;
  };
  share: boolean;
  isFavorite?: boolean;
  createdAt?: string;
  updatedAt?: string;
  machine?: {
    id: string;
    name: string;
    image?: {
      url: string;
    };
  };
  visibility: string;
  typeData: 'dashboard' | 'folder' | 'url.external';
  typeLayout?: 'simple' | 'group';
  user?: {
    id: string;
    name: string;
  };
  folder?: {
    id: string;
    description: string;
  };
  usersData?: Array<{
    id: string;
    name: string;
  }>;
  machines?: Array<{
    id: string;
    name: string;
  }>;
  code?: string;
  isCanEdit?: boolean;
}

export interface DashboardListResponse {
  data: Dashboard[];
  pageInfo: Array<{
    count: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    page: number;
    size: number;
  }>;
}
