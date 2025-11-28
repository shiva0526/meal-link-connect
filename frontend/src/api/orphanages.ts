import api from './axios';

export interface OrphanageCreateIn {
  user_id?: string | null;
  name: string;
  address: string;
  phone?: string | null;
  contact_person?: string | null;
}

export interface OrphanageOut extends OrphanageCreateIn {
  id: string;
  approved: boolean;
  created_at?: string | null;
}

export const orphanagesApi = {
  create: async (payload: OrphanageCreateIn): Promise<OrphanageOut> => {
    const r = await api.post('/orphanages/', payload);
    return r.data;
  },

  get: async (orphanageId: string): Promise<OrphanageOut> => {
    const r = await api.get(`/orphanages/${orphanageId}`);
    return r.data;
  },

  pending: async (orphanageId: string) => {
    const r = await api.get(`/orphanages/${orphanageId}/pending`);
    return r.data;
  },

  getAll: async (): Promise<OrphanageOut[]> => {
    const r = await api.get('/orphanages/all');
    return r.data;
  },

  getMyPending: async (): Promise<any[]> => {
    const r = await api.get('/orphanages/my-pending');
    return r.data;
  },

  getPendingApproval: async (): Promise<OrphanageOut[]> => {
    const r = await api.get('/orphanages/pending-approval');
    return r.data;
  },

  approve: async (orphanageId: string): Promise<OrphanageOut> => {
    const r = await api.patch(`/orphanages/${orphanageId}/approve`);
    return r.data;
  },
};

export default orphanagesApi;
