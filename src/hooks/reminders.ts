import { create } from 'zustand';
import { GET, PATCH, request } from '@/lib/api/fetch.config';
import type { DbReminder } from '@/lib/interfaces';
import type { ReminderBulkUpdate, ReminderQuery } from '@/lib/interfaces/schemas/reminder.schema';

export const useRemindersStore = create<RemindersStore>((set, get) => ({
  reminders: [],

  getReminders: async (query: ReminderQuery) => {
    try {
      const queryParams = new URLSearchParams();
      queryParams.append('startDate', query.startDate);
      queryParams.append('endDate', query.endDate);
      if (query.status) {
        queryParams.append('status', query.status);
      }

      const res = await request(`reminder?${queryParams.toString()}`, GET());

      if (!res.success) {
        throw new Error(res.message || 'Falha ao carregar lembretes');
      }

      set({ reminders: res.data as DbReminder[] });
      return res.data as DbReminder[];
    } catch (e: any) {
      throw new Error(e.message);
    }
  },

  checkReminders: async (data: ReminderBulkUpdate) => {
    try {
      const res = await request('reminder', PATCH(data));

      if (!res.success) {
        throw new Error(res.message || 'Falha ao marcar lembretes como concluídos');
      }

      const { reminders } = get();
      set({
        reminders: reminders.filter((r) => !data.ids.includes(r._id)),
      });

      return res;
    } catch (e: any) {
      throw new Error(e.message);
    }
  },

  clearReminders: () => {
    set({ reminders: [] });
  },
}));

type RemindersStore = {
  reminders: DbReminder[];
  getReminders: (query: ReminderQuery) => Promise<DbReminder[]>;
  checkReminders: (data: ReminderBulkUpdate) => Promise<any>;
  clearReminders: () => void;
};
