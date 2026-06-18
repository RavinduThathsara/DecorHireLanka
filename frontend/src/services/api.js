// frontend/src/services/api.js
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach token automatically
api.interceptors.request.use(
  (config) => {
    const customerToken = localStorage.getItem("customerToken");
    const adminToken = localStorage.getItem("adminToken");

    const token = adminToken || customerToken;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Helper for manually setting/removing token
export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common.Authorization;
  }
};

const getApiAssetBaseUrl = () => {
  const configuredBaseUrl = api.defaults.baseURL || "";
  if (!configuredBaseUrl) return "";

  try {
    const url = new URL(configuredBaseUrl, window.location.origin);
    url.pathname = url.pathname.replace(/\/api\/?$/, "/");
    url.search = "";
    url.hash = "";
    return url.toString().replace(/\/$/, "");
  } catch {
    return "";
  }
};

export const resolveAssetUrl = (assetPath) => {
  if (!assetPath) return "";
  if (/^https?:\/\//i.test(assetPath)) return assetPath;

  const normalizedPath = assetPath.startsWith("/") ? assetPath : `/${assetPath}`;
  const assetBaseUrl = getApiAssetBaseUrl();

  return assetBaseUrl ? `${assetBaseUrl}${normalizedPath}` : normalizedPath;
};

export default api;
