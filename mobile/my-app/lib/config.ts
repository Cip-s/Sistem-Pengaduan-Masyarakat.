import Constants from "expo-constants";

function getHostFromExpo() {
  const hostUri =
    Constants.expoConfig?.hostUri ||
    // Fallbacks for some environments
    Constants.expoConfig?.extra?.hostUri ||
    "";
  const host = String(hostUri).split(":")[0];
  return host || "";
}

export function getApiBaseUrl() {
  const env = process.env.EXPO_PUBLIC_API_URL;
  if (env) return env.replace(/\/$/, "");

  const host = getHostFromExpo();
  if (host) return `http://${host}:3000`;

  // Last resort (works only on web / same machine)
  return "http://localhost:3000";
}

