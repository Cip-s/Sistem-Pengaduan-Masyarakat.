import { getApiBaseUrl } from "./config";
import { getToken } from "./auth";

async function safeJson(res: Response) {
  try {
    return await res.json();
  } catch {
    return null;
  }
}

export async function apiFetch(path: string, init: RequestInit = {}) {
  const token = await getToken();
  const headers: Record<string, string> = {
    ...(init.headers as Record<string, string> | undefined),
  };

  const isForm = typeof FormData !== "undefined" && init.body instanceof FormData;
  if (!isForm && !headers["Content-Type"]) headers["Content-Type"] = "application/json";
  if (token) headers.Authorization = `Bearer ${token}`;

  let res: Response;
  try {
    res = await fetch(`${getApiBaseUrl()}${path}`, { ...init, headers });
  } catch {
    throw new Error("Tidak dapat terhubung ke server.");
  }

  const data = await safeJson(res);
  if (!res.ok) throw new Error(data?.message || `Request gagal (HTTP ${res.status})`);
  return data;
}

