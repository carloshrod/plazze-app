import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";
import Cookies from "js-cookie";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const MAX_RETRIES = 3;
const RETRY_BASE_DELAY = 1000; // ms

interface RetryableConfig extends InternalAxiosRequestConfig {
  __retryCount?: number;
}

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

export const client = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para añadir el token a las peticiones autenticadas
client.interceptors.request.use((config) => {
  const token = Cookies.get("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor de respuesta: reintento automático en 429 / errores de red (CORS-blocked 429)
client.interceptors.response.use(undefined, async (error: AxiosError) => {
  const config = error.config as RetryableConfig | undefined;
  if (!config) return Promise.reject(error);

  config.__retryCount ??= 0;

  const is429 = error.response?.status === 429;
  // Un 429 bloqueado por CORS llega como error de red sin response
  const isNetworkError = !error.response && !!error.request;

  if ((is429 || isNetworkError) && config.__retryCount < MAX_RETRIES) {
    config.__retryCount++;
    const delay = RETRY_BASE_DELAY * Math.pow(2, config.__retryCount - 1);
    console.warn(
      `⏳ Retry ${config.__retryCount}/${MAX_RETRIES} en ${delay}ms — ${config.url}`,
    );
    await wait(delay);
    return client(config);
  }

  return Promise.reject(error);
});
