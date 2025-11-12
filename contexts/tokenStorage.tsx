import * as SecureStore from "expo-secure-store";

const TOKEN_KEY = "klek.token";
const USER_KEY = "klek.user";
const EXP_KEY = "klek.exp";

export type StoredUser = { username: string };

export async function saveToken(token: string) {
  await SecureStore.setItemAsync(TOKEN_KEY, token);
}
export async function getToken() {
  return SecureStore.getItemAsync(TOKEN_KEY);
}
export async function deleteToken() {
  await SecureStore.deleteItemAsync(TOKEN_KEY);
}

export async function saveUser(user: StoredUser) {
  await SecureStore.setItemAsync(USER_KEY, JSON.stringify(user));
}
export async function getUser() {
  const raw = await SecureStore.getItemAsync(USER_KEY);
  return raw ? (JSON.parse(raw) as StoredUser) : null;
}
export async function deleteUser() {
  await SecureStore.deleteItemAsync(USER_KEY);
}

export async function saveExpiry(msEpoch: number) {
  await SecureStore.setItemAsync(EXP_KEY, String(msEpoch));
}
export async function getExpiry(): Promise<number | null> {
  const v = await SecureStore.getItemAsync(EXP_KEY);
  return v ? Number(v) : null;
}
export async function deleteExpiry() {
  await SecureStore.deleteItemAsync(EXP_KEY);
}

export async function clearAuth() {
  await Promise.all([deleteToken(), deleteUser(), deleteExpiry()]);
}
