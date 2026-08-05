import apiClient from "@/lib/api";
import { AdminRegisterInput, RegisterInput } from "@/types/auth/user";

export const login = async (email: string, password: string) => {
  const response = await apiClient.post('auth/login', {
    email,
    password,
  });

  return response.data;
};

export const getMe = async () => {
  const response = await apiClient.get('auth/me')
  return response.data
}

export const register = async (req: RegisterInput) => {
  const payload = {
    name: req.name,
    email: req.email,
    password: req.password,
  }
  const response = await apiClient.post('auth/register', payload)
  return response.data;
};

export const adminCreateUser = async (req: AdminRegisterInput) => {
  const response = await apiClient.post('auth/storeowners', req)
  return response.data;
};

export const getUsers = async () => {
  const response = await apiClient.get('auth/users')
  return response.data
}

export const logout = async () => {
  await apiClient.post('auth/logout')
}
