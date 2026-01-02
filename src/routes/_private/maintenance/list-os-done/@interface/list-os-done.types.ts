export interface OrderServiceDone {
  id: string;
  order: string;
  doneAt: string;
  machine: {
    id: string;
    name: string;
  };
  maintenancePlan: {
    id: string;
    description: string;
  };
  enterprise: {
    id: string;
    name: string;
  };
}

export interface ListOrderServiceDoneResponse {
  data: OrderServiceDone[];
  pageInfo: Array<{ count: number }>;
}
