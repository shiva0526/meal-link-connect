import api from './axios';

export type DonationStatus = 'pending' | 'approved' | 'rejected' | 'in_transit' | 'delivered';

export interface DonationOut {
  id: string;
  donor_id: string;
  donation_type: string;
  details?: Record<string, any> | null;
  delivery_method?: string | null;
  orphanage_id?: string | null;
  assigned_volunteer_id?: string | null;
  status: DonationStatus;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface DonationCreateIn {
  donor_id: string;
  donation_type: string;
  details?: Record<string, any> | null;
  delivery_method?: string | null;
  orphanage_id?: string | null;
}

export const donationsApi = {
  create: async (payload: DonationCreateIn): Promise<DonationOut> => {
    const r = await api.post('/donations/', payload);
    return r.data;
  },

  myDonations: async (): Promise<DonationOut[]> => {
    const r = await api.get('/donations/me');
    return r.data;
  },

  getAllPending: async (): Promise<DonationOut[]> => {
    const r = await api.get('/donations/pending');
    return r.data;
  },

  decision: async (donationId: string, approve: boolean, note?: string): Promise<DonationOut> => {
    const payload = { approve, note };
    const r = await api.patch(`/donations/${donationId}/decision`, payload);
    return r.data;
  },
};

export default donationsApi;
