export interface User {
  id: string;
  name: string;
}

export interface AuthPayload {
  token: string;
  user: User;
}

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  role: string | null;

  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  setError: (error: string | null) => void
}

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
  role: "ADMIN" | "CUSTOMER";
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "CUSTOMER" | undefined;
}
