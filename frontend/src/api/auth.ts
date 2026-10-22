import { api } from './client';
import { User } from '../types';

export async function login(email: string, password: string) {
  const response = await api.post<{ accessToken: string; user: User }>('/auth/login', {
    email,
    password,
  });
  return response.data;
}

export async function getMe() {
  const response = await api.get<User>('/auth/me');
  return response.data;
}
