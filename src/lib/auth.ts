
export interface AuthUser {
  _id?: string;
  id?: string;
  fullName: string;
  email: string;
  phone?: string;
  role: "admin" | "bank_staff" | "customer";
  userStatus?: "active" | "inactive" | "blocked";
}

const TOKEN_KEY = "banking_token";
const USER_KEY = "banking_user";

export const saveAuth = (token: string, user: AuthUser): void => {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const getToken = (): string | null => {
  if (typeof window === "undefined") return null;

  return localStorage.getItem(TOKEN_KEY);
};

export const getUser = (): AuthUser | null => {
  if (typeof window === "undefined") return null;

  const user = localStorage.getItem(USER_KEY);

  if (!user) return null;

  try {
    return JSON.parse(user) as AuthUser;
  } catch {
    localStorage.removeItem(USER_KEY);
    return null;
  }
};

export const isAuthenticated = (): boolean => {
  return !!getToken() && !!getUser();
};

export const logout = (): void => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

export const getUserRole = (): AuthUser["role"] | null => {
  return getUser()?.role ?? null;
};
