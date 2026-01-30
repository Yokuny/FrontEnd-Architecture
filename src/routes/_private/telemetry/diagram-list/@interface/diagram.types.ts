export interface DiagramItem {
  id: string;
  description: string;
  isInactive?: boolean;
  createAt: string;
}

export interface DiagramListResponse {
  data: DiagramItem[];
  pageInfo: { count: number }[];
}
