import api from './axios';

export interface MeOut {
  id: string;
  phone: string;
  full_name?: string | null;
  roles: string[];
}

export const usersApi = {
  getMe: async (): Promise<MeOut> => {
    const r = await api.get('/users/me');
    return r.data;
  },

  getAll: async (): Promise<MeOut[]> => {
    const r = await api.get('/users/all');
    return r.data;
  },

  assignRole: async (userId: string, role: string) => {
    const payload = { user_id: userId, role };
    const r = await api.post('/users/assign-role', payload);
    return r.data;
  },
};

export default usersApi;
