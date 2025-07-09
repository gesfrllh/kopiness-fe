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
  token: string | null;
  loading: boolean;
  error: string | null;

  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  setUserFromCookie: () => void;
  setError: (error: string | null) => void
}
