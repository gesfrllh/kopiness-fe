export interface User {
  id: string;
  name: string;
  email: string;
  role: "SUPERADMIN" | "STOREOWNER" | "CUSTOMER" | undefined;
  store_id?: string;
}

export interface AuthPayload {
  token: string;
  user: User;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  role: string | null;
  isHydrated: boolean;

  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  hydrate: () => void;
  setError: (error: string | null) => void
}

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
  role: "CUSTOMER";
}

export interface AdminRegisterInput {
  name: string;
  email: string;
  password: string;
  role: "STOREOWNER";
}
