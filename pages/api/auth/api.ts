import apiClient from "@/lib/api";
import { RegisterInput } from "@/types/auth/user";
import Cookies from "js-cookie";

export const login = async (email: string, password: string) => {
  const response = await apiClient.post('auth/login', {
    email,
    password,
  });

  Cookies.set('token', response.data.token, { expires: 1 });
  return response.data;
};

export const register = async (req: RegisterInput) => {
  const response = await apiClient.post('auth/register', req)
  return response.data;
};

export const logout = async () => {
  const token = Cookies.get('token')
  await apiClient.post('auth/logout', {}, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  Cookies.remove('token');
} 