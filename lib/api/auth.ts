import apiClient from "@/lib/api";
import { AdminRegisterInput, RegisterInput } from "@/types/auth/user";

export const login = async (email: string, password: string) => {
  const response = await apiClient.post('auth/login', {
    email,
    password,
    credentials: 'include'
  });

  return response.data;
};

export const register = async (req: RegisterInput) => {
  const response = await apiClient.post('auth/register', req)
  return response.data;
};

export const adminCreateUser = async (req: AdminRegisterInput) => {
  const response = await apiClient.post('auth/storeowners', req)
  return response.data;
};

export const logout = async () => {
  await apiClient.post('auth/logout')
}
