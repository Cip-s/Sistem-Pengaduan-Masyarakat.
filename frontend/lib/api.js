import { getToken } from "./auth";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

export async function apiFetch(path, { headers, ...init } = {}) {
  const token = getToken();
  const finalHeaders = {
    ...(headers || {}),
  };

  if (!finalHeaders["Content-Type"] && !(init?.body instanceof FormData)) {
    finalHeaders["Content-Type"] = "application/json";
  }
  if (token) finalHeaders.Authorization = `Bearer ${token}`;

  let res;
  try {
    res = await fetch(`${API_BASE_URL}${path}`, {
      ...init,
      headers: finalHeaders,
    });
  } catch {
    throw new Error(
      "Tidak dapat terhubung ke server. Pastikan backend `jwt-main` berjalan di http://localhost:3000.",
    );
  }

  const data = await safeJson(res);
  if (!res.ok) {
    const message = data?.message || `Request gagal (${res.status}).`;
    throw new Error(message);
  }
  return data;
}

async function safeJson(res) {
  try {
    return await res.json();
  } catch {
    return null;
  }
}
