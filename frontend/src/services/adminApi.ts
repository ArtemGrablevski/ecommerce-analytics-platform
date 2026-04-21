import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

export interface Partner {
  id: string;
  name: string;
  is_banned: boolean;
  active_until: string | null;
}

export interface PartnerUpdateRequest {
  is_banned?: boolean;
  active_until?: string | null;
}

const adminApiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

adminApiClient.interceptors.request.use(
  (config) => {
    const adminToken = localStorage.getItem('admin_token');
    if (adminToken) {
      config.headers['X-Admin-Token'] = adminToken;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

adminApiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('admin_token');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

export const adminApi = {
  getAllPartners: async (): Promise<Partner[]> => {
    const response = await adminApiClient.get('/partners');
    return response.data;
  },

  updatePartner: async (partnerId: string, updateData: PartnerUpdateRequest): Promise<{ message: string }> => {
    const response = await adminApiClient.patch(`/partners/${partnerId}`, updateData);
    return response.data;
  },

  setAdminToken: (token: string) => {
    localStorage.setItem('admin_token', token);
  },

  getAdminToken: (): string | null => {
    return localStorage.getItem('admin_token');
  },

  removeAdminToken: () => {
    localStorage.removeItem('admin_token');
  }
};