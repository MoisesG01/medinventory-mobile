import Constants from "expo-constants";
import { Platform } from "react-native";

const DEFAULT_BASE_URL = "http://localhost:3000";

const expoExtra =
  Constants?.expoConfig?.extra ??
  Constants?.manifest?.extra ??
  Constants?.manifest2?.extra ??
  {};

const pickBaseUrl = () => {
  const envFallback =
    process.env.EXPO_PUBLIC_API_URL ?? process.env.API_URL ?? null;

  if (Platform.OS === "web") {
    if (expoExtra.apiUrlWeb) {
      return expoExtra.apiUrlWeb;
    }

    if (expoExtra.apiUrl) {
      return expoExtra.apiUrl;
    }

    if (envFallback) {
      return envFallback;
    }

    if (typeof window !== "undefined" && window.location) {
      const { protocol, hostname, port } = window.location;

      if (!port || port === "443" || port === "80") {
        return `${protocol}//${hostname}:3000`;
      }

      return `${protocol}//${hostname}:3000`;
    }

    return DEFAULT_BASE_URL;
  }

  return (
    expoExtra.apiUrlMobile ??
    expoExtra.apiUrl ??
    envFallback ??
    DEFAULT_BASE_URL
  );
};
const resolvedBaseUrl = pickBaseUrl() || DEFAULT_BASE_URL;

export const API_BASE_URL = resolvedBaseUrl.replace(/\/$/, "");

if (__DEV__) {
  console.log(`[API] Base URL resolvida: ${API_BASE_URL}`);
}

let authToken = null;

export const setAuthToken = (token) => {
  authToken = token;
};

export const clearAuthToken = () => {
  authToken = null;
};

const parseResponse = async (response) => {
  const contentType = response.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");

  if (isJson) {
    const data = await response.json();
    return data;
  }

  const text = await response.text();
  return text;
};

const buildError = (status, rawData) => {
  if (status === 401) {
    return {
      status,
      message: "Não autorizado. Faça login novamente.",
      data: rawData,
      code: "UNAUTHORIZED",
    };
  }

  if (status === 403) {
    return {
      status,
      message: "Você não tem permissão para executar esta ação.",
      data: rawData,
      code: "FORBIDDEN",
    };
  }

  if (status === 404) {
    return {
      status,
      message: "Recurso não encontrado.",
      data: rawData,
      code: "NOT_FOUND",
    };
  }

  const defaultMessage =
    rawData?.message ||
    rawData?.error ||
    "Erro inesperado ao comunicar com o servidor.";

  return {
    status,
    message: defaultMessage,
    data: rawData,
    code: "API_ERROR",
  };
};

const apiFetch = async (path, options = {}) => {
  const url =
    path.startsWith("http") || path.startsWith("https")
      ? path
      : `${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;

  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (authToken && !headers.Authorization) {
    headers.Authorization = `Bearer ${authToken}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  const data = await parseResponse(response);

  if (!response.ok) {
    throw buildError(response.status, data);
  }

  return data;
};

export const authApi = {
  register: (payload) =>
    apiFetch("/auth/register", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  login: (payload) =>
    apiFetch("/auth/login", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  verify: () =>
    apiFetch("/auth/verify", {
      method: "GET",
    }),
  me: () =>
    apiFetch("/users/me", {
      method: "GET",
    }),
  updateUser: (userId, payload) =>
    apiFetch(`/users/${userId}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    }),
  deleteUser: (userId) =>
    apiFetch(`/users/${userId}`, {
      method: "DELETE",
    }),
};

const buildQueryString = (params = {}) => {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (
      value !== undefined &&
      value !== null &&
      value !== "" &&
      !(typeof value === "number" && Number.isNaN(value))
    ) {
      searchParams.append(key, value);
    }
  });

  const query = searchParams.toString();
  return query ? `?${query}` : "";
};

export const equipmentApi = {
  list: (params = {}) =>
    apiFetch(`/equipamentos${buildQueryString(params)}`, {
      method: "GET",
    }),
  create: (payload) =>
    apiFetch("/equipamentos", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  getById: (id) =>
    apiFetch(`/equipamentos/${id}`, {
      method: "GET",
    }),
  update: (id, payload) =>
    apiFetch(`/equipamentos/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    }),
  updateStatus: (id, payload) =>
    apiFetch(`/equipamentos/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    }),
  remove: (id) =>
    apiFetch(`/equipamentos/${id}`, {
      method: "DELETE",
    }),
};

export const protectedApiGet = (path) =>
  apiFetch(path, {
    method: "GET",
  });

export default apiFetch;
