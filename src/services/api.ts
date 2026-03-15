import axios from 'axios';
import { API_URL } from '../config/env';

export const apiClient = axios.create({
  baseURL: API_URL,
});

export interface CreateMailboxResponse {
  name: string;
  email: string;
}

export const createMailbox = async (): Promise<CreateMailboxResponse> => {
  const response = await apiClient.get<CreateMailboxResponse>('/api/mail/create');
  return response.data;
};
