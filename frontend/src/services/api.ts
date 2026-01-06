import axios from 'axios';
import { DashboardResponse } from '../types/metrics';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const dashboardApi = {
  getAllMetrics: async (): Promise<DashboardResponse> => {
    const response = await apiClient.get('/dashboard');
    return response.data;
  }
};