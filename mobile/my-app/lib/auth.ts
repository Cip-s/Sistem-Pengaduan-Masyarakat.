import AsyncStorage from "@react-native-async-storage/async-storage";
import { getApiBaseUrl } from "./config";

const TOKEN_KEY = "sp_token";

export async function getToken() {
  return AsyncStorage.getItem(TOKEN_KEY);
}

export async function setToken(token: string | null) {
  if (!token) return AsyncStorage.removeItem(TOKEN_KEY);
  return AsyncStorage.setItem(TOKEN_KEY, token);
}

export async function logout() {
  await setToken(null);
}

export function decodeJwt(token: string) {
  try {
    const payload = token.split(".")[1];
    if (!payload) return null;
    const json = decodeBase64Url(payload);
    return JSON.parse(json);
  } catch {
    return null;
  }
}

function decodeBase64Url(input: string) {
  const base64 = input.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");
  // atob exists on web; for native use Buffer via global polyfill isn't guaranteed
  // so we decode manually with base64 from JS runtime:
  // eslint-disable-next-line no-undef
  if (typeof atob === "function") {
    const str = atob(padded);
    try {
      return decodeURIComponent(
        Array.prototype.map
          .call(str, (c: string) => `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`)
          .join(""),
      );
    } catch {
      return str;
    }
  }
  // Hermes supports global Buffer in many Expo builds; if not, this will throw and be caught above.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const buf = (global as any).Buffer?.from?.(padded, "base64");
  return buf ? buf.toString("utf8") : "";
}

async function safeJson(res: Response) {
  try {
    return await res.json();
  } catch {
    return null;
  }
}

export async function login(params: { email: string; password: string }) {
  let res: Response;
  try {
    res = await fetch(`${getApiBaseUrl()}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: params.email, password: params.password }),
    });
  } catch {
    throw new Error("Tidak dapat terhubung ke server.");
  }

  const data = await safeJson(res);
  if (!res.ok) throw new Error(data?.message || `Login gagal (HTTP ${res.status})`);
  const token = data?.token;
  if (!token) throw new Error("Token tidak ditemukan dari server.");
  await setToken(token);
  return data;
}

export async function register(params: {
  username: string;
  email: string;
  password: string;
}) {
  let res: Response;
  try {
    res = await fetch(`${getApiBaseUrl()}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: params.username,
        email: params.email,
        password: params.password,
      }),
    });
  } catch {
    throw new Error("Tidak dapat terhubung ke server.");
  }
  const data = await safeJson(res);
  if (!res.ok) throw new Error(data?.message || `Register gagal (HTTP ${res.status})`);
  return data;
}

export async function getProfile() {
  const token = await getToken();
  if (!token) throw new Error("Anda belum login.");

  let res: Response;
  try {
    res = await fetch(`${getApiBaseUrl()}/api/auth/profile`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch {
    throw new Error("Tidak dapat terhubung ke server.");
  }

  const data = await safeJson(res);
  if (!res.ok) throw new Error(data?.message || `Gagal memuat profil (HTTP ${res.status})`);
  return data;
}
