import { apiRequest } from "./api";

export type ApiUser = {
  id: number;
  username: string;
  email: string | null;
  nickname: string | null;
};

export type LoginResponse = {
  token: string;
  expiresAt: number;
  user: ApiUser;
};

export async function apiLogin(username: string, password: string) {
  return apiRequest<LoginResponse>("/api/auth/login", {
    method: "POST",
    body: { username, password },
  });
}

export async function apiLogout() {
  return apiRequest<{ status: string }>("/api/auth/logout", {
    method: "POST",
    auth: true,
  });
}

export type RegisterResponse = {
  id: number;
  username: string;
  email: string | null;
};

export async function apiRegister(
  username: string,
  email: string,
  password: string
) {
  return apiRequest<RegisterResponse>("/api/users", {
    method: "POST",
    body: { username, email, password },
  });
}

export async function apiUpdateNickname(nickname: string) {
  return apiRequest<{ message: string; user: ApiUser }>("/api/user/nickname", {
    method: "PUT",
    body: { nickname },
    auth: true,
  });
}
