export interface DownloadQueueMachine {
  id: string;
  name: string;
}

export interface DownloadQueueUser {
  name: string;
}

export interface DownloadQueueItem {
  id: string;
  status: 'ready' | 'processing' | 'error' | 'empty' | 'expired' | 'pending';
  machines?: DownloadQueueMachine[];
  dateStart: string;
  dateEnd: string;
  interval?: number;
  user?: DownloadQueueUser;
  createdAt?: string;
  created_at?: string;
  file?: string;
}

export interface DownloadQueueRequest {
  idEnterprise: string;
  idMachines: string[];
  idSensors: string[];
  dateStart: Date;
  dateEnd: Date;
  interval: number | null;
  timezone: number;
  dataShow: {
    isShowStatusNavigation: boolean;
    isShowStatusOperation: boolean;
    isShowFence: boolean;
    isShowPlatform: boolean;
    isJustHasValue: boolean;
    isShowCoordinatesInDegrees: boolean;
  };
  file: null;
  createdBy: string;
}
