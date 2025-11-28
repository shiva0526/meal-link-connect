import api from './axios';

export interface VolunteerClaimOut {
  id: string;
}

export const volunteersApi = {
  available: async () => {
    const r = await api.get('/volunteers/available');
    return r.data;
  },

  claim: async (donationId: string) => {
    const r = await api.post(`/volunteers/claim/${donationId}`);
    return r.data;
  },

  myDeliveries: async () => {
    const r = await api.get('/volunteers/my-deliveries');
    return r.data;
  },
};

export default volunteersApi;
