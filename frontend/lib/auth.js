const TOKEN_KEY = "sp_token";

export function getToken() {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  if (typeof window === "undefined") return;
  if (!token) window.localStorage.removeItem(TOKEN_KEY);
  else window.localStorage.setItem(TOKEN_KEY, token);
}

export function logout() {
  setToken(null);
}

export function getUserFromToken() {
  const token = getToken();
  if (!token) return null;
  try {
    const payloadPart = token.split(".")[1];
    if (!payloadPart) return null;
    const payloadJson = decodeBase64Url(payloadPart);
    return JSON.parse(payloadJson);
  } catch {
    return null;
  }
}

export async function login({ email, password }) {
  let res;
  try {
    res = await fetch(`${getApiBaseUrl()}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
  } catch {
    throw new Error(
      "Tidak dapat terhubung ke server. Pastikan backend `jwt-main` berjalan di http://localhost:3000.",
    );
  }

  const data = await safeJson(res);
  if (!res.ok) {
    throw new Error(
      data?.message || `Login gagal. (HTTP ${res.status || "?"})`,
    );
  }

  const token = data?.token;
  if (!token) throw new Error("Token tidak ditemukan dari server.");
  setToken(token);
  return data;
}

export async function register({ name, email, password }) {
  let res;
  try {
    res = await fetch(`${getApiBaseUrl()}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      // Backend expects: username, email, password (no phone field)
      body: JSON.stringify({ username: name, email, password }),
    });
  } catch {
    throw new Error(
      "Tidak dapat terhubung ke server. Pastikan backend `jwt-main` berjalan di http://localhost:3000.",
    );
  }

  const data = await safeJson(res);
  if (!res.ok) {
    throw new Error(
      data?.message || `Registrasi gagal. (HTTP ${res.status || "?"})`,
    );
  }
  return data;
}

export async function getProfile() {
  const token = getToken();
  if (!token) throw new Error("Belum login.");

  let res;
  try {
    res = await fetch(`${getApiBaseUrl()}/api/auth/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch {
    throw new Error(
      "Tidak dapat terhubung ke server. Pastikan backend `jwt-main` berjalan di http://localhost:3000.",
    );
  }
  const data = await safeJson(res);
  if (!res.ok) {
    throw new Error(
      data?.message || `Gagal memuat profil. (HTTP ${res.status || "?"})`,
    );
  }
  return data;
}

function getApiBaseUrl() {
  return process.env.NEXT_PUBLIC_API_URL || "";
}

function decodeBase64Url(input) {
  const base64 = input.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");
  if (typeof window === "undefined") {
    return Buffer.from(padded, "base64").toString("utf8");
  }
  return decodeURIComponent(
    Array.prototype.map
      .call(atob(padded), (c) => `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`)
      .join(""),
  );
}

async function safeJson(res) {
  try {
    return await res.json();
  } catch {
    return null;
  }
}
