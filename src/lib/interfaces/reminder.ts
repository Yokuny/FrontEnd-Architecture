export type DbReminder = {
  _id: string;
  Clinic: string;
  Patient: {
    _id: string;
    name: string;
    phone?: Array<{ tag: string; number: string }>;
  };
  description: string;
  scheduledDate: Date | string;
  status: 'pending' | 'done';
  createdAt: Date | string;
  updatedAt: Date | string;
};

export type PartialReminder = {
  _id: string;
  Patient: {
    _id: string;
    name: string;
    phone?: Array<{ tag: string; number: string }>;
  };
  description: string;
  scheduledDate: Date | string;
  status: 'pending' | 'done';
};
